"use client";

import { useEffect, useRef, useState } from "react";

type Placement = "right" | "left" | "top" | "bottom";

export function useHoverFloat(delayShow = 140, delayHide = 120) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<Placement>("right");
  const ref = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const showTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);

  const onEnter = () => {
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    showTimer.current = window.setTimeout(() => setOpen(true), delayShow);
  };

  const onLeave = () => {
    if (showTimer.current) window.clearTimeout(showTimer.current);
    hideTimer.current = window.setTimeout(() => setOpen(false), delayHide);
  };

  // ESC để đóng
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Tính placement tránh tràn màn hình
  useEffect(() => {
    if (!open || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const preferRight = rect.right + 420 < vw;
    const preferLeft = rect.left - 420 > 0;
    const preferTop = rect.top > vh * 0.55;

    if (preferRight) setPlacement("right");
    else if (preferLeft) setPlacement("left");
    else setPlacement(preferTop ? "top" : "bottom");
  }, [open]);

  return { open, setOpen, placement, ref, panelRef, onEnter, onLeave };
}
