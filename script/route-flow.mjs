import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const chromeCandidate = [
  process.env.ALITAPTAP_CHROME_PATH,
  process.env.DAAN_CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome-stable",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

function invariant(condition, message) {
  if (!condition) throw new Error(message);
}

async function reservePort() {
  return new Promise((resolvePort, rejectPort) => {
    const server = createServer();
    server.unref();
    server.on("error", rejectPort);
    server.listen(0, "127.0.0.1", () => {
      const address = server.address();
      const port = typeof address === "object" && address ? address.port : null;
      server.close((error) => error ? rejectPort(error) : port ? resolvePort(port) : rejectPort(new Error("No local port.")));
    });
  });
}

async function waitForHttp(url, readDiagnostic = () => "") {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    try {
      if ((await fetch(url)).ok) return;
    } catch {
      // The owned local process is still starting.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 80));
  }
  const diagnostic = readDiagnostic().trim();
  throw new Error(`Local process did not become ready: ${url}${diagnostic ? `\n${diagnostic}` : ""}`);
}

function drainOutput(child) {
  let output = "";
  for (const stream of [child.stdout, child.stderr]) {
    stream?.setEncoding("utf8");
    stream?.on("data", (chunk) => {
      output = `${output}${chunk}`.slice(-8_000);
    });
  }
  return () => output;
}

async function stopOwned(child) {
  if (!child?.pid || child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise((resolveExit) => child.once("exit", resolveExit));
  try { process.kill(-child.pid, "SIGTERM"); } catch { child.kill("SIGTERM"); }
  await Promise.race([exited, new Promise((resolveWait) => setTimeout(resolveWait, 1_500))]);
  if (child.exitCode === null) {
    try { process.kill(-child.pid, "SIGKILL"); } catch { child.kill("SIGKILL"); }
  }
}

class CdpSession {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.waiter = new Map();
    this.listener = [];
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      for (const listen of this.listener) listen(message);
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        clearTimeout(pending.timeout);
        return message.error ? pending.reject(new Error(message.error.message)) : pending.resolve(message.result);
      }
      const waiter = this.waiter.get(message.method) ?? [];
      this.waiter.delete(message.method);
      for (const resolveWaiter of waiter) resolveWaiter(message.params);
    });
    const rejectPending = () => {
      const error = new Error("Chrome closed the DevTools connection.");
      for (const pending of this.pending.values()) {
        clearTimeout(pending.timeout);
        pending.reject(error);
      }
      this.pending.clear();
    };
    socket.addEventListener("close", rejectPending);
    socket.addEventListener("error", rejectPending);
  }

  send(method, parameter = {}) {
    const id = this.nextId++;
    return new Promise((resolveCommand, rejectCommand) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        rejectCommand(new Error(`Timed out running ${method}.`));
      }, 10_000);
      this.pending.set(id, { resolve: resolveCommand, reject: rejectCommand, timeout });
      this.socket.send(JSON.stringify({ id, method, params: parameter }));
    });
  }

  wait(method) {
    return new Promise((resolveEvent, rejectEvent) => {
      const timeout = setTimeout(() => rejectEvent(new Error(`Timed out waiting for ${method}`)), 10_000);
      const waiter = this.waiter.get(method) ?? [];
      waiter.push((parameter) => { clearTimeout(timeout); resolveEvent(parameter); });
      this.waiter.set(method, waiter);
    });
  }
}

async function connectCdp(url) {
  const socket = new WebSocket(url);
  await new Promise((resolveOpen, rejectOpen) => {
    const timeout = setTimeout(() => rejectOpen(new Error("Timed out opening the DevTools connection.")), 10_000);
    socket.addEventListener("open", () => { clearTimeout(timeout); resolveOpen(); }, { once: true });
    socket.addEventListener("error", (error) => { clearTimeout(timeout); rejectOpen(error); }, { once: true });
  });
  return new CdpSession(socket);
}

