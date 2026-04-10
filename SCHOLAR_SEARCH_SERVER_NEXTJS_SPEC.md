# Scholar search server — specification for Next.js parity

This document describes the behavior of the Flask server in `webexpo_stalkili/server.py` so you can reproduce the same HTTP contract and upstream integration in a **Next.js** project (App Router route handlers or API routes).

---

## 1. Purpose

The server exposes a single read-style endpoint that:

1. Accepts a free-text search query `q` (Google Scholar–style query, e.g. author name or topic).
2. Calls **SerpAPI** with `engine=google_scholar` and that query.
3. Extracts **`profiles.authors`** from the JSON response.
4. Returns a JSON array with one object: `{ "authors": <authors> }`.

**Note:** The Python file imports `scholarly` but **does not use it** in the request path. Parity with the current server means **SerpAPI only**; no `scholarly` calls are required unless you intentionally extend behavior.

---

## 2. Runtime and dependencies (reference implementation)

| Piece | Flask reference | Next.js equivalent |
|--------|-----------------|---------------------|
| HTTP server | Flask | Next.js `route.ts` (Route Handler) |
| Outbound HTTP | `requests.get(..., timeout=60)` | `fetch(url, { signal: AbortSignal.timeout(60_000) })` or similar |
| JSON response | `jsonify(...)` | `Response.json(...)` or `NextResponse.json(...)` |
| Env | Hardcoded key in reference (**should not be copied**) | `process.env.SERPAPI_API_KEY` (server-only) |

**Python packages used in `server.py`:** `flask`, `requests`, `scholarly` (unused at runtime for `/search`).

---

## 3. Environment variables (recommended for Next.js)

| Variable | Required | Description |
|----------|----------|-------------|
| `SERPAPI_API_KEY` | Yes | SerpAPI secret key. Never commit; never expose to the browser. |

The reference Flask code inlined the key; your Next.js implementation should **only** read it from the environment inside **server** code (route handlers, server actions, server components that do not leak the key).

---

## 4. Upstream API: SerpAPI Google Scholar

**Base URL:** `https://serpapi.com/search`

**Method:** `GET`

**Query parameters (must match current behavior):**

| Parameter | Value | Notes |
|-----------|--------|--------|
| `engine` | `google_scholar` | Fixed. |
| `q` | User-supplied string (trimmed) | From the client request. |
| `api_key` | SerpAPI key | From `SERPAPI_API_KEY`. |

**Timeout:** 60 seconds (reference uses `timeout=60`).

**Success:** HTTP 200 with JSON body. The server expects a top-level object that includes:

```json
{
  "profiles": {
    "authors": [ /* array of author profile objects from SerpAPI */ ]
  }
}
```

**Reference implementation behavior:** It assigns `authors = data["profiles"]["authors"]` with **no** null checks. If SerpAPI omits `profiles` or `authors`, the Flask app would raise and return a 500 unless you add error handling. For **strict parity**, replicate that; for **production**, add safe defaults and explicit error responses (recommended in Next.js).

Author objects are whatever SerpAPI returns (e.g. fields such as name, link, affiliations, cited by, etc., depending on engine and result). The server does not transform them; it only ensures JSON-serializable output in Python via `_json_safe` (see below).

**Errors from SerpAPI:** The reference uses `response.raise_for_status()`, so non-2xx HTTP statuses propagate as server errors unless caught.

---

## 5. Public HTTP API (what clients call)

### 5.1 `GET /search`

**Role:** Search Google Scholar (via SerpAPI) and return the `profiles.authors` array wrapped in the agreed JSON shape.

#### Input: query parameter `q`

- **Name:** `q`
- **Type:** string
- **Required:** Yes (after trim). If missing or blank → **400**.

Example:

```http
GET /search?q=Zakaria
```

#### Input: JSON body (fallback)

The reference `_get_q()` logic:

1. Read `q` from `request.args.get("q")`.
2. If `q` is `None` **or** a string that is empty/whitespace-only, parse JSON body (silent) and use `body.get("q")`.

So for **GET** requests, a JSON body is unusual but supported if the query string `q` is absent or blank.

**Important for Next.js:** `GET` requests with bodies are discouraged by HTTP and some clients omit them. If you need POST for JSON-only clients, that is an **extension** beyond the current Flask app (which only registers `@app.get("/search")`).

