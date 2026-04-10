'use client';
import React, { useState, useRef, useEffect } from 'react';
import { SiriOrb } from './ui/siri-orb';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: input }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: 'assistant', text: data.text || 'No response.' }]);
    setLoading(false);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="bg-white border rounded-xl shadow-xl w-80 flex flex-col overflow-hidden">
          <div className="bg-blue-500 text-white px-4 py-3 flex justify-between items-center">
            <span className="font-semibold">AI Assistant</span>
            <button onClick={() => setOpen(false)} className="text-white hover:opacity-70">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 h-72">
            {messages.length === 0 && (
              <p className="text-gray-400 text-sm text-center mt-8">Ask me anything!</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                  m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-400 px-3 py-2 rounded-lg text-sm">...</div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Type a message..."
              className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={send}
              disabled={loading}
              className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 disabled:opacity-50 text-sm"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <button onClick={() => setOpen(!open)} className="rounded-full shadow-lg hover:opacity-90 transition-opacity">
        <SiriOrb size="56px" animationDuration={open ? 8 : 20} />
      </button>
    </div>
  );
}
