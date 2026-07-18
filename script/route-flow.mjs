import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const chromeCandidate = [
  process.env.DAAN_CHROME_PATH,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/google-chrome-stable",
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
      server.close((error) => {
        if (error) rejectPort(error);
        else if (port) resolvePort(port);
        else rejectPort(new Error("Could not reserve a local port."));
      });
    });
  });
}

async function waitForHttp(url, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The owned local server is still starting.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 80));
  }
  throw new Error(`Local preview did not become ready: ${url}`);
}

async function stopOwned(child) {
  if (!child?.pid || child.exitCode !== null) return;
  const exited = new Promise((resolveExit) => child.once("exit", resolveExit));
  try {
    process.kill(-child.pid, "SIGTERM");
  } catch {
    child.kill("SIGTERM");
  }
  await Promise.race([exited, new Promise((resolveWait) => setTimeout(resolveWait, 1_500))]);
  if (child.exitCode === null) {
    try {
      process.kill(-child.pid, "SIGKILL");
    } catch {
      child.kill("SIGKILL");
    }
  }
}

class CdpSession {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.waiter = new Map();
    socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (message.id) {
        const pending = this.pending.get(message.id);
        if (!pending) return;
        this.pending.delete(message.id);
        if (message.error) pending.reject(new Error(message.error.message));
        else pending.resolve(message.result);
        return;
      }
      if (!message.method) return;
      const waiter = this.waiter.get(message.method) ?? [];
      this.waiter.delete(message.method);
      for (const resolveWaiter of waiter) resolveWaiter(message.params);
    });
  }

  send(method, parameter = {}) {
    const id = this.nextId++;
    return new Promise((resolveCommand, rejectCommand) => {
      this.pending.set(id, { resolve: resolveCommand, reject: rejectCommand });
      this.socket.send(JSON.stringify({ id, method, params: parameter }));
    });
  }

  wait(method, timeoutMs = 10_000) {
    return new Promise((resolveEvent, rejectEvent) => {
      const timeout = setTimeout(() => rejectEvent(new Error(`Timed out waiting for ${method}`)), timeoutMs);
      const waiter = this.waiter.get(method) ?? [];
      waiter.push((parameter) => {
        clearTimeout(timeout);
        resolveEvent(parameter);
      });
      this.waiter.set(method, waiter);
    });
  }
}

async function connectCdp(webSocketDebuggerUrl) {
  const socket = new WebSocket(webSocketDebuggerUrl);
  await new Promise((resolveOpen, rejectOpen) => {
    socket.addEventListener("open", resolveOpen, { once: true });
    socket.addEventListener("error", rejectOpen, { once: true });
  });
  return new CdpSession(socket);
}

