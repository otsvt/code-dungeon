"use client";

import { create } from "zustand";
import { type RunSettings } from "@/features/run-setup";
import { type CurrentRun } from "../types/run";
import {
  START_BUFFS,
  getBuffById,
  type Buff,
  type BuffId,
} from "../types/buff";
import { type DebuffId } from "../types/debuff";
import { addEffectStacks, consumeEffectStacks, type EffectId } from "../types/effect";
import {
  createBattleRoomReward,
  type BattleRoomReward,
  type ChallengeOutcome,
} from "../challenges/challenge";
import {
  generateNextRoomChoices,
  type NextRoomChoice,
} from "../rooms/nextRoomChoices";
import {
  createHrRoomReward,
  type HrRoomReward,
} from "../rooms/hrRoom";

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
  advanceToRoom: (choice: NextRoomChoice) => boolean;
  completeBattleRoom: (
    outcome: ChallengeOutcome,
    reward?: BattleRoomReward,
  ) => BattleRoomReward | null;
  completeHrRoom: (
    outcome: ChallengeOutcome,
    reward?: HrRoomReward,
  ) => HrRoomReward | null;
  addEffect: (effectId: EffectId, stacks?: number) => void;
  consumeEffect: (effectId: EffectId, stacks?: number) => void;
};

export const useRunStore = create<RunStore>((set) => ({
  currentRun: null,
  pendingStartBuff: null,
  startRun: (settings) => {
    const totalRooms = generateRunRoomCount();

    set({
      pendingStartBuff: null,
      currentRun: {
        id: crypto.randomUUID(),
        settings,
        currentRoom: { type: "start" },
        nextRoomChoices: generateNextRoomChoices({
          currentRoomNumber: 0,
          totalRooms,
          technologyIds: settings.technologyIds,
        }),
        roomNumber: 0,
        totalRooms,
        lives: {
          current: 1,
          max: 1,
        },
        activeBuffs: [],
        activeDebuffs: [],
        resolvedRoomIds: [],
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
          activeBuffs: addEffectStacks(
            state.currentRun.activeBuffs,
            state.pendingStartBuff.id,
          ),
          startBuffGranted: true,
        },
      };
    });
  },
  advanceToRoom: (choice) => {
    let didAdvance = false;

    set((state) => {
      const currentRun = state.currentRun;

      if (
        !currentRun ||
        !currentRun.nextRoomChoices.some(
          (nextRoomChoice) => nextRoomChoice.id === choice.id,
        )
      ) {
        return state;
      }

      const roomNumber = currentRun.roomNumber + 1;

      didAdvance = true;

      return {
        currentRun: {
          ...currentRun,
          currentRoom: choice,
          nextRoomChoices:
            choice.type === "final"
              ? []
              : generateNextRoomChoices({
                  currentRoomNumber: roomNumber,
                  totalRooms: currentRun.totalRooms,
                  technologyIds: currentRun.settings.technologyIds,
                  allowHrRoom: choice.type !== "hr",
                }),
          roomNumber,
          status: "started",
        },
      };
    });

    return didAdvance;
  },
  completeBattleRoom: (outcome, preparedReward) => {
    let reward: BattleRoomReward | null = null;

    set((state) => {
      const currentRun = state.currentRun;
      const currentRoom = currentRun?.currentRoom;

      if (
        !currentRun ||
        !currentRoom ||
        currentRoom.type !== "battle" ||
        currentRun.resolvedRoomIds.includes(currentRoom.id)
      ) {
        return state;
      }

      const impression = outcome === "strong" ? 1 : outcome === "weak" ? -1 : 0;
      let activeBuffs = currentRun.activeBuffs;
      let activeDebuffs = currentRun.activeDebuffs;

      reward = preparedReward ?? createBattleRoomReward(outcome);

      if (reward.kind === "buff") {
        activeBuffs = addEffectStacks(activeBuffs, reward.effectId);
      } else if (reward.kind === "debuff") {
        activeDebuffs = addEffectStacks(activeDebuffs, reward.effectId);
      }

      return {
        currentRun: {
          ...currentRun,
          activeBuffs,
          activeDebuffs,
          impression,
          resolvedRoomIds: [...currentRun.resolvedRoomIds, currentRoom.id],
        },
      };
    });

    return reward;
  },
  completeHrRoom: (outcome, preparedReward) => {
    let reward: HrRoomReward | null = null;

    set((state) => {
      const currentRun = state.currentRun;
      const currentRoom = currentRun?.currentRoom;

      if (
        !currentRun ||
        !currentRoom ||
        currentRoom.type !== "hr" ||
        currentRun.resolvedRoomIds.includes(currentRoom.id)
      ) {
        return state;
      }

      reward = preparedReward ?? createHrRoomReward(outcome);
      let activeBuffs = currentRun.activeBuffs;
      let activeDebuffs = currentRun.activeDebuffs;

      if (reward.kind === "buff") {
        activeBuffs = addEffectStacks(activeBuffs, reward.effectId);
      } else if (reward.kind === "debuff") {
        activeDebuffs = addEffectStacks(activeDebuffs, reward.effectId);
      }

      return {
        currentRun: {
          ...currentRun,
          activeBuffs,
          activeDebuffs,
          resolvedRoomIds: [...currentRun.resolvedRoomIds, currentRoom.id],
        },
      };
    });

    return reward;
  },
  addEffect: (effectId, stacks = 1) => {
    set((state) => {
      if (!state.currentRun) {
        return state;
      }

      if (getBuffById(effectId as BuffId)) {
        return {
          currentRun: {
            ...state.currentRun,
            activeBuffs: addEffectStacks(
              state.currentRun.activeBuffs,
              effectId as BuffId,
              stacks,
            ),
          },
        };
      }

      return {
        currentRun: {
          ...state.currentRun,
          activeDebuffs: addEffectStacks(
            state.currentRun.activeDebuffs,
            effectId as DebuffId,
            stacks,
          ),
        },
      };
    });
  },
  consumeEffect: (effectId, stacks = 1) => {
    set((state) => {
      if (!state.currentRun) {
        return state;
      }

      if (getBuffById(effectId as BuffId)) {
        return {
          currentRun: {
            ...state.currentRun,
            activeBuffs: consumeEffectStacks(
              state.currentRun.activeBuffs,
              effectId as BuffId,
              stacks,
            ),
          },
        };
      }

      return {
        currentRun: {
          ...state.currentRun,
          activeDebuffs: consumeEffectStacks(
            state.currentRun.activeDebuffs,
            effectId as DebuffId,
            stacks,
          ),
        },
      };
    });
  },
}));
