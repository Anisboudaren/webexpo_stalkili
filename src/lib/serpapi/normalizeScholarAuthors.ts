import type { NormalizedAuthor, ScholarAuthorRaw } from './types';

const FALLBACK_AVATAR = '/images/professor-placeholder.svg';

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

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === 'string') {
        return item.trim();
      }
      if (item && typeof item === 'object' && 'title' in item) {
        const title = (item as { title?: unknown }).title;
        return typeof title === 'string' ? title.trim() : '';
      }
      return '';
    })
    .filter(Boolean);
}

function buildScholarPhotoUrl(authorId: string | null): string | null {
  if (!authorId) {
    return null;
  }
  return `https://scholar.googleusercontent.com/citations?view_op=view_photo&user=${encodeURIComponent(authorId)}&citpid=1`;
}

export function normalizeScholarAuthors(authors: ScholarAuthorRaw[]): NormalizedAuthor[] {
  return authors.map((author) => {
    const authorId = toNullableString(author.author_id);
    const thumbnail = toNullableString(author.thumbnail);
    const fallbackFromAuthorId = buildScholarPhotoUrl(authorId);
    const imageUrl = thumbnail ?? fallbackFromAuthorId ?? FALLBACK_AVATAR;

    return {
      name: toNullableString(author.name),
      profileUrl: toNullableString(author.link),
      affiliations: toNullableString(author.affiliations),
      email: toNullableString(author.email),
      interests: toStringArray(author.interests),
      citedBy: toNullableNumber(author.cited_by),
      thumbnail,
      imageUrl,
      authorId,
      topCitedBy: toNullableNumber(author.cited_by),
      serpapiAuthorLink: toNullableString(author.serpapi_scholar_link),
    };
  });
}
