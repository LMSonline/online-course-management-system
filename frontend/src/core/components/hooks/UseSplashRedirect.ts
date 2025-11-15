"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function useSplashRedirect(ms = 1600, to = "/explore") {
  const router = useRouter();
  useEffect(() => {
    const id = setTimeout(() => router.push(to), ms);
    return () => clearTimeout(id);
  }, [ms, to, router]);
}
