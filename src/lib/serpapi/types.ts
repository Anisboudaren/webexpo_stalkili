export type NormalizedAuthor = {
  name: string | null;
  profileUrl: string | null;
  affiliations: string | null;
  email: string | null;
  interests: string[];
  citedBy: number | null;
  thumbnail: string | null;
  imageUrl: string;
  authorId: string | null;
  topCitedBy: number | null;
  serpapiAuthorLink: string | null;
};

export type ScholarAuthorRaw = {
  name?: unknown;
  link?: unknown;
  affiliations?: unknown;
  email?: unknown;
  interests?: unknown;
  cited_by?: unknown;
  thumbnail?: unknown;
  author_id?: unknown;
  serpapi_scholar_link?: unknown;
};

export type ScholarSearchRawResponse = {
  search_parameters?: {
    author_id?: unknown;
  };
  profiles?: {
    authors?: unknown;
  };
  organic_results?: unknown;
  articles?: unknown;
  author?: {
    name?: unknown;
    affiliations?: unknown;
    email?: unknown;
    thumbnail?: unknown;
    interests?: unknown;
  };
  cited_by?: {
    table?: unknown;
    graph?: unknown;
  };
  related_searches?: unknown;
  search_information?: {
    total_results?: unknown;
    query_displayed?: unknown;
  };
};

export type ScholarPaperRaw = {
  title?: unknown;
  link?: unknown;
  snippet?: unknown;
  publication_info?: {
    summary?: unknown;
    authors?: unknown;
  };
  resources?: unknown;
  inline_links?: {
    cited_by?: {
      total?: unknown;
      cites_id?: unknown;
    };
  };
};

export type NormalizedPaper = {
  title: string | null;
  paperUrl: string | null;
  snippet: string | null;
  year: number | null;
  coAuthors: string[];
  journalOrVenue: string | null;
  citedByTotal: number | null;
  citesId: string | null;
  resourceLinks: Array<{
    title: string | null;
    fileFormat: string | null;
    link: string | null;
  }>;
};

export type ResearchField = {
  field: string;
  confidence: number;
  evidence: string[];
};

export type AdvisorFitBreakdown = {
  metric: 'topicAlignment' | 'recentActivity' | 'impactSignal' | 'publicationBreadth';
  score: number;
  weight: number;
  weightedScore: number;
  reason: string;
};

export type AdvisorFitResult = {
  fitScore: number;
  fitLevel: 'low' | 'medium' | 'high';
  scoreBreakdown: AdvisorFitBreakdown[];
  pros: string[];
  risks: string[];
  nextQuestions: string[];
};

export type AdvisorAuthorSummary = {
  name: string | null;
  affiliations: string | null;
  email: string | null;
  thumbnail: string | null;
  imageUrl: string;
  interests: string[];
  totalCitations: number | null;
  hIndexAll: number | null;
  i10IndexAll: number | null;
};
