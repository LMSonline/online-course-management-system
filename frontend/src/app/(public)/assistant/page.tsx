"use client";

import { useState } from "react";
import { Bot, Send, User } from "lucide-react";

type Message = {
  id: number;
  from: "user" | "bot";
  text: string;
};

const initialMessages: Message[] = [
  {
    id: 1,
    from: "bot",
    text: "Hi there 👋 I'm your AI Tutor. Tell me your learning goals and I'll help you design a learning path with the right courses on LMS.",
  },
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), from: "user", text },
      // TODO: sau này push thêm message của bot sau khi call API
    ]);
    setInput("");
  }

  function handleQuickPrompt(prompt: string) {
    setInput(prompt);
  }

  return (
    <main className="flex justify-center px-4 sm:px-6 md:px-8 xl:px-16 py-4 md:py-6">
      <div className="w-full max-w-4xl lg:max-w-5xl flex flex-col h-[calc(100vh-90px)]">
        {/* Header */}
        <header className="mb-4 md:mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-600)]/40 bg-[var(--brand-600)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-300)]">
            <Bot className="w-3.5 h-3.5" />
            AI Tutor
          </div>
          <h1 className="mt-3 text-2xl md:text-3xl font-extrabold tracking-tight">
            Ask the LMS AI Tutor
          </h1>
          <p className="mt-2 text-sm md:text-[15px] text-slate-300 max-w-2xl">
            Describe your goals, experience level, or topics you want to learn. The AI
            Tutor will help you plan a learning path and map it to LMS courses.
          </p>
        </header>

        {/* Chat container */}
        <div className="flex-1 flex flex-col rounded-3xl border border-white/10 bg-slate-950/85 shadow-[0_0_40px_rgba(132,204,22,0.20)] overflow-hidden">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 pt-4 pb-3 space-y-4">
            {messages.map((m) => {
              const isUser = m.from === "user";
              return (
                <div
                  key={m.id}
                  className={`flex w-full ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                      flex gap-3 max-w-[80%]
                      ${isUser ? "flex-row-reverse" : "flex-row"}
                    `}
                  >
                    {/* Avatar */}
                    <div
                      className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-full border ${
                        isUser
                          ? "bg-slate-900 border-white/15"
                          : "bg-[var(--brand-600)]/20 border-[var(--brand-600)]/50"
                      }`}
                    >
                      {isUser ? (
                        <User className="w-4 h-4 text-slate-100" />
                      ) : (
                        <Bot className="w-4 h-4 text-[var(--brand-300)]" />
                      )}
                    </div>

                    {/* Bubble */}
                    <div
                      className={`
                        rounded-2xl px-4 py-3 text-sm md:text-[15px] leading-relaxed
                        border
                        ${
                          isUser
                            ? "bg-slate-800/90 border-white/15 text-slate-50"
                            : "bg-slate-900/80 border-[var(--brand-600)]/40 text-slate-50"
                        }
                      `}
                    >
                      {m.text}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick prompts */}
          <div className="px-4 sm:px-6 md:px-8 pb-2 space-y-2">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">
              Try asking:
            </p>
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
                  className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1.5 text-[11px] md:text-xs text-slate-300 hover:border-[var(--brand-400)]/70 hover:text-[var(--brand-100)] hover:bg-slate-900 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input area */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-white/10 bg-slate-950/95 px-3 sm:px-5 md:px-6 py-3 md:py-4"
          >
            <div className="flex items-end gap-2 rounded-2xl border border-white/15 bg-slate-900/90 px-3 py-2 md:px-4 md:py-2.5">
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder='Ask anything about your learning journey, e.g. "I know basic HTML/CSS, what should I learn next?"'
                className="flex-1 resize-none bg-transparent text-sm md:text-[15px] text-slate-100 outline-none placeholder:text-slate-500 max-h-32"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="inline-flex items-center justify-center rounded-xl bg-[var(--brand-600)] text-white px-3 py-2 md:px-4 md:py-2.5 text-sm font-medium hover:bg-[var(--brand-900)] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send className="w-4 h-4 md:mr-1" />
                <span className="hidden md:inline">Send</span>
              </button>
            </div>
            <p className="mt-2 text-[11px] text-slate-500 text-center">
              AI Tutor is in preview. Suggestions may be imperfect — always adapt the
              plan to your own goals.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
