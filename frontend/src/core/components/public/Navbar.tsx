"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, Bot, Menu, X, Sun, Moon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useAssistantStore } from "@/core/components/public/store";
import { useTheme } from "next-themes";

function NavItem({ href, label, className }: { href: string; label: string; className?: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
  return <Link href={href} className={cn("nav-link", active && "active", className)}>{label}</Link>;
}

export default function Navbar() {
  const openPopup = useAssistantStore((s) => s.openPopup);
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [open]);

  return (
    <header className="navbar">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 text-body">
        {/* LEFT */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            aria-label="Menu"
            className="lg:hidden p-2 rounded-md hover:bg-[color:color-mix(in_srgb,var(--brand-primary)_8%,transparent)]"
            onClick={() => setOpen(true)}
          >
            <Menu size={18} className="text-muted" />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/lms_logo.png" alt="LMS" width={28} height={28} priority />
            {/* LMS: đậm + neon glow */}
            <span className="font-extrabold tracking-tight text-[color:var(--brand-primary)] text-glow-lime">
              LMS
            </span>
          </Link>

          <NavItem href="/explore" label="Explore" className="hidden md:inline-flex" />
        </div>

        {/* CENTER: Search (đã fix icon/placeholder) */}
        <div className="flex-1 max-w-[960px]">
          <div className="searchbar">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 input-icon" size={18} />
            <input
              placeholder="Search for anything"
              className="search-input w-full"
              onKeyDown={(e) => { if (e.key === "Enter") location.href = "/explore"; }}
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link href="#" className="hidden xl:block nav-link">LMS Business</Link>
          <Link href="#" className="hidden lg:block nav-link">Teach on LMS</Link>

          {/* Cart */}
          <button className="btn-icon hidden sm:inline-flex" aria-label="Cart">
            <ShoppingCart size={18} />
          </button>

          {/* Log in – outline strong (nổi bật) */}
          <Link href="/login">
            <button className="btn btn-outline strong">Log in</button>
          </Link>

          {/* Sign up – neon cùng màu LMS */}
          <Link href="/signup">
            <button className="btn btn-primary neon">Sign up</button>
          </Link>

          {/* Theme toggle button */}
          <button
            aria-label="Toggle theme"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 
              bg-slate-900/60 text-slate-200 
              hover:bg-slate-800/80 hover:text-[var(--brand-300)] 
              transition"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {mounted && (
              theme === "dark"
                ? <Sun className="w-5 h-5" />
                : <Moon className="w-5 h-5" />
            )}
          </button>

          {/* AI Tutor button – thay cho nút chọn ngôn ngữ */}
          <button
            onClick={openPopup}
            aria-label="Open AI study assistant"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 
        bg-slate-900/60 text-slate-200 
        hover:bg-slate-800/80 hover:text-[var(--brand-300)] 
        transition"
          >
            <Bot className="w-5 h-5" />
          </button>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div className={cn("fixed inset-0 z-50 lg:hidden transition", open ? "visible" : "invisible")}>
        <div className={cn("absolute inset-0 bg-black/40", open ? "opacity-100" : "opacity-0")} />
        <div
          ref={drawerRef}
          className={cn(
            "absolute left-0 top-0 h-full w-[86%] max-w-[360px] drawer-panel shadow-xl p-4 flex flex-col gap-4 transition-transform",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/images/lms_logo.png" alt="LMS" width={24} height={24} />
              <span className="font-extrabold text-[color:var(--brand-primary)] text-glow-lime">LMS</span>
            </div>
            <button
              aria-label="Close"
              className="p-2 rounded-md hover:bg-[color:color-mix(in_srgb,var(--brand-primary)_8%,transparent)]"
              onClick={() => setOpen(false)}
            >
              <X size={18} className="text-muted" />
            </button>
          </div>

          {/* Mobile search đồng bộ */}
          <div className="searchbar mt-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 input-icon" size={18} />
            <input
              placeholder="Search for anything"
              className="search-input w-full pl-10"
              onKeyDown={(e) => { if (e.key === "Enter") { setOpen(false); location.href = "/explore"; } }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <NavItem href="/explore" label="Explore" />
            {["Web Dev", "Data Science", "Design", "Mobile", "AI/ML"].map((c) => (
              <a key={c} href={`#/c/${encodeURIComponent(c)}`} className="nav-link">{c}</a>
            ))}
          </div>

          <div className="mt-auto flex gap-2">
            <button className="btn btn-outline strong flex-1">Log in</button>
            <button className="btn btn-primary neon flex-1">Sign up</button>
          </div>
        </div>
      </div>
    </header>
  );
}
