'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';

const FloatingAiAssistant = () => {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/chat') return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="relative cursor-pointer transition-transform duration-300 hover:scale-110"
        onClick={() => router.push('/chat')}
        aria-label="Open AI assistant"
      >
        <div className="w-12 h-12 rounded-full bg-linear-to-br from-orange-500 via-orange-600 to-gray-900 shadow-[0_0_24px_rgba(245,87,2,0.5)] animate-pulse flex items-center justify-center">
          <div className="w-5 h-5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30" />
        </div>
      </button>
    </div>
  );
};

export { FloatingAiAssistant };
