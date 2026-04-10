import { NextRequest, NextResponse } from 'next/server';

import { inferResearchFields, normalizeScholarPapers } from '@/lib/serpapi/normalizeScholarPapers';
import { scoreAdvisorFit } from '@/lib/serpapi/scoreAdvisorFit';
import { fetchScholarAuthorProfile, ScholarApiError } from '@/lib/serpapi/scholar';

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
