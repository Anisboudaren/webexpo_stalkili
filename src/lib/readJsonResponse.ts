/**
 * Parse a fetch Response as JSON. Next.js and proxies often return HTML (e.g. <!DOCTYPE)
 * for 404/500 pages — `res.json()` then throws "Unexpected token '<'".
 */
export async function readJsonResponse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const trimmed = text.trimStart();
  if (trimmed.startsWith('<')) {
    throw new Error(
      'The server returned HTML instead of JSON. Check that Next.js is running, the URL points at this app’s API routes, and .env.local includes SERPAPI_API_KEY (restart dev server after changing env).'
    );
  }
  try {
    return JSON.parse(text) as T;
  } catch {
    const preview = trimmed.length > 120 ? `${trimmed.slice(0, 120)}…` : trimmed;
    throw new Error(`Invalid JSON (HTTP ${res.status}): ${preview || '(empty body)'}`);
  }
}
