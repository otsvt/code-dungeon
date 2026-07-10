"use client";

import { create } from "zustand";
import { type RunSettings } from "@/features/run-setup";
import { type CurrentRun } from "../types/run";

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
        currentRoom: { type: "start" },
        roomNumber: 0,
        lives: {
          current: 1,
          max: 1,
        },
        activeBuffIds: [],
        activeDebuffIds: [],
        impression: 0,
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
