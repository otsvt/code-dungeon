"use client";

import { create } from "zustand";
import { type RunSettings } from "@/features/run-setup";
import { type CurrentRun } from "../types/run";
import { START_BUFFS, type Buff } from "../types/buff";

const MIN_RUN_ROOMS = 5;
const MAX_RUN_ROOMS = 9;

function generateRunRoomCount() {
  return Math.floor(Math.random() * (MAX_RUN_ROOMS - MIN_RUN_ROOMS + 1)) + MIN_RUN_ROOMS;
}

type RunStore = {
  currentRun: CurrentRun | null;
  pendingStartBuff: Buff | null;
  startRun: (settings: RunSettings) => void;
  resetRun: () => void;
  prepareStartBuff: () => Buff | null;
  completeStartBuffGrant: () => void;
};

export const useRunStore = create<RunStore>((set) => ({
  currentRun: null,
  pendingStartBuff: null,
  startRun: (settings) => {
    set({
      pendingStartBuff: null,
      currentRun: {
        id: crypto.randomUUID(),
        settings,
        currentRoom: { type: "start" },
        roomNumber: 0,
        totalRooms: generateRunRoomCount(),
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
      pendingStartBuff: null,
    });
  },
  prepareStartBuff: () => {
    let preparedBuff: Buff | null = null;

    set((state) => {
      if (!state.currentRun || state.currentRun.startBuffGranted) {
        return state;
      }

      if (state.pendingStartBuff) {
        preparedBuff = state.pendingStartBuff;
        return state;
      }

      const randomIndex = Math.floor(Math.random() * START_BUFFS.length);
      const buff = START_BUFFS[randomIndex];

      preparedBuff = buff;

      return {
        pendingStartBuff: buff,
      };
    });

    return preparedBuff;
  },
  completeStartBuffGrant: () => {
    set((state) => {
      if (!state.currentRun || !state.pendingStartBuff || state.currentRun.startBuffGranted) {
        return state;
      }

      return {
        pendingStartBuff: null,
        currentRun: {
          ...state.currentRun,
          activeBuffs: [...state.currentRun.activeBuffs, state.pendingStartBuff],
          startBuffGranted: true,
        },
      };
    });
  },
}));
