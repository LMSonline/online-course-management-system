"use client";

import { Search } from "lucide-react";

export default function ExploreHero() {
  return (
    <section className="relative px-4 sm:px-6 md:px-10 xl:px-16 py-16">

      {/* Background subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-lime-400/5 via-transparent to-indigo-400/5 blur-3xl opacity-30 pointer-events-none" />

      <div className="relative max-w-3xl">
        <h1 className="text-[40px] md:text-[54px] font-extrabold leading-tight">
          Unlock Your Potential  
          <span className="block text-lime-300">Learn Anything. Anytime.</span>
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl mt-4 leading-relaxed">
          Explore thousands of high-quality courses designed by industry experts.
        </p>

        {/* Search Input */}
        <div className="mt-8 group">
          <div className="
            flex items-center gap-3 rounded-2xl w-full max-w-2xl
            bg-white/5 border border-white/15 px-6 py-5 backdrop-blur
            shadow-[0_8px_30px_rgba(0,0,0,0.25)]
            group-focus-within:border-lime-400/40 
            transition
          ">
            <Search className="h-6 w-6 text-muted-foreground" />
            <input
              placeholder="Search for courses, topics, or instructors..."
              className="flex-1 bg-transparent outline-none text-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
