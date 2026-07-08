"use client";

import { create } from "zustand";
import type { RunSettings } from "@/features/run-setup";
import type { CurrentRun } from "../types/run";

type RunStore = {
  currentRun: CurrentRun | null;
  startRun: (settings: RunSettings) => void;
  resetRun: () => void;
};

export const useRunStore = create<RunStore>((set) => ({
  currentRun: null,
  startRun: (settings) => {
    set({
      currentRun: {
        id: crypto.randomUUID(),
        settings,
        status: "created",
      },
    });
  },
  resetRun: () => {
    set({
      currentRun: null,
    });
  },
}));
