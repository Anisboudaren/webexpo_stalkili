'use client';

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { PromptInputBox } from './ui/ai-prompt-box';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  React.useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-chat', handler);
    return () => window.removeEventListener('open-chat', handler);
  }, []);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: 'Hi! Ask me anything about finding your ideal PhD supervisor or researching a recruiter.' },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = (message: string) => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text: message }]);
    setLoading(true);
    // Simulate AI response — wire up to your API here
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', text: `Searching for intel on: "${message}"… (connect your API to get real results)` }]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      {open && (
        <div className="w-[360px] rounded-2xl border border-white/10 bg-gray-950/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden"
          style={{ maxHeight: '520px' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span className="text-sm font-semibold text-white">Scopeout AI</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3 min-h-0" style={{ maxHeight: '320px' }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-orange-500 text-white rounded-br-sm'
                    : 'bg-white/5 text-gray-200 rounded-bl-sm border border-white/10'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-2 flex gap-1 items-center">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/10">
            <PromptInputBox
              onSend={handleSend}
              isLoading={loading}
              placeholder="Search a supervisor, recruiter..."
              className="!rounded-xl"
            />
          </div>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setOpen((p) => !p)}
        className="h-14 w-14 rounded-full bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/30 flex items-center justify-center transition-all duration-300 hover:scale-105"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
}
