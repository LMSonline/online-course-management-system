"use client";

import { useState } from "react";
import { Bot, Send, User, X } from "lucide-react";

type Message = {
  id: number;
  from: "user" | "bot";
  text: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    from: "bot",
    text: "Hi there 👋 I'm your AI Tutor. Tell me your learning goals and I’ll help!",
  },
];

export default function AssistantPopup({ open, onClose }: {
  open: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  if (!open) return null;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages(prev => [
      ...prev,
      { id: Date.now(), from: "user", text }
    ]);

    setInput("");
  }

  function handleQuickPrompt(prompt: string) {
    setInput(prompt);
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 px-4 sm:px-6 py-6">
      {/* popup card */}
      <div className="relative w-full max-w-4xl lg:max-w-5xl h-[80vh] rounded-3xl border border-white/10 bg-slate-950/95 shadow-[0_0_50px_rgba(132,204,22,0.28)] overflow-hidden flex flex-col">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-slate-50 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="px-6 py-4 border-b border-white/10 bg-slate-950/80 relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-600)]/40 bg-[var(--brand-600)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-300)]">
            <Bot className="w-3.5 h-3.5" />
            AI Tutor
          </div>
          <h2 className="mt-2 text-base font-semibold text-slate-50">
            Ask the LMS AI Tutor
          </h2>
        </div>

        {/* CHAT AREA */}
        <div className="relative flex-1 flex flex-col min-h-0">
          <div className="flex-1 min-h-0 overflow-y-auto px-6 pt-4 pb-3 space-y-4">
            {messages.map(m => (
              <div
                key={m.id}
                className={`flex w-full ${m.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${m.from === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  
                  {/* avatar */}
                  <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border ${
                    m.from === "user"
                      ? "bg-slate-900 border-white/15"
                      : "bg-[var(--brand-600)]/20 border-[var(--brand-600)]/50"
                  }`}>
                    {m.from === "user"
                      ? <User className="w-4 h-4 text-slate-100" />
                      : <Bot className="w-4 h-4 text-[var(--brand-300)]" />}
                  </div>

                  {/* bubble */}
                  <div className={`rounded-2xl px-4 py-3 text-sm border ${
                    m.from === "user"
                      ? "bg-slate-800/90 border-white/15 text-slate-50"
                      : "bg-slate-900/85 border-[var(--brand-600)]/40 text-slate-50"
                  }`}>
                    {m.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* quick prompts */}
          <div className="px-6 pb-2 space-y-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Create a 3-month roadmap to become a frontend developer.",
                "Suggest courses to prepare for backend interviews.",
                "I have 5 hours per week. How should I learn data structures?",
              ].map((q, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickPrompt(q)}
                  className="rounded-full border border-white/10 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-300 hover:border-[var(--brand-400)]/70 hover:text-[var(--brand-100)] transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* input */}
          <form onSubmit={handleSubmit} className="border-t border-white/10 bg-slate-950/95 px-6 py-3">
            <div className="flex items-end gap-2 rounded-2xl border border-white/15 bg-slate-900/95 px-4 py-2">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 resize-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500 max-h-32"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-600)] text-white px-4 py-2 text-sm font-medium transition hover:bg-[var(--brand-900)] disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-1" />
                Send
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
