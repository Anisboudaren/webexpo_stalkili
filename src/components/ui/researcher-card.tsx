'use client';

import { motion } from 'framer-motion';
import { BookOpen, GraduationCap } from 'lucide-react';

export type ScholarAuthor = {
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

interface ResearcherCardProps {
  researcher: ScholarAuthor;
  index: number;
  onSelectAuthor: (author: ScholarAuthor) => void;
}

function ResearcherCard({ researcher, index, onSelectAuthor }: ResearcherCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="w-56 shrink-0 bg-white/5 rounded-2xl border border-white/8 hover:border-white/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer p-4 flex flex-col gap-3"
      onClick={() => onSelectAuthor(researcher)}
    >
      <div className="flex items-center gap-3">
        <img
          src={researcher.imageUrl}
          alt={researcher.name ?? 'Professor avatar'}
          className="w-11 h-11 rounded-full object-cover object-top shrink-0 border-2 border-white/10"
          onError={(event) => {
            event.currentTarget.src = '/images/professor-placeholder.svg';
          }}
        />
        <div className="min-w-0">
          <h3 className="text-white font-semibold text-xs leading-tight truncate">
            {researcher.name ?? 'Unknown Professor'}
          </h3>
          <p className="text-gray-500 text-[10px] mt-0.5 leading-snug line-clamp-2">
            {researcher.affiliations ?? 'Affiliation unavailable'}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 text-[10px] text-gray-500">
        <span className="flex items-center gap-1">
          <BookOpen size={10} className="shrink-0" />
          {typeof researcher.citedBy === 'number' ? `${researcher.citedBy.toLocaleString()} citations` : 'Citations N/A'}
        </span>
        <span className="flex items-center gap-1">
          <GraduationCap size={10} className="shrink-0" />
          {researcher.authorId ?? 'No author ID'}
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {(researcher.interests.length ? researcher.interests : ['No topics']).slice(0, 2).map((topic) => (
          <span key={topic} className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
            {topic}
          </span>
        ))}
        {researcher.interests.length > 2 && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500">
            +{researcher.interests.length - 2}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-1 border-t border-white/5">
        <span className="text-[10px] font-bold text-orange-400">Profile match</span>
        <button className="text-[10px] text-gray-500 hover:text-orange-400 font-medium transition-colors">
          Analyze fit →
        </button>
      </div>
    </motion.div>
  );
}

interface ResearcherResultsProps {
  query: string;
  authors: ScholarAuthor[];
  isLoading?: boolean;
  error?: string | null;
  onSelectAuthor: (author: ScholarAuthor) => void;
}

export function ResearcherResults({ query, authors, isLoading = false, error = null, onSelectAuthor }: ResearcherResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-3"
    >
      <p className="text-gray-300 text-sm leading-relaxed">
        Here is a list of researchers matching{' '}
        <span className="text-orange-400 font-medium">"{query}"</span> — ranked by compatibility:
      </p>
      {isLoading ? <p className="text-xs text-gray-500">Loading candidate profiles...</p> : null}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
      {!isLoading && !error && authors.length === 0 ? (
        <p className="text-xs text-gray-500">No candidates found for this query.</p>
      ) : null}
      {authors.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {authors.map((r, i) => (
            <ResearcherCard key={`${r.authorId ?? r.name ?? 'author'}-${i}`} researcher={r} index={i} onSelectAuthor={onSelectAuthor} />
          ))}
        </div>
      ) : null}
    </motion.div>
  );
}
