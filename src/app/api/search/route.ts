import { NextRequest, NextResponse } from 'next/server';

import {
  mapFlaskSearchToResearchers,
  type FlaskSearchPayload,
} from '@/lib/flaskScholar/mapFlaskSearchResponse';
import type { Researcher } from '@/types/researcher';

const DEFAULT_FLASK_BASE = 'http://127.0.0.1:5000';
const UPSTREAM_TIMEOUT_MS = 120_000;

type ApiErrorBody = {
  error: string;
  code: string;
};

function errorResponse(status: number, error: string, code: string) {
  return NextResponse.json({ error, code } satisfies ApiErrorBody, { status });
}

function flaskBaseUrl(): string {
  const raw = process.env.FLASK_SCHOLAR_BASE_URL?.trim() || DEFAULT_FLASK_BASE;
  return raw.replace(/\/$/, '');
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (!q) {
    return errorResponse(
      400,
      'Parameter "q" is required (query string).',
      'MISSING_QUERY'
    );
  }

  const base = flaskBaseUrl();
  const url = `${base}/search?q=${encodeURIComponent(q)}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      cache: 'no-store',
      headers: { Accept: 'application/json' },
    });
  } catch (e) {
    const msg =
      e instanceof Error && e.name === 'TimeoutError'
        ? 'Flask server request timed out.'
        : `Could not reach Flask server at ${base}. Is server.py running?`;
    return errorResponse(502, msg, 'FLASK_UNREACHABLE');
  }

  let body: unknown;
  try {
    body = await response.json();
  } catch {
    return errorResponse(
      502,
      'Flask server returned non-JSON. Check that server.py is running on the configured URL.',
      'FLASK_INVALID_JSON'
    );
  }

  if (!response.ok) {
    const errMsg =
      typeof body === 'object' && body !== null && 'error' in body
        ? String((body as { error?: unknown }).error ?? response.statusText)
        : response.statusText || 'Flask error';
    return errorResponse(response.status, errMsg, 'FLASK_ERROR');
  }

  if (!Array.isArray(body) || body.length === 0) {
    return errorResponse(502, 'Unexpected Flask response shape (expected a non-empty JSON array).', 'FLASK_MALFORMED');
  }

  const first = body[0] as Record<string, unknown>;
  const authors = first.authors;
  const scholarlyByAuthor = first.scholarly_by_author;

  if (!Array.isArray(authors)) {
    return errorResponse(502, 'Flask response missing authors array.', 'FLASK_MALFORMED');
  }
  if (!Array.isArray(scholarlyByAuthor)) {
    return errorResponse(502, 'Flask response missing scholarly_by_author array.', 'FLASK_MALFORMED');
  }

  const payload: FlaskSearchPayload = {
    authors: authors as Record<string, unknown>[],
    scholarly_by_author: scholarlyByAuthor as FlaskSearchPayload['scholarly_by_author'],
  };

  const researchers: Researcher[] = mapFlaskSearchToResearchers(payload);

  if (!researchers.length) {
    return errorResponse(404, 'No advisor profiles found for this query.', 'NO_AUTHORS_FOUND');
  }

  return NextResponse.json({
    query: q,
    researchers,
    meta: {
      source: 'flask',
      flaskBaseUrl: base,
      total: researchers.length,
    },
  });
}
