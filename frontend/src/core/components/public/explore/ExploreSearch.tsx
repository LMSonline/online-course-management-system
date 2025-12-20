"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export default function ExploreSearch() {
  const [q, setQ] = useState("");

  return (
    <div className="w-full">
      <div className="
        flex items-center gap-3 rounded-xl 
        bg-white/5 border border-white/10 backdrop-blur
        px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.2)]
        focus-within:ring-2 focus-within:ring-lime-400/40
        transition">
        <Search className="text-muted-foreground h-5 w-5" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search for anything..."
          className="bg-transparent flex-1 outline-none text-base"
        />
      </div>

      <div className="mt-3 flex gap-2 flex-wrap">
        {["React", "Python", "UI Design", "AI", "Next.js"].map((t) => (
          <a
            key={t}
            href={`/explore?q=${encodeURIComponent(t)}`}
            className="px-3 py-1 rounded-full text-sm bg-white/10 hover:bg-white/20 transition text-muted-foreground"
          >
            {t}
          </a>
        ))}
      </div>
    </div>
  );
}