async function run() {
  const chromePath = chromeCandidate.find((candidate) => existsSync(candidate));
  invariant(chromePath, "Chrome was not found. Set DAAN_CHROME_PATH to an installed Chrome binary.");

  const previewPort = await reservePort();
  const debugPort = await reservePort();
  const profilePath = await mkdtemp(join(tmpdir(), "daan-route-flow-"));
  const previewUrl = `http://127.0.0.1:${previewPort}/`;
  let viteProcess;
  let chromeProcess;
  let session;

  try {
    viteProcess = spawn(
      "npm",
      ["run", "dev", "--workspace", "apps/web", "--", "--host", "127.0.0.1", "--port", String(previewPort), "--strictPort"],
      { cwd: repoRoot, detached: true, stdio: ["ignore", "pipe", "pipe"] },
    );
    await waitForHttp(previewUrl);

    chromeProcess = spawn(
      chromePath,
      [
        "--headless=new",
        "--no-first-run",
        "--no-default-browser-check",
        "--disable-background-networking",
        `--remote-debugging-port=${debugPort}`,
        `--user-data-dir=${profilePath}`,
        "about:blank",
      ],
      { detached: true, stdio: ["ignore", "pipe", "pipe"] },
    );
    await waitForHttp(`http://127.0.0.1:${debugPort}/json/version`);

    const target = await fetch(`http://127.0.0.1:${debugPort}/json/list`).then((response) => response.json());
    const pageTarget = target.find((item) => item.type === "page");
    invariant(pageTarget?.webSocketDebuggerUrl, "Chrome did not expose a page target.");
    session = await connectCdp(pageTarget.webSocketDebuggerUrl);

    const exception = [];
    const consoleError = [];
    const originalMessage = session.socket.onmessage;
    session.socket.addEventListener("message", (event) => {
      const message = JSON.parse(String(event.data));
      if (message.method === "Runtime.exceptionThrown") exception.push(message.params.exceptionDetails?.text ?? "Runtime exception");
      if (message.method === "Runtime.consoleAPICalled" && message.params.type === "error") {
        consoleError.push(message.params.args?.map((item) => item.value ?? item.description).join(" ") ?? "Console error");
      }
    });
    void originalMessage;

    await session.send("Page.enable");
    await session.send("Runtime.enable");
    await session.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await session.send("Page.addScriptToEvaluateOnNewDocument", {
      source: `Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText: async (value) => { window.__daanClipboard = value; } },
      });`,
    });

    const evaluate = async (expression) => {
      const response = await session.send("Runtime.evaluate", {
        expression,
        awaitPromise: true,
        returnByValue: true,
        userGesture: true,
      });
      if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
      return response.result?.value;
    };
    const waitFor = async (expression, message, timeoutMs = 5_000) => {
      const deadline = Date.now() + timeoutMs;
      while (Date.now() < deadline) {
        if (await evaluate(expression)) return;
        await new Promise((resolveWait) => setTimeout(resolveWait, 50));
      }
      throw new Error(message);
    };

    const loaded = session.wait("Page.loadEventFired");
    await session.send("Page.navigate", { url: previewUrl });
    await loaded;
    await waitFor("Boolean(document.querySelector('#route-result-summary'))", "Initial route receipt did not render.");
    invariant(await evaluate("window.innerWidth === 390"), "The browser proof did not run at 390 CSS pixels.");

    await evaluate(`(() => {
      const summary = document.querySelector('details.daan-detail > summary');
      summary?.click();
      return Boolean(summary);
    })()`);
    await waitFor("Boolean(document.querySelector('button') && [...document.querySelectorAll('button')].find((item) => item.textContent?.trim() === 'Copy route receipt'))", "Copy action did not become available.");
    await evaluate(`(() => {
      const button = [...document.querySelectorAll('button')].find((item) => item.textContent?.trim() === 'Copy route receipt');
      button?.click();
      return Boolean(button);
    })()`);
    await waitFor("[...document.querySelectorAll('button')].some((item) => item.textContent?.trim() === 'Copied')", "Copy feedback did not reach the copied state.");

    await evaluate(`(() => {
      const button = [...document.querySelectorAll('button')].find((item) => item.textContent?.trim() === '6 AM');
      button?.click();
      return Boolean(button);
    })()`);
    await waitFor("location.search.includes('departureTime=06%3A00') && document.querySelector('button[aria-pressed=true]')?.textContent?.trim() === '6 AM'", "6 AM did not update the receipt URL and pressed state.");
    invariant(
      await evaluate("[...document.querySelectorAll('button')].some((item) => item.textContent?.trim() === 'Copy route receipt')"),
      "Copy feedback did not reset when departure time changed.",
    );

    await evaluate(`(() => {
      const detail = document.querySelector('details.daan-detail');
      const summary = detail?.querySelector('summary');
      if (!detail || !summary) return false;
      if (!detail.open) summary.click();
      detail.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      return true;
    })()`);
    await waitFor("!document.querySelector('details.daan-detail')?.open && document.activeElement === document.querySelector('details.daan-detail > summary')", "Evidence disclosure did not close and return focus on Escape.");

    await evaluate(`(() => {
      const thread = document.querySelector('details.daan-thread');
      const summary = thread?.querySelector('summary');
      if (!thread || !summary) return false;
      if (!thread.open) summary.click();
      return true;
    })()`);
    await waitFor("document.querySelector('details.daan-thread')?.open === true", "Community disclosure did not open.");
    await evaluate(`(() => {
      const thread = document.querySelector('details.daan-thread');
      thread?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      return Boolean(thread);
    })()`);
    await waitFor("!document.querySelector('details.daan-thread')?.open && document.activeElement === document.querySelector('details.daan-thread > summary')", "Community disclosure did not close and return focus on Escape.");

    await evaluate(`(() => {
      const input = document.querySelector('input[placeholder="Where are you coming from?"]');
      if (!input) return false;
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, 'Ateneo');
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    })()`);
    await waitFor("!document.querySelector('#route-result-summary') && Boolean([...document.querySelectorAll('h2')].find((item) => item.textContent === 'Route needs an update'))", "Editing the origin did not invalidate the stale receipt.");
    invariant(await evaluate("document.querySelector('button.route-submit')?.disabled === true"), "Draft endpoint did not disable route submission.");

    await evaluate(`(() => {
      const option = [...document.querySelectorAll('[role=option]')].find((item) => item.textContent?.includes('Ateneo Gate 2.5'));
      option?.click();
      return Boolean(option);
    })()`);
    await waitFor("document.querySelector('button.route-submit')?.disabled === false", "Valid origin selection did not enable route submission.");
    await evaluate(`(() => {
      const submit = document.querySelector('button.route-submit');
      submit?.click();
      return Boolean(submit);
    })()`);
    await waitFor("Boolean(document.querySelector('#route-result-summary')) && document.activeElement?.id === 'route-result-summary'", "Fresh route submit did not restore and focus the receipt.");

    invariant(exception.length === 0, `Runtime exception: ${exception.join(" | ")}`);
    invariant(consoleError.length === 0, `Console error: ${consoleError.join(" | ")}`);

    process.stdout.write(`${JSON.stringify({
      viewport: "390x844",
      departureTime: "06:00",
      staleReceipt: "cleared",
      copyState: "reset",
      disclosureFocus: "returned",
      routeFocus: "returned",
      runtimeException: 0,
      consoleError: 0,
    }, null, 2)}\n`);
  } finally {
    session?.socket.close();
    await stopOwned(chromeProcess);
    await stopOwned(viteProcess);
    await rm(profilePath, { recursive: true, force: true });
  }
}

await run();
