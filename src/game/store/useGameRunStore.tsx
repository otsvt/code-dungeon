"use client";

import { create } from "zustand";
import {
  addRunEffect,
  advanceRunToRoom,
  applyChallengeResult,
  consumeRunEffect,
  createRun,
  grantStartBuff,
  selectStartBuff,
} from "../application/run/runLifecycle";
import { type RunSettings } from "../domain/run/runSettings";
import {
  type ChallengeResult,
} from "../application/challenge/types";
import { type NextRoomChoice } from "../rooms/nextRoomChoices";
import { type Buff } from "../types/buff";
import { type EffectId } from "../types/effect";
import { type CurrentRun } from "../types/run";

type ChallengeReward = ChallengeResult["reward"];

type RunStore = {
  currentRun: CurrentRun | null;
  pendingStartBuff: Buff | null;
  startRun: (settings: RunSettings) => void;
  resetRun: () => void;
  prepareStartBuff: () => Buff | null;
  completeStartBuffGrant: () => void;
  advanceToRoom: (choice: NextRoomChoice) => boolean;
  completeChallengeRoom: (result: ChallengeResult) => ChallengeReward | null;
  addEffect: (effectId: EffectId, stacks?: number) => void;
  consumeEffect: (effectId: EffectId, stacks?: number) => void;
};

export const useRunStore = create<RunStore>((set) => ({
  currentRun: null,
  pendingStartBuff: null,
  startRun: (settings) =>
    set({
      pendingStartBuff: null,
      currentRun: createRun(settings),
    }),
  resetRun: () =>
    set({
      currentRun: null,
      pendingStartBuff: null,
    }),
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

      preparedBuff = selectStartBuff();

      return {
        pendingStartBuff: preparedBuff,
      };
    });

    return preparedBuff;
  },
  completeStartBuffGrant: () =>
    set((state) => {
      if (!state.currentRun || !state.pendingStartBuff) {
        return state;
      }

      const currentRun = grantStartBuff(
        state.currentRun,
        state.pendingStartBuff,
      );

      if (!currentRun) {
        return state;
      }

      return {
        currentRun,
        pendingStartBuff: null,
      };
    }),
  advanceToRoom: (choice) => {
    let didAdvance = false;

    set((state) => {
      if (!state.currentRun) {
        return state;
      }

      const currentRun = advanceRunToRoom(state.currentRun, choice);

      if (!currentRun) {
        return state;
      }

      didAdvance = true;

      return {
        currentRun,
      };
    });

    return didAdvance;
  },
  completeChallengeRoom: (result) => {
    let appliedReward: ChallengeReward | null = null;

    set((state) => {
      if (!state.currentRun) {
        return state;
      }

      const currentRun = applyChallengeResult(state.currentRun, result);

      if (!currentRun) {
        return state;
      }

      appliedReward = result.reward;

      return {
        currentRun,
      };
    });

    return appliedReward;
  },
  addEffect: (effectId, stacks = 1) =>
    set((state) =>
      state.currentRun
        ? { currentRun: addRunEffect(state.currentRun, effectId, stacks) }
        : state,
    ),
  consumeEffect: (effectId, stacks = 1) =>
    set((state) =>
      state.currentRun
        ? { currentRun: consumeRunEffect(state.currentRun, effectId, stacks) }
        : state,
    ),
}));