#### Validation

- After resolving `q`, it must be a **non-empty string** after `.strip()`.
- Otherwise respond with **400** and JSON:

```json
{
  "error": "Parameter \"q\" is required (query string or JSON body)."
}
```

(Exact message string if you want byte-for-byte parity with the Flask `jsonify` message.)

#### Success response

- **Status:** `200`
- **Content-Type:** `application/json`
- **Body:** A JSON **array** with **exactly one** element — an object with key `authors`:

```json
[
  {
    "authors": [ /* SerpAPI profiles.authors */ ]
  }
]
```

This is intentional in the reference: `out = [{"authors": authors}]` then `return jsonify(out), 200`.

#### JSON serialization semantics (Python `_json_safe`)

The reference defines `_json_safe` for responses (currently the top-level structure is only dict/list/primitives, but this documents intent if nested values are non-JSON types):

- `dict` → keys coerced with `str(k)`, values recurse.
- `list` / `tuple` → list, values recurse.
- `str`, `int`, `float`, `bool`, `None` → unchanged.
- **Anything else** → `str(obj)`.

In TypeScript/Next.js, `JSON.stringify` already drops or fails on some types (e.g. `BigInt`, `undefined` in objects); for parity, stringify unknown nested values or omit non-serializable fields.

---

## 6. Example client calls

### cURL (query string)

```bash
curl -sS "http://localhost:5000/search?q=Zakaria"
```

(Adjust host/port to your Flask `app.run` or your Next.js dev server.)

### fetch (browser or server)

```ts
const res = await fetch("/api/search?q=" + encodeURIComponent("Zakaria"));
const data = await res.json();
// data is [{ authors: [...] }]
```

In Next.js you would typically implement this as `GET /api/search` or `GET /search` depending on your routing choice; the **behavior** should match section 5.

---

## 7. Next.js implementation checklist

Use this so another agent can implement the same behavior without reading the Python file.

1. **Create a server-only route handler** (e.g. `app/api/search/route.ts`) that:
   - Runs only on the server (no `SERPAPI_API_KEY` in client bundles).
   - Reads `q` from `request.nextUrl.searchParams.get("q")`.
   - Optionally duplicates Flask fallback: if `q` is missing/blank, try `await request.json()` and read `q` (only if you support GET-with-body like Flask; otherwise document POST or require query string).

2. **Validate `q`** as non-empty after `trim()`. Return **400** with the exact error JSON above if invalid.

3. **Call SerpAPI:**

   ```txt
   GET https://serpapi.com/search?engine=google_scholar&q=<encoded>&api_key=<env>
   ```

   Use a **60s** timeout.

4. **Parse JSON**, read `data.profiles.authors`. For parity with current Python, use direct property access; for robustness, use optional chaining and return 502/404 with a clear message if missing.

5. **Respond** with status **200** and body:

   ```ts
   NextResponse.json([{ authors }]);
   ```

6. **Map HTTP errors** from SerpAPI: if `!response.ok`, either mirror `raise_for_status` (fail the handler) or map to 502 with a safe message.

7. **CORS:** Flask reference does not set CORS headers. If the Next.js app serves the UI from the same origin as the API route, default same-origin fetch works. If the client is on another origin, add CORS headers or proxy through the Next.js app.

---

## 8. Optional: local parity test script

You can compare Flask vs Next.js by searching the same `q` and asserting:

- Status 200 for a known-good query.
- `Array.isArray(body)` && `body.length === 1`.
- `Array.isArray(body[0].authors)`.

---

## 9. Security and operations

- **Rotate** any API key that was committed in source control; use env vars going forward.
- **Rate limits and billing** are governed by SerpAPI; consider caching or debouncing on the client.
- **Do not** expose the SerpAPI key to the browser; keep all SerpAPI calls in server-side Next.js code.

---

## 10. Source reference (current repository)

The behavior above is derived from:

- `webexpo_stalkili/server.py` — Flask app, `GET /search`, SerpAPI integration, response shape.
- `test.py` — Standalone SerpAPI call demonstrating the same `engine`, `q`, and `data["profiles"]["authors"]` access pattern (and commented `scholarly` experiments not used by the live endpoint).

End of specification.
