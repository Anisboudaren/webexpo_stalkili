'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, X, Check, Database } from 'lucide-react';
import { PromptInputBox } from '@/components/ui/ai-prompt-box';
import { SelectorChips } from '@/components/ui/selector-chips';
import { ResearcherResults, type ScholarAuthor } from '@/components/ui/researcher-card';

type AdvisorFitResponse = {
  authorId: string;
  studentInterests: string[];
  papers: Array<{
    title: string | null;
    year: number | null;
    citedByTotal: number | null;
  }>;
  researchFields: Array<{
    field: string;
    confidence: number;
  }>;
  fit: {
    fitScore: number;
    fitLevel: 'low' | 'medium' | 'high';
    scoreBreakdown: Array<{
      metric: string;
      score: number;
      reason: string;
    }>;
    pros: string[];
    risks: string[];
    nextQuestions: string[];
  };
  authorSummary?: {
    name: string | null;
    affiliations: string | null;
    email: string | null;
    imageUrl: string;
    interests: string[];
    totalCitations: number | null;
    hIndexAll: number | null;
    i10IndexAll: number | null;
  };
};

type Message = {
  id: string;
  role: 'user' | 'ai';
  text: string;
  query?: string;
  type?: 'text' | 'search-results' | 'fit-details';
  authors?: ScholarAuthor[];
  error?: string | null;
  fitData?: AdvisorFitResponse;
};

const BROAD_FIELDS = ['Technology', 'Medicine & Health', 'Engineering', 'Natural Sciences', 'Social Sciences', 'Business', 'Arts & Humanities', 'Law & Policy'];
const SPECIFIC_FIELDS: Record<string, string[]> = {
  'Technology': ['AI / Machine Learning', 'Software Engineering', 'Quantum Computing', 'Cybersecurity', 'Data Science', 'Robotics', 'Blockchain', 'Computer Vision'],
  'Medicine & Health': ['Med Tech', 'Neuroscience', 'Genomics', 'Public Health', 'Oncology', 'Biomedical Engineering', 'Psychiatry'],
  'Engineering': ['Aerospace', 'Mechanical', 'Electrical', 'Civil', 'Chemical', 'Nuclear', 'Materials Science'],
  'Natural Sciences': ['Physics', 'Climate Science', 'Astrophysics', 'Biology', 'Chemistry', 'Ecology', 'Mathematics'],
  'Social Sciences': ['Psychology', 'Economics', 'Sociology', 'Political Science', 'Anthropology', 'Education'],
  'Business': ['Finance', 'Entrepreneurship', 'Marketing', 'Supply Chain', 'Organisational Behaviour'],
  'Arts & Humanities': ['Philosophy', 'Linguistics', 'History', 'Literature', 'Architecture', 'Film Studies'],
  'Law & Policy': ['International Law', 'Tech Policy', 'Environmental Law', 'Human Rights', 'IP Law'],
};

const SOURCES = [
  { id: 'linkedin', label: 'LinkedIn', icon: '🔗' },
  { id: 'scholar', label: 'Google Scholar', icon: '🎓' },
  { id: 'researchgate', label: 'ResearchGate', icon: '📄' },
  { id: 'all', label: 'All Web', icon: '🌐' },
];

