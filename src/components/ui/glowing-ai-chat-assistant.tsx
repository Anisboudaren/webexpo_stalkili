'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { SiriOrb } from './siri-orb';
import ChatGPTInput from './prompt-input-dynamic-grow';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const FloatingAiAssistant = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        if (!(event.target as Element).closest('.floating-ai-button')) {
          setIsChatOpen(false);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* SiriOrb button */}
      <button
        className="floating-ai-button relative cursor-pointer transition-transform duration-300 hover:scale-110"
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        <SiriOrb size="48px" animationDuration={isChatOpen ? 6 : 20} className="drop-shadow-2xl" />
        {isChatOpen && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full">
            <X className="w-4 h-4 text-white drop-shadow" />
          </div>
        )}
      </button>

      {/* Chat Interface */}
      {isChatOpen && (
        <div
          ref={chatRef}
          className="absolute bottom-16 right-0 w-105 transition-all duration-300 origin-bottom-right"
          style={{ animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
        >
          <div className="relative flex flex-col rounded-3xl bg-linear-to-br from-zinc-800/80 to-zinc-900/90 border border-zinc-500/50 shadow-2xl backdrop-blur-3xl overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-4 pb-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-zinc-400">AI Assistant</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-medium bg-zinc-800/60 text-zinc-300 rounded-2xl">Llama 3.3</span>
                <span className="px-2 py-1 text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-2xl">Free</span>
                <button onClick={() => setIsChatOpen(false)} className="p-1.5 rounded-full hover:bg-zinc-700/50 transition-colors">
                  <X className="w-4 h-4 text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex flex-col gap-3 px-4 py-3 h-56 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              {messages.length === 0 && (
                <p className="text-zinc-500 text-sm text-center mt-10">Ask me anything...</p>
              )}
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-zinc-700/60 text-zinc-100 rounded-bl-sm'
                  }`}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-700/60 text-zinc-400 px-4 py-2 rounded-2xl rounded-bl-sm text-sm">...</div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-zinc-700/40">
              <ChatGPTInput
                placeholder="What would you like to explore today?"
                onSubmit={async (val) => {
                  const newMessages: Message[] = [...messages, { role: 'user', text: val }];
                  setMessages(newMessages);
                  setLoading(true);
                  const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ messages: newMessages }),
                  });
                  const data = await res.json();
                  setMessages([...newMessages, { role: 'assistant', text: data.text || 'No response.' }]);
                  setLoading(false);
                }}
                disabled={loading}
                textColor="#e4e4e7"
                backgroundOpacity={0.08}
                glowIntensity={0.5}
              />
            </div>

            {/* Overlay */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.05), transparent, rgba(147,51,234,0.05))' }}></div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export { FloatingAiAssistant };
