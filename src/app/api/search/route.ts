import { NextRequest, NextResponse } from 'next/server';

import { normalizeScholarAuthors } from '@/lib/serpapi/normalizeScholarAuthors';
import { fetchScholarSearch, ScholarApiError } from '@/lib/serpapi/scholar';
import type { ScholarAuthorRaw } from '@/lib/serpapi/types';

type ApiErrorBody = {
  error: string;
  code: string;
};

function errorResponse(status: number, error: string, code: string) {
  const body: ApiErrorBody = { error, code };
  return NextResponse.json(body, { status });
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

  try {
    const rawData = await fetchScholarSearch({ q, num: 10, hl: 'en' });
    const rawAuthors: ScholarAuthorRaw[] = Array.isArray(rawData?.profiles?.authors)
      ? (rawData.profiles.authors as ScholarAuthorRaw[])
      : [];
    if (!rawAuthors.length) {
      return errorResponse(404, 'No advisor profiles found for this query.', 'NO_AUTHORS_FOUND');
    }
    const authors = normalizeScholarAuthors(rawAuthors);

    return NextResponse.json({
      query: q,
      authors,
      meta: {
        source: 'serpapi',
        total: authors.length,
        totalResults: rawData.search_information?.total_results ?? null,
        queryDisplayed: rawData.search_information?.query_displayed ?? q,
        advisorFitRoute: '/api/advisor-fit',
      },
    });
  } catch (error) {
    if (error instanceof ScholarApiError) {
      return errorResponse(error.status, error.message, error.code);
    }

    return errorResponse(500, 'Unexpected server error.', 'INTERNAL_ERROR');
  }
}
