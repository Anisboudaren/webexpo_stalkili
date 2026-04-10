'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ArrowLeft } from 'lucide-react';
import TeacherCard, { type Teacher } from '@/components/TeacherCard';

function ResultsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams?.get('q') ?? '';

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState(query);

  // Fire API call on mount (and whenever the query param changes)
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error('Failed to fetch results');
        const data = await res.json();
        setTeachers(data.results);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    router.push(`/results?q=${encodeURIComponent(searchInput.trim())}`);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          'radial-gradient(125% 125% at 50% 0%, rgba(0,0,0,1) 40%, rgba(30,10,0,0.95) 70%, rgba(120,40,0,0.3) 90%, rgba(245,87,2,0.15) 100%)',
      }}
    >
      {/* Header with search */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/60 border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="shrink-0 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <form onSubmit={handleSearch} className="flex-1 flex gap-3">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search teachers, subjects, universities..."
                className="w-full pl-11 pr-4 py-3 rounded-full bg-white/5 border border-white/10 focus:border-white/30 outline-none text-white text-sm placeholder:text-gray-500 transition-colors"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-white hover:bg-gray-100 text-black text-sm font-medium transition-colors shrink-0"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results body */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Results count */}
        {!loading && !error && (
          <p className="text-sm text-gray-500 mb-6">
            {teachers.length} result{teachers.length !== 1 ? 's' : ''}
            {query && (
              <>
                {' '}
                for{' '}
                <span className="text-gray-300 font-medium">&ldquo;{query}&rdquo;</span>
              </>
            )}
          </p>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-white/5" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-4 w-32 bg-white/10 rounded" />
                  <div className="h-3 w-24 bg-white/5 rounded" />
                  <div className="h-3 w-full bg-white/5 rounded" />
                  <div className="h-3 w-3/4 bg-white/5 rounded" />
                  <div className="flex gap-2 pt-1">
                    <div className="h-6 w-14 bg-white/5 rounded-full" />
                    <div className="h-6 w-16 bg-white/5 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-red-400 text-lg font-medium mb-2">Something went wrong</div>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-full bg-white/10 text-white text-sm hover:bg-white/15 transition-colors"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && teachers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-gray-300 text-lg font-medium mb-2">No teachers found</div>
            <p className="text-gray-500 text-sm mb-6">
              Try a different search term like &ldquo;machine learning&rdquo; or &ldquo;neuroscience&rdquo;
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-5 py-2.5 rounded-full bg-white/10 text-white text-sm hover:bg-white/15 transition-colors"
            >
              Back to home
            </button>
          </div>
        )}

        {/* Teacher cards grid */}
        {!loading && !error && teachers.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense>
      <ResultsContent />
    </Suspense>
  );
}
