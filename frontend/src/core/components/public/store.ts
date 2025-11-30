"use client";

import { create } from "zustand";

interface AssistantStore {
  open: boolean;
  openPopup: () => void;
  closePopup: () => void;
}

export const useAssistantStore = create<AssistantStore>((set) => ({
  open: false,
  openPopup: () => set({ open: true }),
  closePopup: () => set({ open: false }),
}));
