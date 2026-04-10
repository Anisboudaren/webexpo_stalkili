import type { ScholarAuthorRaw, ScholarSearchRawResponse } from './types';

const SERPAPI_BASE_URL = 'https://serpapi.com/search';
const SERPAPI_ENGINE_SEARCH = 'google_scholar';
const SERPAPI_ENGINE_AUTHOR = 'google_scholar_author';
const SERPAPI_TIMEOUT_MS = 60_000;

export class ScholarApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string
  ) {
    super(message);
    this.name = 'ScholarApiError';
  }
}

type ScholarSearchParams = {
  q?: string;
  num?: number;
  hl?: string;
};

type ScholarAuthorParams = {
  authorId: string;
  num?: number;
  hl?: string;
};

function buildSearchUrl(params: ScholarSearchParams, apiKey: string): string {
  const url = new URL(SERPAPI_BASE_URL);
  url.searchParams.set('engine', SERPAPI_ENGINE_SEARCH);
  if (params.q) {
    url.searchParams.set('q', params.q);
  }
  if (params.num) {
    url.searchParams.set('num', String(params.num));
  }
  if (params.hl) {
    url.searchParams.set('hl', params.hl);
  }
  url.searchParams.set('api_key', apiKey);
  return url.toString();
}

function buildAuthorUrl(params: ScholarAuthorParams, apiKey: string): string {
  const url = new URL(SERPAPI_BASE_URL);
  url.searchParams.set('engine', SERPAPI_ENGINE_AUTHOR);
  url.searchParams.set('author_id', params.authorId);
  if (params.num) {
    url.searchParams.set('num', String(params.num));
  }
  if (params.hl) {
    url.searchParams.set('hl', params.hl);
  }
  url.searchParams.set('api_key', apiKey);
  return url.toString();
}

async function fetchScholarRaw(url: string): Promise<ScholarSearchRawResponse> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(SERPAPI_TIMEOUT_MS),
      cache: 'no-store',
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'TimeoutError') {
      throw new ScholarApiError('SerpAPI request timed out.', 504, 'UPSTREAM_TIMEOUT');
    }
    throw new ScholarApiError('Failed to reach SerpAPI.', 502, 'UPSTREAM_REQUEST_FAILED');
  }

  if (!response.ok) {
    throw new ScholarApiError(
      `SerpAPI returned ${response.status}.`,
      502,
      'UPSTREAM_BAD_STATUS'
    );
  }

  let data: ScholarSearchRawResponse;
  try {
    data = (await response.json()) as ScholarSearchRawResponse;
  } catch {
    throw new ScholarApiError('SerpAPI returned invalid JSON.', 502, 'UPSTREAM_INVALID_JSON');
  }

  return data;
}

export async function fetchScholarSearch(params: ScholarSearchParams): Promise<ScholarSearchRawResponse> {
  if (!params.q) {
    throw new ScholarApiError('Parameter "q" is required for scholar search.', 400, 'MISSING_QUERY');
  }
  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) {
    throw new ScholarApiError('Server is missing SERPAPI_API_KEY.', 500, 'MISSING_API_KEY');
  }
  return fetchScholarRaw(buildSearchUrl(params, apiKey));
}

export async function fetchScholarAuthorProfile(
  params: ScholarAuthorParams
): Promise<ScholarSearchRawResponse> {
  const authorId = params.authorId?.trim();
  if (!authorId) {
    throw new ScholarApiError('Parameter "authorId" is required.', 400, 'MISSING_AUTHOR_ID');
  }
  const apiKey = process.env.SERPAPI_API_KEY;
  if (!apiKey) {
    throw new ScholarApiError('Server is missing SERPAPI_API_KEY.', 500, 'MISSING_API_KEY');
  }
  return fetchScholarRaw(buildAuthorUrl({ ...params, authorId }, apiKey));
}

export async function fetchScholarAuthors(query: string): Promise<ScholarAuthorRaw[]> {
  const data = await fetchScholarSearch({ q: query });

  const authors = data?.profiles?.authors;
  if (!Array.isArray(authors)) {
    throw new ScholarApiError(
      'SerpAPI response missing profiles.authors.',
      502,
      'UPSTREAM_MALFORMED_PAYLOAD'
    );
  }

  return authors as ScholarAuthorRaw[];
}
