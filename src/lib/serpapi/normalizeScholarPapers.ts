import type {
  NormalizedPaper,
  ResearchField,
  ScholarPaperRaw,
  ScholarSearchRawResponse,
} from './types';

function toNullableString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : null;
}

function toNullableNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.-]/g, '');
    if (!cleaned) {
      return null;
    }
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function extractYear(summary: string | null): number | null {
  if (!summary) {
    return null;
  }
  const match = summary.match(/\b(19|20)\d{2}\b/);
  return match ? Number(match[0]) : null;
}

function extractVenue(summary: string | null): string | null {
  if (!summary) {
    return null;
  }
  const parts = summary.split(' - ').map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) {
    return null;
  }
  return parts[1] ?? null;
}

function extractCoAuthors(publicationInfo: ScholarPaperRaw['publication_info']): string[] {
  if (!publicationInfo?.authors || !Array.isArray(publicationInfo.authors)) {
    return [];
  }
  return publicationInfo.authors
    .map((author) => {
      if (author && typeof author === 'object' && 'name' in author) {
        const name = (author as { name?: unknown }).name;
        return typeof name === 'string' && name.trim() ? name.trim() : null;
      }
      return null;
    })
    .filter((author): author is string => Boolean(author));
}

export function normalizeScholarPapers(data: ScholarSearchRawResponse): NormalizedPaper[] {
  const rawResults = Array.isArray(data.articles) ? data.articles : data.organic_results;
  if (!Array.isArray(rawResults)) {
    return [];
  }

  return rawResults.map((result) => {
    const paper = (result ?? {}) as ScholarPaperRaw;
    const summary = toNullableString(paper.publication_info?.summary);
    const publication = toNullableString((paper as { publication?: unknown }).publication);
    const resources = Array.isArray(paper.resources) ? paper.resources : [];
    const articleAuthors = toNullableString((paper as { authors?: unknown }).authors);
    const yearFromAuthorApi = toNullableNumber((paper as { year?: unknown }).year);
    const citedByValueFromAuthorApi = toNullableNumber(
      (paper as { cited_by?: { value?: unknown } }).cited_by?.value
    );
    const citesIdFromAuthorApi = toNullableString(
      (paper as { cited_by?: { cites_id?: unknown } }).cited_by?.cites_id
    );

    const coAuthorsFromString = articleAuthors
      ? articleAuthors.split(',').map((name) => name.trim()).filter(Boolean)
      : [];
    const coAuthorsFromPublicationInfo = extractCoAuthors(paper.publication_info);

    return {
      title: toNullableString(paper.title),
      paperUrl: toNullableString(paper.link),
      snippet: toNullableString(paper.snippet),
      year: yearFromAuthorApi ?? extractYear(publication ?? summary),
      coAuthors: coAuthorsFromPublicationInfo.length ? coAuthorsFromPublicationInfo : coAuthorsFromString,
      journalOrVenue: extractVenue(publication ?? summary),
      citedByTotal: citedByValueFromAuthorApi ?? toNullableNumber(paper.inline_links?.cited_by?.total),
      citesId: citesIdFromAuthorApi ?? toNullableString(paper.inline_links?.cited_by?.cites_id),
      resourceLinks: resources.map((resource) => {
        const item = (resource ?? {}) as { title?: unknown; file_format?: unknown; link?: unknown };
        return {
          title: toNullableString(item.title),
          fileFormat: toNullableString(item.file_format),
          link: toNullableString(item.link),
        };
      }),
    };
  });
}

const FIELD_KEYWORDS: Record<string, string[]> = {
  'Machine Learning': ['machine learning', 'deep learning', 'neural network', 'ai', 'artificial intelligence'],
  'Data Science': ['data mining', 'data science', 'predictive model', 'analytics', 'big data'],
  'Computer Vision': ['computer vision', 'image', 'object detection', 'segmentation', 'vision transformer'],
  NLP: ['natural language processing', 'language model', 'text mining', 'nlp', 'transformer'],
  Bioinformatics: ['bioinformatics', 'genomics', 'proteomics', 'computational biology'],
  Robotics: ['robotics', 'robot', 'autonomous system', 'control'],
};

export function inferResearchFields(
  papers: NormalizedPaper[],
  relatedSearches: unknown,
  authorInterests?: unknown
): ResearchField[] {
  const evidencePool: string[] = [];

  for (const paper of papers) {
    if (paper.title) {
      evidencePool.push(paper.title.toLowerCase());
    }
    if (paper.snippet) {
      evidencePool.push(paper.snippet.toLowerCase());
    }
  }

  if (Array.isArray(relatedSearches)) {
    for (const item of relatedSearches) {
      if (item && typeof item === 'object' && 'query' in item) {
        const query = (item as { query?: unknown }).query;
        if (typeof query === 'string' && query.trim()) {
          evidencePool.push(query.toLowerCase());
        }
      }
    }
  }
  if (Array.isArray(authorInterests)) {
    for (const item of authorInterests) {
      if (item && typeof item === 'object' && 'title' in item) {
        const title = (item as { title?: unknown }).title;
        if (typeof title === 'string' && title.trim()) {
          evidencePool.push(title.toLowerCase());
        }
      }
    }
  }

  const fieldScores: ResearchField[] = [];

  for (const [field, keywords] of Object.entries(FIELD_KEYWORDS)) {
    const matches = keywords.flatMap((keyword) =>
      evidencePool.filter((text) => text.includes(keyword)).map(() => keyword)
    );
    if (!matches.length) {
      continue;
    }

    const uniqueEvidence = Array.from(new Set(matches)).slice(0, 3);
    const confidence = Math.min(1, matches.length / Math.max(3, evidencePool.length / 2));
    fieldScores.push({
      field,
      confidence: Number(confidence.toFixed(2)),
      evidence: uniqueEvidence,
    });
  }

  return fieldScores.sort((a, b) => b.confidence - a.confidence).slice(0, 6);
}
