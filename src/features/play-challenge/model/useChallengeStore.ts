"use client";

import { create } from "zustand";
import { challengeSessionService } from "@/game/compositionRoot";
import {
  type ActiveChallenge,
  type ChallengeRequest,
  type ChallengeResult,
} from "@/game/application/challenge/types";
import { type ChallengeAnswer } from "@/game/domain/challenge/types";

type ChallengeStore = {
  activeChallenge: ActiveChallenge | null;
  challengeResult: ChallengeResult | null;
  isChallengeLoading: boolean;
  challengeError: string | null;
  openChallenge: (request: ChallengeRequest) => Promise<void>;
  completeChallenge: (answers: readonly ChallengeAnswer[]) => void;
  clearChallengeResult: () => void;
  resetChallenge: () => void;
};

let latestRequestId = 0;

export const useChallengeStore = create<ChallengeStore>((set) => ({
  activeChallenge: null,
  challengeResult: null,
  isChallengeLoading: false,
  challengeError: null,
  openChallenge: async (request) => {
    const requestId = ++latestRequestId;

    set({
      activeChallenge: null,
      challengeResult: null,
      isChallengeLoading: true,
      challengeError: null,
    });

    try {
      const activeChallenge = await challengeSessionService.start(request);

      if (requestId !== latestRequestId) {
        return;
      }

      set({
        activeChallenge,
        isChallengeLoading: false,
      });
    } catch (error) {
      if (requestId === latestRequestId) {
        set({
          isChallengeLoading: false,
          challengeError:
            error instanceof Error
              ? error.message
              : "Failed to load challenge",
        });
      }

      throw error;
    }
  },
  completeChallenge: (answers) =>
    set((state) => {
      if (!state.activeChallenge) {
        return state;
      }

      return {
        activeChallenge: null,
        challengeResult: challengeSessionService.complete(
          state.activeChallenge,
          answers,
        ),
      };
    }),
  clearChallengeResult: () => set({ challengeResult: null }),
  resetChallenge: () => {
    latestRequestId += 1;
    set({
      activeChallenge: null,
      challengeResult: null,
      isChallengeLoading: false,
      challengeError: null,
    });
  },
}));
