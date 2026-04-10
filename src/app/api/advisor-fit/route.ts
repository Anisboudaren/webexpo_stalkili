import { NextRequest, NextResponse } from 'next/server';

import { inferResearchFields, normalizeScholarPapers } from '@/lib/serpapi/normalizeScholarPapers';
import { scoreAdvisorFit } from '@/lib/serpapi/scoreAdvisorFit';
import { fetchScholarAuthorProfile, ScholarApiError } from '@/lib/serpapi/scholar';
import type { AdvisorAuthorSummary, ScholarSearchRawResponse } from '@/lib/serpapi/types';

type AdvisorFitRequest = {
  authorId?: string;
  studentInterests?: string[];
  targetYearRange?: {
    from?: number;
    to?: number;
  };
};

function errorResponse(status: number, error: string, code: string) {
  return NextResponse.json({ error, code }, { status });
}

function toNullableString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function toNullableNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.-]/g, '');
    if (!cleaned) return null;
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function toInterestTitles(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((item) => {
      if (item && typeof item === 'object' && 'title' in item) {
        const title = (item as { title?: unknown }).title;
        return typeof title === 'string' ? title.trim() : '';
      }
      if (typeof item === 'string') {
        return item.trim();
      }
      return '';
    })
    .filter(Boolean);
}

function extractCitedByMetrics(rawData: ScholarSearchRawResponse) {
  const table = Array.isArray(rawData.cited_by?.table) ? rawData.cited_by?.table : [];
  let totalCitations: number | null = null;
  let hIndexAll: number | null = null;
  let i10IndexAll: number | null = null;

  for (const row of table) {
    if (!row || typeof row !== 'object') {
      continue;
    }
    const asRecord = row as Record<string, unknown>;
    if ('citations' in asRecord) {
      totalCitations = toNullableNumber((asRecord.citations as { all?: unknown })?.all);
    }
    if ('indice_h' in asRecord) {
      hIndexAll = toNullableNumber((asRecord.indice_h as { all?: unknown })?.all);
    }
    if ('indice_i10' in asRecord) {
      i10IndexAll = toNullableNumber((asRecord.indice_i10 as { all?: unknown })?.all);
    }
  }

  return { totalCitations, hIndexAll, i10IndexAll };
}

function buildAuthorSummary(rawData: ScholarSearchRawResponse): AdvisorAuthorSummary {
  const authorId = toNullableString((rawData as { search_parameters?: { author_id?: unknown } }).search_parameters?.author_id);
  const thumbnail = toNullableString(rawData.author?.thumbnail);
  const fallbackImage = authorId
    ? `https://scholar.googleusercontent.com/citations?view_op=view_photo&user=${encodeURIComponent(authorId)}&citpid=1`
    : '/images/professor-placeholder.svg';
  const imageUrl = thumbnail ?? fallbackImage;
  const metrics = extractCitedByMetrics(rawData);

  return {
    name: toNullableString(rawData.author?.name),
    affiliations: toNullableString(rawData.author?.affiliations),
    email: toNullableString(rawData.author?.email),
    thumbnail,
    imageUrl,
    interests: toInterestTitles(rawData.author?.interests),
    totalCitations: metrics.totalCitations,
    hIndexAll: metrics.hIndexAll,
    i10IndexAll: metrics.i10IndexAll,
  };
}

export async function POST(request: NextRequest) {
  let body: AdvisorFitRequest;
  try {
    body = (await request.json()) as AdvisorFitRequest;
  } catch {
    return errorResponse(400, 'Invalid JSON body.', 'INVALID_BODY');
  }

  const authorId = body.authorId?.trim();
  if (!authorId) {
    return errorResponse(400, 'Parameter "authorId" is required.', 'MISSING_AUTHOR_ID');
  }

  const studentInterests = Array.isArray(body.studentInterests)
    ? body.studentInterests.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
    : [];

  try {
    const rawData = await fetchScholarAuthorProfile({ authorId, num: 100, hl: 'en' });
    const papers = normalizeScholarPapers(rawData);
    const filteredPapers = papers.filter((paper) => {
      if (!paper.year || !body.targetYearRange) {
        return true;
      }
      const from = body.targetYearRange.from ?? Number.MIN_SAFE_INTEGER;
      const to = body.targetYearRange.to ?? Number.MAX_SAFE_INTEGER;
      return paper.year >= from && paper.year <= to;
    });

    if (!filteredPapers.length) {
      return errorResponse(404, 'No paper evidence found for this advisor profile.', 'NO_PAPERS_FOUND');
    }

    const researchFields = inferResearchFields(
      filteredPapers,
      rawData.related_searches,
      rawData.author?.interests
    );
    const fit = scoreAdvisorFit({
      papers: filteredPapers,
      researchFields,
      studentInterests,
    });

    return NextResponse.json({
      authorId,
      studentInterests,
      authorSummary: buildAuthorSummary(rawData),
      papers: filteredPapers,
      researchFields,
      fit,
      meta: {
        source: 'serpapi',
        totalPapers: filteredPapers.length,
      },
    });
  } catch (error) {
    if (error instanceof ScholarApiError) {
      return errorResponse(error.status, error.message, error.code);
    }
    return errorResponse(500, 'Unexpected server error.', 'INTERNAL_ERROR');
  }
}
