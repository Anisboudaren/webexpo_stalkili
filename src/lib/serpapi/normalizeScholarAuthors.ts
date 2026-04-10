import type { NormalizedAuthor, ScholarAuthorRaw } from './types';

function toNullableString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
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

  if (value && typeof value === 'object' && 'value' in value) {
    return toNullableNumber((value as { value?: unknown }).value);
  }

  return null;
}

export function normalizeScholarAuthors(authors: ScholarAuthorRaw[]): NormalizedAuthor[] {
  return authors.map((author) => ({
    name: toNullableString(author.name),
    profileUrl: toNullableString(author.link),
    affiliations: toNullableString(author.affiliations),
    citedBy: toNullableNumber(author.cited_by),
    thumbnail: toNullableString(author.thumbnail),
    authorId: toNullableString(author.author_id),
    topCitedBy: toNullableNumber(author.cited_by),
    serpapiAuthorLink: toNullableString(author.serpapi_scholar_link),
  }));
}
