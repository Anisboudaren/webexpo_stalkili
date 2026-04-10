'use client';

import { useMemo, useState } from 'react';

type SearchResponse = {
  query: string;
  researchers: Array<{
    id: string;
    name: string;
    title: string;
    university: string;
    location: string;
    image: string;
    topics: string[];
    matchScore: number;
    publications: number;
    summary: string;
  }>;
  meta: {
    source: string;
    total: number;
    flaskBaseUrl?: string;
  };
};

type AdvisorFitResponse = {
  authorId: string;
  studentInterests: string[];
  papers: Array<{
    title: string | null;
    paperUrl: string | null;
    snippet: string | null;
    year: number | null;
    coAuthors: string[];
    journalOrVenue: string | null;
    citedByTotal: number | null;
    citesId: string | null;
    resourceLinks: Array<{ title: string | null; fileFormat: string | null; link: string | null }>;
  }>;
  researchFields: Array<{
    field: string;
    confidence: number;
    evidence: string[];
  }>;
  fit: {
    fitScore: number;
    fitLevel: 'low' | 'medium' | 'high';
    scoreBreakdown: Array<{
      metric: string;
      score: number;
      weight: number;
      weightedScore: number;
      reason: string;
    }>;
    pros: string[];
    risks: string[];
    nextQuestions: string[];
  };
  meta: {
    source: string;
    totalPapers: number;
  };
};

const defaultSearchRequest = {
  q: 'Zakaria',
};

const defaultAdvisorFitRequest = {
  authorId: 'example1',
  studentInterests: ['machine learning', 'data science'],
  targetYearRange: { from: 2020, to: 2026 },
};

const defaultSearchMockResponse: SearchResponse = {
  query: 'Zakaria',
  researchers: [
    {
      id: 'example1',
      name: 'Zakaria Chihab',
      title: 'University of Example',
      university: 'University of Example',
      location: '',
      image: 'https://via.placeholder.com/64',
      topics: ['Machine learning'],
      matchScore: 82,
      publications: 742,
      summary: 'Example mock profile for UI testing.',
    },
    {
      id: 'example2',
      name: 'Amina Zakaria',
      title: 'Institute of Data Science',
      university: 'Institute of Data Science',
      location: '',
      image: '/images/professor-placeholder.svg',
      topics: ['Data science', 'NLP'],
      matchScore: 71,
      publications: 319,
      summary: 'Second mock researcher.',
    },
  ],
  meta: {
    source: 'flask',
    total: 2,
    flaskBaseUrl: 'http://127.0.0.1:5000',
  },
};

const defaultAdvisorFitMockResponse: AdvisorFitResponse = {
  authorId: 'example1',
  studentInterests: ['machine learning', 'data science'],
  papers: [
    {
      title: 'A survey of machine learning for educational analytics',
      paperUrl: 'https://example.org/paper-1',
      snippet: 'Comprehensive review of ML methods for student success prediction.',
      year: 2023,
      coAuthors: ['A. Smith', 'B. Lee'],
      journalOrVenue: 'Computers & Education',
      citedByTotal: 115,
      citesId: '12345',
      resourceLinks: [{ title: 'PDF', fileFormat: 'PDF', link: 'https://example.org/paper-1.pdf' }],
    },
  ],
  researchFields: [
    { field: 'Machine Learning', confidence: 0.88, evidence: ['machine learning', 'prediction'] },
    { field: 'Data Science', confidence: 0.66, evidence: ['analytics'] },
  ],
  fit: {
    fitScore: 81,
    fitLevel: 'high',
    scoreBreakdown: [
      {
        metric: 'topicAlignment',
        score: 90,
        weight: 0.4,
        weightedScore: 36,
        reason: 'Strong overlap with student interests.',
      },
    ],
    pros: ['Strong topic overlap', 'Recent publication activity'],
    risks: ['Limited breadth outside core domain'],
    nextQuestions: ['Ask about supervision style and current funded projects.'],
  },
  meta: {
    source: 'mock',
    totalPapers: 1,
  },
};

function safeParse<T>(text: string): { data?: T; error?: string } {
  try {
    return { data: JSON.parse(text) as T };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Invalid JSON',
    };
  }
}

