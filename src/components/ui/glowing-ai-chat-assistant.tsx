'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { SiriOrb } from './siri-orb';

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
        <SiriOrb
          size="48px"
          animationDuration={20}
          className="drop-shadow-2xl"
          colors={{ c1: "oklch(65% 0.18 40)", c2: "oklch(55% 0.05 0)", c3: "oklch(72% 0.14 50)" }}
        />
      </button>
    </div>
  );
};

export { FloatingAiAssistant };
