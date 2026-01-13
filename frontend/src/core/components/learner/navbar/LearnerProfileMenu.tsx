"use client";

import Link from "next/link";
import { useLogout, useCurrentUser } from "@/hooks/useAuth";

type Props = {
  onClose?: () => void;
};

export function LearnerProfileMenu({ onClose }: Props) {
  const { mutate: logout, isPending } = useLogout();
  const { data: user } = useCurrentUser();

  const handleClick = () => {
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logout();
  };

  const initials = user?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  return (
    <div
      className="absolute right-0 top-11 w-72 rounded-2xl border border-white/10
                 bg-slate-950/95 shadow-[0_18px_40px_rgba(15,23,42,0.8)]
                 backdrop-blur p-3 text-sm text-slate-100 z-50"
    >
      <div className="flex items-center gap-3 px-2 py-1.5">
        <div className="h-9 w-9 rounded-full bg-slate-900 border border-white/10 flex items-center justify-center text-xs font-semibold">
          {initials}
        </div>
        <div className="min-w-0">
          <p className="font-semibold truncate">{user?.fullName || "User"}</p>
          <p className="text-xs text-slate-400 truncate">
            {user?.email || "email@example.com"}
          </p>
        </div>
      </div>

      <div className="my-2 h-px bg-white/10" />

      <div className="grid grid-cols-3 gap-2 px-2 pb-2 text-[11px] text-slate-300">
        <div>
          <p className="font-semibold text-slate-50">12</p>
          <p className="text-slate-400">Courses</p>
        </div>
        <div>
          <p className="font-semibold text-slate-50">4</p>
          <p className="text-slate-400">In progress</p>
        </div>
        <div>
          <p className="font-semibold text-slate-50">8</p>
          <p className="text-slate-400">Completed</p>
        </div>
      </div>

      <div className="my-2 h-px bg-white/10" />

      <nav className="flex flex-col gap-1 text-[13px]">
        <Link
          href="/learner/profile"
          onClick={handleClick}
          className="flex items-center justify-between rounded-xl px-3 py-2
                     hover:bg-slate-900/80 transition"
        >
          <span>View profile</span>
          <span className="text-[11px] text-[var(--brand-300)]">
            Open
          </span>
        </Link>

        <Link
          href="/learner/my-learning"
          onClick={handleClick}
          className="rounded-xl px-3 py-2 hover:bg-slate-900/80 transition"
        >
          My learning
        </Link>
      </nav>

      <div className="my-2 h-px bg-white/10" />

      <button
        type="button"
        onClick={handleLogout}
        disabled={isPending}
        className="w-full rounded-xl px-3 py-2 text-[13px] text-rose-300
                   hover:bg-rose-500/10 hover:text-rose-200 transition disabled:opacity-50"
      >
        {isPending ? "Logging out..." : "Log out"}
      </button>
    </div>
  );
}
