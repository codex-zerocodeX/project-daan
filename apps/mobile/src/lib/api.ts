const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8787";

/** Abort a request that has not responded within this window (bad wifi guard). */
const REQUEST_TIMEOUT_MS = 15_000;

/**
 * An error carrying the HTTP status so callers can distinguish expected
 * outcomes (e.g. compose returning 422 "no route could be composed") from
 * genuine failures. `status` is 0 when the request never reached the server.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly issues?: unknown[];

  constructor(message: string, status: number, issues?: unknown[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.issues = issues;
  }
}

type Envelope<T> = { data?: T; error?: string; issues?: unknown[] };

/**
 * Parse a response body as our `{data}` / `{error}` envelope. The body is not
 * guaranteed to be JSON at all - an unmounted route answers with plain text
 * "404 Not Found" - so a parse failure must not mask the real status.
 */
async function parseEnvelope<T>(res: Response): Promise<Envelope<T>> {
  try {
    return (await res.json()) as Envelope<T>;
  } catch {
    return {};
  }
}

function toApiError(res: Response, json: Envelope<unknown>): ApiError {
  return new ApiError(
    json.error ?? `Request failed with status ${res.status}`,
    res.status,
    json.issues,
  );
}

/** Wrap transport-level failures (offline, DNS, timeout) in an ApiError. */
function toNetworkError(err: unknown): ApiError {
  if (err instanceof DOMException && err.name === "TimeoutError") {
    return new ApiError("Request timed out. Check your connection.", 0);
  }
  if (err instanceof ApiError) {
    return err;
  }
  return new ApiError("Network request failed. Check your connection.", 0);
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    throw toNetworkError(err);
  }

  const json = await parseEnvelope<T>(res);
  if (!res.ok || json.data === undefined) {
    throw toApiError(res, json);
  }
  return json.data;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
