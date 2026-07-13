"use client";

import { create } from "zustand";
import { type RunSettings } from "@/features/run-setup";
import { type CurrentRun } from "../types/run";
import { START_BUFF_IDS } from "../types/buff";

type RunStore = {
  currentRun: CurrentRun | null;
  startRun: (settings: RunSettings) => void;
  resetRun: () => void;
  grantStartBuff: () => void;
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
        startBuffGranted: false,
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
  grantStartBuff: () => {
    set((state) => {
      if (!state.currentRun || state.currentRun.startBuffGranted) {
        return state;
      }

      const randomIndex = Math.floor(Math.random() * START_BUFF_IDS.length);
      const startBuffId = START_BUFF_IDS[randomIndex];

      return {
        currentRun: {
          ...state.currentRun,
          activeBuffIds: [...state.currentRun.activeBuffIds, startBuffId],
          startBuffGranted: true,
        },
      };
    });
  },
}));