export default function SearchTestPage() {
  const [mode, setMode] = useState<'search' | 'advisorFit'>('search');
  const [useMock, setUseMock] = useState(true);
  const [requestJson, setRequestJson] = useState(JSON.stringify(defaultSearchRequest, null, 2));
  const [mockResponseJson, setMockResponseJson] = useState(
    JSON.stringify(defaultSearchMockResponse, null, 2)
  );
  const [lastRequest, setLastRequest] = useState<unknown>(defaultSearchRequest);
  const [lastResponse, setLastResponse] = useState<unknown>(defaultSearchMockResponse);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parsedSearchRequest = useMemo(() => safeParse<{ q?: string }>(requestJson), [requestJson]);
  const parsedAdvisorRequest = useMemo(
    () => safeParse<{ authorId?: string; studentInterests?: string[]; targetYearRange?: { from?: number; to?: number } }>(requestJson),
    [requestJson]
  );
  const parsedMockResponse = useMemo(() => safeParse<unknown>(mockResponseJson), [mockResponseJson]);

  const formattedSearchResponse = useMemo(() => {
    const parsed = safeParse<SearchResponse>(JSON.stringify(lastResponse));
    if (!parsed.data || !Array.isArray(parsed.data.researchers)) {
      return null;
    }
    return parsed.data;
  }, [lastResponse]);
  const formattedAdvisorFitResponse = useMemo(() => {
    const parsed = safeParse<AdvisorFitResponse>(JSON.stringify(lastResponse));
    if (!parsed.data || !Array.isArray(parsed.data.papers)) {
      return null;
    }
    return parsed.data;
  }, [lastResponse]);

  function switchMode(nextMode: 'search' | 'advisorFit') {
    setMode(nextMode);
    setError(null);
    if (nextMode === 'search') {
      setRequestJson(JSON.stringify(defaultSearchRequest, null, 2));
      setMockResponseJson(JSON.stringify(defaultSearchMockResponse, null, 2));
      setLastRequest(defaultSearchRequest);
      setLastResponse(defaultSearchMockResponse);
      return;
    }
    setRequestJson(JSON.stringify(defaultAdvisorFitRequest, null, 2));
    setMockResponseJson(JSON.stringify(defaultAdvisorFitMockResponse, null, 2));
    setLastRequest(defaultAdvisorFitRequest);
    setLastResponse(defaultAdvisorFitMockResponse);
  }

  async function runTest() {
    setError(null);

    if (mode === 'search') {
      if (parsedSearchRequest.error || !parsedSearchRequest.data?.q?.trim()) {
        setError('Search request JSON must include a non-empty "q" string.');
        return;
      }
    } else if (parsedAdvisorRequest.error || !parsedAdvisorRequest.data?.authorId?.trim()) {
      setError('Advisor-fit request JSON must include a non-empty "authorId" string.');
      return;
    }

    setLoading(true);
    const payload =
      mode === 'search'
        ? { q: parsedSearchRequest.data?.q?.trim() ?? '' }
        : {
            authorId: parsedAdvisorRequest.data?.authorId?.trim() ?? '',
            studentInterests: parsedAdvisorRequest.data?.studentInterests ?? [],
            targetYearRange: parsedAdvisorRequest.data?.targetYearRange,
          };
    setLastRequest(payload);

    try {
      if (useMock) {
        if (parsedMockResponse.error || !parsedMockResponse.data) {
          throw new Error('Mock response JSON is invalid.');
        }
        setLastResponse(parsedMockResponse.data);
        return;
      }

      const res =
        mode === 'search'
          ? await fetch(`/api/search?q=${encodeURIComponent((payload as { q: string }).q)}`)
          : await fetch('/api/advisor-fit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload),
            });
      const data = (await res.json()) as { error?: unknown };
      setLastResponse(data);

      if (!res.ok) {
        const msg = typeof data.error === 'string' ? data.error : `Request failed with status ${res.status}`;
        throw new Error(msg);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-semibold">Scholar Search Test Page</h1>
        <p className="mt-2 text-sm text-slate-300">
          Edit mock data, send request, and inspect raw plus formatted output in both API modes.
        </p>
        <div className="mt-4 flex gap-2">
          <button
            className={`rounded-md px-3 py-1 text-sm ${mode === 'search' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-200'}`}
            onClick={() => switchMode('search')}
          >
            Candidate Search
          </button>
          <button
            className={`rounded-md px-3 py-1 text-sm ${mode === 'advisorFit' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-200'}`}
            onClick={() => switchMode('advisorFit')}
          >
            Advisor Fit
          </button>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-medium">Request JSON (editable)</h2>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={useMock}
                  onChange={(e) => setUseMock(e.target.checked)}
                />
                Use mock response
              </label>
            </div>
            <textarea
              className="h-44 w-full rounded-md border border-slate-700 bg-slate-950 p-3 font-mono text-sm"
              value={requestJson}
              onChange={(e) => setRequestJson(e.target.value)}
            />
            {(mode === 'search' ? parsedSearchRequest.error : parsedAdvisorRequest.error) ? (
              <p className="mt-2 text-xs text-rose-400">
                Invalid request JSON: {mode === 'search' ? parsedSearchRequest.error : parsedAdvisorRequest.error}
              </p>
            ) : null}
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h2 className="mb-3 font-medium">Mock Response JSON (editable)</h2>
            <textarea
              className="h-44 w-full rounded-md border border-slate-700 bg-slate-950 p-3 font-mono text-sm"
              value={mockResponseJson}
              onChange={(e) => setMockResponseJson(e.target.value)}
              disabled={!useMock}
            />
            {parsedMockResponse.error ? (
              <p className="mt-2 text-xs text-rose-400">
                Invalid mock response JSON: {parsedMockResponse.error}
              </p>
            ) : null}
          </section>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={runTest}
            disabled={loading}
            className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:opacity-60"
          >
            {loading
              ? 'Testing...'
              : useMock
                ? `Run ${mode === 'search' ? 'Search' : 'Advisor-Fit'} Mock Test`
                : `Run ${mode === 'search' ? 'Search' : 'Advisor-Fit'} Live API Test`}
          </button>
          {error ? <span className="text-sm text-rose-400">{error}</span> : null}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h3 className="mb-2 font-medium">Sent Data (Raw JSON)</h3>
            <pre className="overflow-auto rounded-md bg-slate-950 p-3 text-xs">
              {JSON.stringify(lastRequest, null, 2)}
            </pre>
          </section>

          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
            <h3 className="mb-2 font-medium">Received Data (Raw JSON)</h3>
            <pre className="overflow-auto rounded-md bg-slate-950 p-3 text-xs">
              {JSON.stringify(lastResponse, null, 2)}
            </pre>
          </section>
        </div>

        <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h3 className="mb-4 font-medium">Received Data (Formatted)</h3>
          {mode === 'search' && formattedSearchResponse?.researchers?.length ? (
            <div className="grid gap-3 md:grid-cols-2">
              {formattedSearchResponse.researchers.map((r, idx) => (
                <article key={`${r.id}-${idx}`} className="rounded-lg border border-slate-700 bg-slate-950 p-3">
                  <p className="font-medium">{r.name}</p>
                  <p className="mt-1 text-sm text-slate-300">{r.title}</p>
                  <p className="mt-1 text-sm text-slate-300">Match score: {r.matchScore}</p>
                  <p className="mt-1 text-sm text-slate-300">Publications (citations proxy): {r.publications}</p>
                  <p className="mt-1 text-xs text-slate-400 line-clamp-3">{r.summary}</p>
                  <p className="mt-1 text-xs text-slate-500">Topics: {r.topics.join(', ')}</p>
                </article>
              ))}
            </div>
          ) : null}
          {mode === 'advisorFit' && formattedAdvisorFitResponse ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
                <p className="text-sm text-slate-300">Fit Score</p>
                <p className="text-2xl font-semibold">
                  {formattedAdvisorFitResponse.fit.fitScore} ({formattedAdvisorFitResponse.fit.fitLevel})
                </p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
                  <p className="mb-2 font-medium">Research Fields</p>
                  {formattedAdvisorFitResponse.researchFields.map((field) => (
                    <p key={field.field} className="text-sm text-slate-300">
                      {field.field} - {Math.round(field.confidence * 100)}%
                    </p>
                  ))}
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-950 p-3">
                  <p className="mb-2 font-medium">Top Papers</p>
                  {formattedAdvisorFitResponse.papers.slice(0, 5).map((paper, idx) => (
                    <p key={`${paper.title ?? 'paper'}-${idx}`} className="text-sm text-slate-300">
                      {paper.title ?? 'Untitled'} {paper.year ? `(${paper.year})` : ''}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300">
              No formatted data to display yet. Run a test first.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
