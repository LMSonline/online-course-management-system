"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Heart,
  Bell,
  Bot,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { LearnerProfileMenu } from "@/core/components/learner/navbar/LearnerProfileMenu"; // ⬅️ thêm
import { useAssistantStore } from "@/core/components/public/store";
import { getUnreadNotificationCount } from "@/features/community/services/community.service";
import { useRouter } from "next/navigation";
import { ExploreMegaMenu } from "@/core/components/public/ExploreMegaMenu";

function NavItem({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const pathname = usePathname();
  const active =
    pathname === href || (href !== "/" && pathname?.startsWith(href));
  return (
    <Link href={href} className={cn("nav-link", active && "active", className)}>
      {label}
    </Link>
  );
}

export default function LearnerNavbar() {
  const openPopup = useAssistantStore((s) => s.openPopup);
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const [exploreOpen, setExploreOpen] = useState(false);
  const exploreBtnRef = useRef<HTMLButtonElement>(null);
  const [exploreRect, setExploreRect] = useState<DOMRect | null>(null);

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [open]);

  useEffect(() => {
    if (!profileOpen) return;
    function onClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [profileOpen]);

  useEffect(() => {
    async function loadUnreadCount() {
      try {
        const count = await getUnreadNotificationCount();
        setUnreadCount(count);
      } catch (error) {
        // Silently fail - user might not be authenticated
      }
    }
    loadUnreadCount();
    // Refresh every 30 seconds
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="navbar">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 text-body">
        {/* LEFT: logo + Explore */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            aria-label="Menu"
            className="lg:hidden p-2 rounded-md hover:bg-[color:color-mix(in_srgb,var(--brand-primary)_8%,transparent)]"
            onClick={() => setOpen(true)}
          >
            <Menu size={18} className="text-muted" />
          </button>

          <Link href="/learner/catalog" className="flex items-center gap-2">
            <Image
              src="/images/lms_logo.png"
              alt="LMS"
              width={28}
              height={28}
              priority
            />
            <span className="font-extrabold tracking-tight text-[color:var(--brand-primary)] text-glow-lime">
              LMS
            </span>
          </Link>

          <div className="relative hidden md:inline-flex">
            <button
              ref={exploreBtnRef}
              className={cn(
                "nav-link",
                pathname?.startsWith("/explore") || pathname?.startsWith("/topic")
                  ? "active"
                  : ""
              )}
              onMouseEnter={() => {
                setExploreOpen(true);
                if (exploreBtnRef.current) setExploreRect(exploreBtnRef.current.getBoundingClientRect());
              }}
              onClick={() => {
                const next = !exploreOpen;
                setExploreOpen(next);
                if (next && exploreBtnRef.current) setExploreRect(exploreBtnRef.current.getBoundingClientRect());
              }}
            >
              Explore
            </button>
          </div>
        </div>

        {/* CENTER: big search bar giống Udemy */}
        <div className="flex-1 max-w-[960px]">
          <div className="searchbar">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 input-icon" size={18} />
            <input
              placeholder="Search for anything"
              className="search-input w-full"
              onKeyDown={(e) => {
                const target = e.target as HTMLInputElement;
                if (e.key === "Enter" && target.value.trim()) {
                  location.href = `/search?q=${encodeURIComponent(target.value.trim())}`;
                } else if (e.key === "Enter") {
                  location.href = "/explore";
                }
              }}
            />
          </div>
        </div>

        {/* RIGHT: business + instructor + my learning + icons + avatar */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link href="/business" className="hidden xl:block nav-link">
            LMS Business
          </Link>
          <Link href="/teach" className="hidden lg:block nav-link">
            Instructor
          </Link>
          <Link href="/learner/my-learning" className="hidden md:block nav-link">
            My learning
          </Link>

          {/* Wishlist */}
          <button
            className="btn-icon hidden sm:inline-flex"
            aria-label="Wishlist"
          >
            <Heart size={18} />
          </button>

          {/* Cart */}
          <button
            className="btn-icon hidden sm:inline-flex"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
          </button>

          {/* Notifications */}
          <Link
            href="/notifications"
            className="btn-icon hidden sm:inline-flex relative"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-semibold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

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

          {/* Avatar learner – hiện để static, sau bind user data */}
          <div className="relative" ref={profileRef}>
            <button
              className="h-9 w-9 rounded-full bg-slate-900 text-xs font-semibold text-white 
                         flex items-center justify-center border border-white/10"
              aria-label="Profile"
              onClick={() => setProfileOpen((v) => !v)}
            >
              TD
            </button>

            {profileOpen && <LearnerProfileMenu onClose={() => setProfileOpen(false)} />}
          </div>
        </div>
      </div>

      {/* Explore Mega Menu (portal) */}
      <ExploreMegaMenu
        isOpen={exploreOpen}
        onClose={() => setExploreOpen(false)}
        anchorRect={exploreRect}
        anchorRef={exploreBtnRef}
      />

      {/* MOBILE DRAWER */}
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden transition",
          open ? "visible" : "invisible"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/40",
            open ? "opacity-100" : "opacity-0"
          )}
        />
        <div
          ref={drawerRef}
          className={cn(
            "absolute left-0 top-0 h-full w-[86%] max-w-[360px] drawer-panel shadow-xl p-4 flex flex-col gap-4 transition-transform",
            open ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Image
                src="/images/lms_logo.png"
                alt="LMS"
                width={24}
                height={24}
              />
              <span className="font-extrabold text-[color:var(--brand-primary)] text-glow-lime">
                LMS
              </span>
            </div>
            <button
              aria-label="Close"
              className="p-2 rounded-md hover:bg-[color:color-mix(in_srgb,var(--brand-primary)_8%,transparent)]"
              onClick={() => setOpen(false)}
            >
              <X size={18} className="text-muted" />
            </button>
          </div>

          {/* Mobile search */}
          <div className="searchbar mt-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 input-icon"
              size={18}
            />
            <input
              placeholder="Search for anything"
              className="search-input w-full pl-10"
              onKeyDown={(e) => {
                const target = e.target as HTMLInputElement;
                if (e.key === "Enter") {
                  setOpen(false);
                  if (target.value.trim()) {
                    location.href = `/search?q=${encodeURIComponent(target.value.trim())}`;
                  } else {
                    location.href = "/explore";
                  }
                }
              }}
            />
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-1 mt-2">
            <NavItem href="/explore" label="Explore" />
            <NavItem href="/learner/my-learning" label="My learning" />
            <NavItem href="/business" label="LMS Business" />
            <NavItem href="/teach" label="Instructor" />
          </div>

          <div className="mt-auto flex items-center justify-between gap-3">
            <button
              className="btn-icon"
              aria-label="Wishlist"
            >
              <Heart size={18} />
            </button>
            <button
              className="btn-icon"
              aria-label="Cart"
            >
              <ShoppingCart size={18} />
            </button>
            <Link
              href="/notifications"
              className="btn-icon relative"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs font-semibold flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
            <Link
              href="/assistant"
              aria-label="Open AI study assistant"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 
               bg-slate-900/60 text-slate-200 
               hover:bg-slate-800/80 hover:text-[var(--brand-300)] 
               transition"
            >
              <Bot className="w-5 h-5" />
            </Link>
            <button
              className="h-9 w-9 rounded-full bg-slate-900 text-xs font-semibold text-white 
                         flex items-center justify-center border border-white/10"
              aria-label="Profile"
            >
              TD
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
