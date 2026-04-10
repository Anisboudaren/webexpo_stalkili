"use client";

import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PromptInputBox } from "@/components/ui/ai-prompt-box";

type Message = { role: "user" | "ai"; text: string };

const suggestions = [
  "Find supervisors in machine learning + neuroscience",
  "Research recruiter Jane Smith at Google",
  "Match me with climate science PhD supervisors",
  "Who is Dr. Maria Alvarez and what does she research?",
];

function ChatContent() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialSent = useRef(false);

  useEffect(() => {
    const q = searchParams?.get("q") ?? null;
    if (q && !initialSent.current) {
      initialSent.current = true;
      handleSend(q);
    }
  }, [searchParams]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = (message: string) => {
    if (!message.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setLoading(true);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          text: `Researching "${message}"… Connect your API to get real results.`,
        },
      ]);
      setLoading(false);
    }, 1200);
  };

  const isEmpty = messages.length === 0;

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 101%, rgba(245,87,2,1) 0%, rgba(245,87,2,0.8) 8%, rgba(120,40,0,0.6) 18%, rgba(30,10,0,0.9) 32%, rgba(0,0,0,1) 55%)",
      }}
    >
      {/* Messages area — scrollable, sits between navbar and input */}
      <div className="flex-1 overflow-y-auto pt-28 pb-4">
        <div className="max-w-3xl w-full mx-auto px-4">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center gap-10 min-h-[60vh]">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-white mb-3">
                  What do you want to know?
                </h1>
                <p className="text-gray-500 text-base max-w-md">
                  Search a supervisor, research a recruiter, or prep for a cold
                  call. Ask anything.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    className="text-left text-sm text-gray-400 hover:text-white bg-white/3 hover:bg-white/6 border border-white/8 hover:border-white/20 rounded-xl px-4 py-3 transition-all duration-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 py-6">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-white text-black rounded-br-sm"
                        : "bg-white/5 text-gray-200 border border-white/10 rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-white/50 animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
          )}
        </div>
      </div>

      {/* Input — pinned to bottom */}
      <div className="shrink-0 max-w-3xl w-full mx-auto px-4 pb-6">
        <PromptInputBox
          onSend={handleSend}
          isLoading={loading}
          placeholder="Search a supervisor, recruiter, or topic…"
        />
        <p className="text-center text-xs text-gray-700 mt-3">
          Scopeout uses AI to surface public information. Always verify before
          acting.
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
