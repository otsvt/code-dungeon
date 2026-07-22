"use client";

import { create } from "zustand";

export type PauseConfirmation = "restart" | "exit";

type GameUiStore = {
  isPaused: boolean;
  confirmation: PauseConfirmation | null;
  pauseGame: () => void;
  resumeGame: () => void;
  togglePause: () => void;
  openConfirmation: (confirmation: PauseConfirmation) => void;
  closeConfirmation: () => void;
};

export const useGameUiStore = create<GameUiStore>((set) => ({
  isPaused: false,
  confirmation: null,
  pauseGame: () => set({ isPaused: true, confirmation: null }),
  resumeGame: () => set({ isPaused: false, confirmation: null }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused, confirmation: null })),
  openConfirmation: (confirmation) => set({ confirmation }),
  closeConfirmation: () => set({ confirmation: null }),
}));
