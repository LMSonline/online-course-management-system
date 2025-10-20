"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ShoppingCart, Globe, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Button from "@/app/components/Button";
import { cn } from "@/lib/cn";

function NavItem({ href, label, className }: { href: string; label: string; className?: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname?.startsWith(href));
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-2 rounded-md text-sm",
        active ? "bg-slate-100 text-slate-900" : "text-slate-700 hover:bg-slate-100",
        className
      )}
    >
      {label}
    </Link>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // đóng drawer khi click ngoài
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setOpen(false);
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* LEFT: hamburger + brand + Explore */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            aria-label="Menu"
            className="lg:hidden p-2 rounded-md hover:bg-slate-100"
            onClick={() => setOpen(true)}
          >
            <Menu size={18} />
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image src="/images/lms_logo.png" alt="LMS" width={28} height={28} priority />
            <span className="text-xl font-extrabold tracking-tight text-slate-900">LMS</span>
          </Link>

          <NavItem href="/explore" label="Explore" className="hidden md:inline-flex" />
        </div>

        {/* CENTER: search (chiếm đa số không gian) */}
        <div className="flex-1 max-w-[960px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              placeholder="Search for anything"
              className="w-full bg-white border border-slate-300 rounded-full py-3 pl-11 pr-4
                         focus:outline-none focus:border-[var(--primary)] placeholder:text-slate-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") location.href = "/explore";
              }}
            />
          </div>
        </div>

        {/* RIGHT: actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href="#"
            className="hidden xl:block px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100"
          >
            LMS Business
          </Link>
          <Link
            href="#"
            className="hidden lg:block px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100"
          >
            Teach on LMS
          </Link>

          <Button variant="soft" className="hidden sm:inline-flex" aria-label="Cart">
            <ShoppingCart size={18} />
          </Button>

          <Link href="#">
            <Button variant="outline">Log in</Button>
          </Link>
          <Link href="#">
            <Button variant="primary">Sign up</Button>
          </Link>

          <Button variant="soft" aria-label="Language" className="hidden sm:inline-flex">
            <Globe size={20} strokeWidth={1.6} />
          </Button>

        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition",
          open ? "visible" : "invisible"
        )}
      >
        {/* backdrop */}
        <div className={cn("absolute inset-0 bg-black/30", open ? "opacity-100" : "opacity-0")} />

        {/* panel */}
        <div
          ref={drawerRef}
          className={cn(
            "absolute left-0 top-0 h-full w-[86%] max-w-[360px] bg-white shadow-xl p-4 flex flex-col gap-4 transition-transform",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image src="/images/lms_logo.png" alt="LMS" width={24} height={24} />
              <span className="font-bold">LMS</span>
            </div>
            <button
              aria-label="Close"
              className="p-2 rounded-md hover:bg-slate-100"
              onClick={() => setOpen(false)}
            >
              <X size={18} />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              placeholder="Search for anything"
              className="w-full bg-white border border-slate-300 rounded-full py-3 pl-10 pr-4
                         focus:outline-none focus:border-[var(--primary)] placeholder:text-slate-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setOpen(false);
                  location.href = "/explore";
                }
              }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <NavItem href="/explore" label="Explore" />
            {["Web Dev", "Data Science", "Design", "Mobile", "AI/ML"].map((c) => (
              <a
                key={c}
                href={`#/c/${encodeURIComponent(c)}`}
                className="px-3 py-2 rounded-md text-sm text-slate-700 hover:bg-slate-100"
              >
                {c}
              </a>
            ))}
          </div>

          <div className="mt-auto flex gap-2">
            <Button variant="outline" className="flex-1">
              Log in
            </Button>
            <Button variant="primary" className="flex-1">
              Sign up
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