async function run() {
  const chromePath = chromeCandidate.find((candidate) => existsSync(candidate));
  invariant(chromePath, "Chrome was not found. Set ALITAPTAP_CHROME_PATH (or legacy DAAN_CHROME_PATH).");
  const previewPort = await reservePort();
  const debugPort = await reservePort();
  const profilePath = await mkdtemp(join(tmpdir(), "alitaptap-route-flow-"));
  const previewUrl = `http://127.0.0.1:${previewPort}/`;
  let viteProcess;
  let chromeProcess;
  let session;

  try {
    viteProcess = spawn("npm", ["run", "preview", "--workspace", "apps/web", "--", "--host", "127.0.0.1", "--port", String(previewPort), "--strictPort"], {
      cwd: repoRoot, detached: true, stdio: ["ignore", "pipe", "pipe"],
    });
    const readViteOutput = drainOutput(viteProcess);
    await waitForHttp(previewUrl, readViteOutput);
    chromeProcess = spawn(chromePath, ["--headless=new", "--no-first-run", "--disable-background-networking", `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profilePath}`, "about:blank"], {
      detached: true, stdio: ["ignore", "pipe", "pipe"],
    });
    const readChromeOutput = drainOutput(chromeProcess);
    await waitForHttp(`http://127.0.0.1:${debugPort}/json/version`, readChromeOutput);
    const target = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((response) => response.json());
    const page = target.find((item) => item.type === "page");
    invariant(page?.webSocketDebuggerUrl, "Chrome did not expose a page target.");
    session = await connectCdp(page.webSocketDebuggerUrl);

    const exception = [];
    const consoleError = [];
    session.listener.push((message) => {
      if (message.method === "Runtime.exceptionThrown") exception.push(message.params.exceptionDetails?.text ?? "Runtime exception");
      if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
        consoleError.push(message.params.args?.map((item) => item.value ?? item.description).join(" ") ?? "Console error");
      }
    });

    await session.send("Page.enable");
    await session.send("Runtime.enable");
    await session.send("Emulation.setDeviceMetricsOverride", { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
    await session.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async (value) => { window.__daanClipboard = value; } } });`,
    });

    const evaluate = async (expression) => {
      const response = await session.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true, userGesture: true });
      if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
      return response.result?.value;
    };
    const waitFor = async (expression, message) => {
      const deadline = Date.now() + 5_000;
      while (Date.now() < deadline) {
        if (await evaluate(expression)) return;
        await new Promise((resolveWait) => setTimeout(resolveWait, 50));
      }
      throw new Error(message);
    };
    const pressEscape = async () => {
      await session.send("Input.dispatchKeyEvent", { type: "keyDown", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
      await session.send("Input.dispatchKeyEvent", { type: "keyUp", key: "Escape", code: "Escape", windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
    };

    const loaded = session.wait("Page.loadEventFired");
    await session.send("Page.navigate", { url: previewUrl });
    await loaded;
    await waitFor("Boolean(document.querySelector('#route-result-summary'))", "Initial receipt did not render.");
    invariant(await evaluate("window.innerWidth === 390"), "Expected a 390px viewport.");
    invariant(await evaluate("document.documentElement.scrollWidth <= 390"), "The route view overflows the 390px viewport.");

    await evaluate("document.querySelector('details.alitaptap-detail > summary')?.click()");
    await waitFor("[...document.querySelectorAll('button')].some((item) => item.textContent?.trim() === 'Copy route receipt')", "Copy action did not appear.");
    await evaluate("[...document.querySelectorAll('button')].find((item) => item.textContent?.trim() === 'Copy route receipt')?.click()");
    await waitFor("[...document.querySelectorAll('button')].some((item) => item.textContent?.trim() === 'Copied')", "Copy feedback did not appear.");
    await evaluate("[...document.querySelectorAll('button')].find((item) => item.textContent?.trim() === '6 AM')?.click()");
    await waitFor("location.search.includes('departureTime=06%3A00') && document.querySelector('button[aria-pressed=true]')?.textContent?.trim() === '6 AM'", "Departure state did not persist.");
    invariant(await evaluate("[...document.querySelectorAll('button')].some((item) => item.textContent?.trim() === 'Copy route receipt')"), "Copy state did not reset.");

    const reloaded = session.wait("Page.loadEventFired");
    await session.send("Page.reload", { ignoreCache: true });
    await reloaded;
    await waitFor("Boolean(document.querySelector('#route-result-summary')) && location.search.includes('departureTime=06%3A00') && document.querySelector('button[aria-pressed=true]')?.textContent?.trim() === '6 AM'", "Receipt did not restore after reload.");
    invariant(await evaluate("document.documentElement.scrollWidth <= 390"), "The restored route view overflows the 390px viewport.");

    await evaluate("document.querySelector('details.alitaptap-detail > summary')?.click()");
    await waitFor("document.querySelector('details.alitaptap-detail')?.open === true", "Evidence disclosure did not reopen.");
    await evaluate("[...document.querySelectorAll('details.alitaptap-detail button')].find((item) => item.textContent?.trim() === 'Copy route receipt')?.focus()");
    await waitFor("document.querySelector('details.alitaptap-detail')?.contains(document.activeElement) && document.activeElement?.tagName === 'BUTTON'", "Evidence descendant did not receive focus.");
    await pressEscape();
    await waitFor("!document.querySelector('details.alitaptap-detail')?.open && document.activeElement === document.querySelector('details.alitaptap-detail > summary')", "Evidence Escape/focus failed.");
    await evaluate("document.querySelector('details.alitaptap-thread > summary')?.click()");
    await waitFor("document.querySelector('details.alitaptap-thread')?.open === true", "Community disclosure did not open.");
    await evaluate("document.querySelector('details.alitaptap-thread button')?.focus()");
    await waitFor("document.querySelector('details.alitaptap-thread')?.contains(document.activeElement) && document.activeElement?.tagName === 'BUTTON'", "Community descendant did not receive focus.");
    await pressEscape();
    try {
      await waitFor("!document.querySelector('details.alitaptap-thread')?.open && document.activeElement === document.querySelector('details.alitaptap-thread > summary')", "Community Escape/focus failed.");
    } catch (error) {
      const disclosureState = await evaluate(`(() => ({ open: document.querySelector('details.alitaptap-thread')?.open, activeTag: document.activeElement?.tagName, activeText: document.activeElement?.textContent?.trim(), summaryFocused: document.activeElement === document.querySelector('details.alitaptap-thread > summary'), href: location.href }))()`);
      error.message = `${error.message}\n${JSON.stringify(disclosureState)}`;
      throw error;
    }

    await evaluate(`(() => { const input = document.querySelector('input[placeholder="Where are you coming from?"]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'Ateneo'); input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
    await waitFor("!document.querySelector('#route-result-summary') && [...document.querySelectorAll('h2')].some((item) => item.textContent === 'Route needs an update')", "Stale receipt did not clear.");
    invariant(await evaluate("document.querySelector('button.route-submit')?.disabled === true"), "Draft route remained submittable.");
    invariant(await evaluate("!document.querySelector('.alitaptap-map-hint')"), "Stale map kept its checkpoint hint.");
    await evaluate("[...document.querySelectorAll('[role=option]')].find((item) => item.textContent?.includes('Ateneo Gate 2.5'))?.click()");
    await waitFor("document.querySelector('button.route-submit')?.disabled === false", "Valid place did not enable submit.");
    await evaluate("document.querySelector('button.route-submit')?.click()");
    await waitFor("Boolean(document.querySelector('#route-result-summary')) && document.activeElement?.id === 'route-result-summary'", "Fresh receipt did not render and focus.");

    const routeHistoryUrl = await evaluate("location.href");
    await evaluate("history.pushState(history.state, '', `${location.pathname}${location.search}#receipt-history`)");
    await waitFor(`location.href !== ${JSON.stringify(routeHistoryUrl)}`, "Receipt history setup did not create a browser entry.");
    await evaluate(`(() => { const input = document.querySelector('input[placeholder="Where are you coming from?"]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'Draft place'); input.dispatchEvent(new Event('input', { bubbles: true })); })()`);
    await waitFor("!document.querySelector('#route-result-summary')", "History regression setup did not invalidate the receipt.");
    await evaluate("history.back()");
    try {
      await waitFor("Boolean(document.querySelector('#route-result-summary')) && document.querySelector('input[placeholder=\"Where are you coming from?\"]')?.value === 'Ateneo Gate 2.5' && document.querySelector('button.route-submit')?.disabled === false", "Browser history restored a receipt behind invalid visible text.");
    } catch (error) {
      const historyState = await evaluate(`(() => ({ href: location.href, input: document.querySelector('input[placeholder="Where are you coming from?"]')?.value, hasReceipt: Boolean(document.querySelector('#route-result-summary')), isSubmitDisabled: document.querySelector('button.route-submit')?.disabled }))()`);
      error.message = `${error.message}\n${JSON.stringify(historyState)}`;
      throw error;
    }

    invariant(exception.length === 0, `Runtime exception: ${exception.join(" | ")}`);
    invariant(consoleError.length === 0, `Console error: ${consoleError.join(" | ")}`);
    process.stdout.write(`${JSON.stringify({ viewport: "390x844", horizontalOverflow: "none", departureTime: "06:00", reloadReceipt: "restored", historyReceipt: "restored", staleReceipt: "cleared", copyState: "reset", disclosureFocus: "returned", keyboardInput: "trusted", routeFocus: "returned", runtimeException: 0, consoleError: 0 }, null, 2)}\n`);
  } finally {
    session?.socket.close();
    await stopOwned(chromeProcess);
    await stopOwned(viteProcess);
    await rm(profilePath, { recursive: true, force: true });
  }
}

await run();