// Field picker popover component
function FieldPicker({
  broadSelected, setBroadSelected,
  specificSelected, setSpecificSelected,
  onClose,
}: {
  broadSelected: string[]; setBroadSelected: (v: string[]) => void;
  specificSelected: string[]; setSpecificSelected: (v: string[]) => void;
  onClose: () => void;
}) {
  const available = broadSelected.flatMap((f) => SPECIFIC_FIELDS[f] ?? []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className="absolute bottom-full mb-3 left-0 right-0 z-50 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-2xl shadow-2xl p-5 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white font-semibold text-sm">Filter by Field</p>
          <p className="text-gray-500 text-xs mt-0.5">Select broad then narrow down</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
          <X size={16} />
        </button>
      </div>

      {/* Broad fields */}
      <div>
        <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">Broad Field</p>
        <div className="flex flex-wrap gap-2">
          {BROAD_FIELDS.map((f) => {
            const sel = broadSelected.includes(f);
            return (
              <button
                key={f}
                type="button"
                onClick={() => {
                  const next = sel ? broadSelected.filter((x) => x !== f) : [...broadSelected, f];
                  setBroadSelected(next);
                  setSpecificSelected([]);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                  sel
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {sel && <Check size={11} />}
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Specific fields */}
      <AnimatePresence>
        {available.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 pt-4">
              <p className="text-xs text-gray-600 uppercase tracking-widest mb-3">Specialisation</p>
              <SelectorChips options={available} selected={specificSelected} onChange={setSpecificSelected} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active summary */}
      {(broadSelected.length > 0 || specificSelected.length > 0) && (
        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <p className="text-xs text-gray-500">
            {[...broadSelected, ...specificSelected].length} field{[...broadSelected, ...specificSelected].length !== 1 ? 's' : ''} selected
          </p>
          <button
            type="button"
            onClick={() => { setBroadSelected([]); setSpecificSelected([]); }}
            className="text-xs text-orange-400 hover:text-orange-300 transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </motion.div>
  );
}

function ChatContent() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [broadSelected, setBroadSelected] = useState<string[]>([]);
  const [specificSelected, setSpecificSelected] = useState<string[]>([]);
  const [showFieldPicker, setShowFieldPicker] = useState(false);
  const [showSourcePicker, setShowSourcePicker] = useState(false);
  const [activeSources, setActiveSources] = useState<string[]>(['all']);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialSent = useRef(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const inferStudentInterests = (query: string) => {
    const selected = [...broadSelected, ...specificSelected]
      .map((item) => item.toLowerCase().trim())
      .filter(Boolean);
    if (selected.length > 0) {
      return selected;
    }
    return query
      .split(/[,\s/|]+/)
      .map((token) => token.trim().toLowerCase())
      .filter((token) => token.length > 2)
      .slice(0, 6);
  };

  useEffect(() => {
    const q = searchParams?.get('q');
    if (q && !initialSent.current) {
      initialSent.current = true;
      void handleSend(q);
    }
  }, [searchParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowFieldPicker(false);
        setShowSourcePicker(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggleSource = (id: string) => {
    if (id === 'all') {
      setActiveSources(['all']);
      return;
    }
    setActiveSources((prev) => {
      const without = prev.filter((s) => s !== 'all');
      const next = without.includes(id) ? without.filter((s) => s !== id) : [...without, id];
      return next.length === 0 ? ['all'] : next;
    });
  };

  const handleSend = async (message: string) => {
    if (!message.trim()) return;
    setShowFieldPicker(false);
    const tags = [...broadSelected, ...specificSelected];
    const sources = activeSources.includes('all') ? [] : activeSources.map((s) => SOURCES.find((x) => x.id === s)?.label ?? s);
    const parts = [message.trim(), ...(tags.length ? [`Fields: ${tags.join(', ')}`] : []), ...(sources.length ? [`Sources: ${sources.join(', ')}`] : [])];
    const full = parts.join(' | ');
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: full,
      type: 'text',
    };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(message.trim())}`);
      const data = (await res.json()) as {
        authors?: ScholarAuthor[];
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data?.error ?? `Search failed with status ${res.status}`);
      }
      const aiResultMessage: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        text: '',
        query: message.trim(),
        type: 'search-results',
        authors: Array.isArray(data.authors) ? data.authors : [],
      };
      setMessages((prev) => [...prev, aiResultMessage]);
    } catch (error) {
      const aiErrorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'ai',
        text: error instanceof Error ? error.message : 'Search failed.',
        type: 'text',
        error: error instanceof Error ? error.message : 'Search failed.',
      };
      setMessages((prev) => [...prev, aiErrorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAuthor = async (author: ScholarAuthor, query: string) => {
    if (!author.authorId) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'ai',
          text: `Cannot analyze "${author.name ?? 'this professor'}" because author ID is missing.`,
          type: 'text',
        },
      ]);
      return;
    }

    setLoading(true);
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: 'ai',
        text: `Analyzing fit for ${author.name ?? 'selected professor'}...`,
        type: 'text',
      },
    ]);

    try {
      const payload = {
        authorId: author.authorId,
        studentInterests: inferStudentInterests(query),
        targetYearRange: { from: 2020, to: new Date().getFullYear() },
      };
      const res = await fetch('/api/advisor-fit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as AdvisorFitResponse & { error?: string };
      if (!res.ok) {
        throw new Error(data?.error ?? `Advisor fit failed with status ${res.status}`);
      }
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'ai',
          text: '',
          type: 'fit-details',
          fitData: data,
          query,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'ai',
          text: error instanceof Error ? error.message : 'Failed to analyze advisor fit.',
          type: 'text',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const isEmpty = messages.length === 0;
  const allTags = [...broadSelected, ...specificSelected];

  return (
    <div className="fixed inset-0 flex flex-col bg-black">
      {/* Mobile gradient — wider spread, sits lower */}
      <div
        className="absolute inset-0 sm:hidden"
        style={{ background: 'radial-gradient(170% 120% at 50% 115%, rgba(245,87,2,1) 0%, rgba(245,87,2,0.8) 8%, rgba(120,40,0,0.6) 18%, rgba(30,10,0,0.9) 32%, rgba(0,0,0,1) 55%)' }}
      />
      {/* Desktop gradient */}
      <div
        className="absolute inset-0 hidden sm:block"
        style={{ background: 'radial-gradient(125% 125% at 50% 101%, rgba(245,87,2,1) 0%, rgba(245,87,2,0.8) 8%, rgba(120,40,0,0.6) 18%, rgba(30,10,0,0.9) 32%, rgba(0,0,0,1) 55%)' }}
      />
      {/* Messages */}
      <div className="relative z-10 flex-1 overflow-y-auto pt-28 pb-4">
        <div className="max-w-3xl w-full mx-auto px-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center gap-4 min-h-[60vh]">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-3">What do you want to know?</h1>
                <p className="text-gray-500 text-base max-w-md">Search a supervisor, research a recruiter, or prep for a cold call.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 py-6">
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {m.role === 'user' ? (
                    <div className="max-w-[80%] rounded-2xl rounded-br-sm px-4 py-3 text-sm leading-relaxed bg-white text-black">
                      {m.text}
                    </div>
                  ) : (
                    <div className="w-full max-w-full">
                      {m.type === 'search-results' ? (
                        <ResearcherResults
                          query={m.query ?? ''}
                          authors={m.authors ?? []}
                          error={m.error ?? null}
                          onSelectAuthor={(author) => void handleSelectAuthor(author, m.query ?? '')}
                        />
                      ) : m.type === 'fit-details' && m.fitData ? (
                        <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-gray-200">
                          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3">
                            <div>
                              <p className="text-xs text-gray-400">Selected advisor</p>
                              <p className="text-base font-semibold text-white">
                                {m.fitData.authorSummary?.name ?? m.fitData.authorId}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {m.fitData.authorSummary?.affiliations ?? 'Affiliation unavailable'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-400">Fit score</p>
                              <p className="text-2xl font-bold text-orange-400">{m.fitData.fit.fitScore}</p>
                              <p className="text-xs uppercase tracking-wide text-gray-400">{m.fitData.fit.fitLevel}</p>
                            </div>
                          </div>
                          <div className="mt-3 grid gap-3 md:grid-cols-2">
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Research fields</p>
                              <div className="flex flex-wrap gap-1">
                                {m.fitData.researchFields.slice(0, 6).map((field) => (
                                  <span key={field.field} className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/5">
                                    {field.field} ({Math.round(field.confidence * 100)}%)
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Top papers</p>
                              <div className="space-y-1">
                                {m.fitData.papers.slice(0, 3).map((paper, index) => (
                                  <p key={`${paper.title ?? 'paper'}-${index}`} className="text-xs text-gray-300">
                                    {paper.title ?? 'Untitled paper'} {paper.year ? `(${paper.year})` : ''}
                                  </p>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 grid gap-3 md:grid-cols-2">
                            <div>
                              <p className="text-xs text-emerald-300 mb-1">Pros</p>
                              <ul className="space-y-1 text-xs text-gray-300">
                                {m.fitData.fit.pros.slice(0, 3).map((item) => (
                                  <li key={item}>- {item}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-xs text-red-300 mb-1">Risks</p>
                              <ul className="space-y-1 text-xs text-gray-300">
                                {m.fitData.fit.risks.slice(0, 3).map((item) => (
                                  <li key={item}>- {item}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="max-w-[80%] rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed bg-white/5 border border-white/10 text-gray-200">
                          {m.text}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                    {[0, 1, 2].map((i) => <div key={i} className="h-1.5 w-1.5 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input area — pinned to bottom */}
      <div className="relative z-10 shrink-0 max-w-3xl w-full mx-auto px-4 pb-5">

        {/* Field picker popover anchor */}
        <div ref={pickerRef} className="relative">
          <AnimatePresence>
            {showFieldPicker && (
              <FieldPicker
                broadSelected={broadSelected} setBroadSelected={setBroadSelected}
                specificSelected={specificSelected} setSpecificSelected={setSpecificSelected}
                onClose={() => setShowFieldPicker(false)}
              />
            )}
          </AnimatePresence>

          {/* Active field tags row */}
          <AnimatePresence>
            {allTags.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} className="flex flex-wrap gap-1.5 mb-2">
                {allTags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 bg-orange-500/15 border border-orange-500/30 text-orange-300 text-xs px-2.5 py-1 rounded-full">
                    {tag}
                    <button type="button" onClick={() => {
                      setBroadSelected((p) => p.filter((t) => t !== tag));
                      setSpecificSelected((p) => p.filter((t) => t !== tag));
                    }} className="hover:text-white"><X size={10} /></button>
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Prompt box with field + source buttons */}
          <div className="relative">
            <PromptInputBox
              onSend={handleSend}
              isLoading={loading}
              placeholder={allTags.length > 0 ? `In: ${allTags.join(', ')}…` : 'Search a supervisor, recruiter, or topic…'}
            />
            {/* Bottom-left button row — Fields + Sources */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => { setShowFieldPicker((p) => !p); setShowSourcePicker(false); }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                  showFieldPicker || allTags.length > 0
                    ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                    : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'
                }`}
              >
                <Layers size={12} />
                Fields
                {allTags.length > 0 && <span className="bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{allTags.length}</span>}
              </button>

              <button
                type="button"
                onClick={() => { setShowSourcePicker((p) => !p); setShowFieldPicker(false); }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 ${
                  showSourcePicker || !activeSources.includes('all')
                    ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                    : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'
                }`}
              >
                <Database size={12} />
                Sources
                {!activeSources.includes('all') && <span className="bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">{activeSources.length}</span>}
              </button>
            </div>
          </div>

          {/* Source picker popup */}
          <AnimatePresence>
            {showSourcePicker && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="absolute bottom-full mb-3 left-0 right-0 z-50 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-2xl shadow-2xl p-5 flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">Sources</p>
                    <p className="text-gray-500 text-xs mt-0.5">Where to search</p>
                  </div>
                  <button onClick={() => setShowSourcePicker(false)} className="text-gray-500 hover:text-white transition-colors p-1">
                    <X size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {SOURCES.map((src) => {
                    const active = activeSources.includes(src.id);
                    return (
                      <button
                        key={src.id}
                        type="button"
                        onClick={() => toggleSource(src.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
                          active
                            ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {active && <Check size={11} />}
                        {src.label}
                      </button>
                    );
                  })}
                </div>
                {!activeSources.includes('all') && (
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <p className="text-xs text-gray-500">{activeSources.length} source{activeSources.length !== 1 ? 's' : ''} selected</p>
                    <button type="button" onClick={() => setActiveSources(['all'])} className="text-xs text-orange-400 hover:text-orange-300 transition-colors">Clear</button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-center text-xs text-gray-800 mt-3">
          Scopeout uses AI to surface public information. Always verify before acting.
        </p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <React.Suspense>
      <ChatContent />
    </React.Suspense>
  );
}
