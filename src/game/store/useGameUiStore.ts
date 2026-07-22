"use client";

import { create } from "zustand";

type GameUiStore = {
  isPaused: boolean;
  pauseGame: () => void;
  resumeGame: () => void;
  togglePause: () => void;
};

export const useGameUiStore = create<GameUiStore>((set) => ({
  isPaused: false,
  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
}));
