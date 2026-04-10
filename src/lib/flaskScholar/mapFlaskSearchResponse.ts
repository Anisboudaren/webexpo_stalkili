import type { Researcher } from '@/types/researcher';

const PLACEHOLDER_IMG = '/images/professor-placeholder.svg';

export type FlaskScholarlyRow = {
  author_id_used: string | null;
  error: string | null;
  scholarly: Record<string, unknown> | null;
};

export type FlaskSearchPayload = {
  authors: Record<string, unknown>[];
  scholarly_by_author: FlaskScholarlyRow[];
};

function toStr(v: unknown): string {
  return typeof v === 'string' ? v.trim() : '';
}

function toTopicsFromScholarly(interests: unknown): string[] {
  if (!Array.isArray(interests)) return [];
  return interests
    .map((item) => {
      if (typeof item === 'string') return item.trim();
      if (item && typeof item === 'object' && 'title' in item) {
        const t = (item as { title?: unknown }).title;
        return typeof t === 'string' ? t.trim() : '';
      }
      return '';
    })
    .filter(Boolean);
}

function toTopicsFromSerp(interests: unknown): string[] {
  return toTopicsFromScholarly(interests);
}

function toNum(v: unknown): number | null {
  if (typeof v === 'number' && Number.isFinite(v)) return v;
  if (typeof v === 'string') {
    const n = Number(v.replace(/[^\d.-]/g, ''));
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function scoreFromHindex(h: number | null): number {
  if (h == null || h <= 0) return 58;
  return Math.min(96, 42 + Math.round(Math.min(h, 80) * 0.65));
}

/**
 * Maps server.py response shape: `[{ authors, scholarly_by_author }]` → UI researchers.
 */
export function mapFlaskSearchToResearchers(payload: FlaskSearchPayload): Researcher[] {
  const { authors, scholarly_by_author } = payload;
  if (!Array.isArray(authors)) return [];

  return authors.map((serp, index) => {
    const row = scholarly_by_author[index] ?? {
      author_id_used: null,
      error: null,
      scholarly: null,
    };
    const sch = row.scholarly;

    const name =
      toStr(sch?.name) ||
      toStr(serp.name) ||
      'Unknown researcher';

    const affiliation =
      toStr(sch?.affiliation) || toStr(serp.affiliations) || 'Affiliation unknown';

    const image =
      toStr(sch?.url_picture) ||
      toStr(serp.thumbnail) ||
      PLACEHOLDER_IMG;

    const topics = sch
      ? toTopicsFromScholarly(sch.interests)
      : toTopicsFromSerp(serp.interests);
    const topicsFinal = topics.length ? topics : ['Research'];

    const pubs = toNum(sch?.citedby) ?? toNum(serp.cited_by) ?? 0;

    const h = toNum(sch?.hindex);
    const matchScore = sch ? scoreFromHindex(h) : 52;

    const sid = toStr(sch?.scholar_id) || toStr(row.author_id_used) || toStr(serp.author_id);
    const id = sid || `idx-${index}`;

    let summary: string;
    if (row.error && !sch) {
      summary = `Search hit found; Scholar enrichment failed (${row.error}). Showing listing data only.`;
    } else if (topicsFinal.length) {
      summary = `Research interests include ${topicsFinal.slice(0, 4).join(', ')}.`;
    } else {
      summary = 'Google Scholar profile matched for this search result.';
    }

    return {
      id,
      name,
      title: affiliation.slice(0, 120),
      university: affiliation.split(/[,|·]/)[0]?.trim() || affiliation,
      location: '',
      image,
      topics: topicsFinal,
      matchScore,
      publications: pubs,
      summary,
    };
  });
}
