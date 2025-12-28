"use client";

import { DEMO_MODE } from "@/lib/env";
import { AlertCircle } from "lucide-react";

/**
 * Demo Mode Banner Component
 * 
 * Displays a banner at the top of the page when DEMO_MODE is enabled.
 * Should be added to PublicLayout and AuthenticatedLayout.
 */
export function DemoBanner() {
  if (!DEMO_MODE) {
    return null;
  }

  return (
    <div className="bg-yellow-500/20 border-b border-yellow-500/50 px-4 py-2">
      <div className="container mx-auto flex items-center gap-2 text-sm">
        <AlertCircle className="h-4 w-4 text-yellow-400 flex-shrink-0" />
        <span className="font-semibold text-yellow-400">DEMO MODE</span>
        <span className="text-yellow-300/80">(Authentication disabled - showing mock data)</span>
      </div>
    </div>
  );
}

