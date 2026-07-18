const API_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8787";

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  const json = (await res.json()) as { data?: T; error?: string };
  if (!res.ok || json.data === undefined) {
    throw new Error(json.error ?? `Request failed with status ${res.status}`);
  }
  return json.data;
}
