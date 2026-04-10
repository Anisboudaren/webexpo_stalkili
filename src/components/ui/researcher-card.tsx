'use client';

import { motion } from 'framer-motion';
import { BookOpen, MapPin, Star } from 'lucide-react';

export interface Researcher {
  name: string;
  title: string;
  university: string;
  location: string;
  image: string;
  topics: string[];
  matchScore: number;
  publications: number;
}

export const MOCK_RESEARCHERS: Researcher[] = [
  {
    name: 'Dr. Sarah Chen',
    title: 'Associate Professor of Machine Learning',
    university: 'MIT',
    location: 'Cambridge, MA',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&h=600&auto=format&fit=crop',
    topics: ['Deep Learning', 'Computer Vision', 'Neural Architecture'],
    matchScore: 97,
    publications: 84,
  },
  {
    name: 'Prof. James Okafor',
    title: 'Chair of AI Ethics & Policy',
    university: 'Stanford University',
    location: 'Stanford, CA',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=600&h=600&auto=format&fit=crop',
    topics: ['AI Safety', 'Fairness in ML', 'Tech Policy'],
    matchScore: 93,
    publications: 61,
  },
  {
    name: 'Dr. Priya Nair',
    title: 'Research Scientist, NLP Group',
    university: 'University of Cambridge',
    location: 'Cambridge, UK',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=600&h=600&auto=format&fit=crop',
    topics: ['Natural Language Processing', 'LLMs', 'Multilingual AI'],
    matchScore: 89,
    publications: 47,
  },
];

interface ResearcherCardProps {
  researcher: Researcher;
  index: number;
}

function ResearcherCard({ researcher, index }: ResearcherCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="w-64 shrink-0 bg-black rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/40 transition-all duration-300 group cursor-pointer"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-48">
        <img
          src={researcher.image}
          alt={researcher.name}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent pointer-events-none" />
        {/* Match score badge */}
        <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          {researcher.matchScore}% match
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="text-white font-semibold text-sm leading-tight">{researcher.name}</h3>
          <p className="text-gray-400 text-xs mt-0.5 leading-snug">{researcher.title}</p>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1"><Star size={11} className="text-orange-500" />{researcher.university}</span>
          <span className="flex items-center gap-1"><MapPin size={11} />{researcher.location}</span>
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-1.5">
          {researcher.topics.map((topic) => (
            <span key={topic} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
              {topic}
            </span>
          ))}
        </div>

        <div className="border-t border-white/5 pt-3 flex items-center justify-between">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <BookOpen size={11} />
            {researcher.publications} publications
          </span>
          <button className="text-xs text-orange-400 hover:text-orange-300 font-medium transition-colors">
            View profile →
          </button>
        </div>
      </div>
    </motion.div>
  );
}

interface ResearcherResultsProps {
  query: string;
}

export function ResearcherResults({ query }: ResearcherResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex flex-col gap-4"
    >
      <p className="text-gray-300 text-sm leading-relaxed">
        Here is a list of researchers matching{' '}
        <span className="text-orange-400 font-medium">"{query}"</span> — ranked by compatibility:
      </p>
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {MOCK_RESEARCHERS.map((r, i) => (
          <ResearcherCard key={r.name} researcher={r} index={i} />
        ))}
      </div>
    </motion.div>
  );
}
