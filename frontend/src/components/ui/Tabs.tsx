"use client";

import { cn } from "@/lib/cn";

interface TabsProps {
  tabs: Array<{ id: string; label: string }>;
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <nav className={cn("border-b border-white/10", className)}>
      <div className="flex gap-1">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition relative",
                isActive
                  ? "text-[var(--brand-300)]"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-500)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

