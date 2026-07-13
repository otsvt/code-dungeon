"use client";

import { create } from "zustand";
import { type RunSettings } from "@/features/run-setup";
import { type CurrentRun } from "../types/run";
import { START_BUFFS, type Buff } from "../types/buff";

type RunStore = {
  currentRun: CurrentRun | null;
  startRun: (settings: RunSettings) => void;
  resetRun: () => void;
  grantStartBuff: () => Buff | null;
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
        activeBuffs: [],
        activeDebuffs: [],
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
    let grantedBuff: Buff | null = null;

    set((state) => {
      if (!state.currentRun || state.currentRun.startBuffGranted) {
        return state;
      }

      const randomIndex = Math.floor(Math.random() * START_BUFFS.length);
      const buff = START_BUFFS[randomIndex];

      grantedBuff = buff;

      return {
        currentRun: {
          ...state.currentRun,
          activeBuffs: [...state.currentRun.activeBuffs, buff],
          startBuffGranted: true,
        },
      };
    });

    return grantedBuff;
  },
}));
