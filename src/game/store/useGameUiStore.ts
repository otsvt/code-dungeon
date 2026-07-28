"use client";

import { create } from "zustand";
import { type TechnologyId } from "@/entities/technology";
import {
  getChallengeQuestions,
  type ChallengeOutcome,
  type ChallengeQuestion,
} from "../challenges/challenge";
import {
  getHrAllowedMistakes,
  getHrChallengeQuestions,
} from "../rooms/hrRoom";
import { type Impression } from "../types/run";

export type PauseConfirmation = "restart" | "exit";

export type ActiveChallenge =
  | {
      kind: "battle";
      roomId: string;
      technologyId: TechnologyId;
      questions: ChallengeQuestion[];
    }
  | {
      kind: "hr";
      roomId: string;
      impression: Impression;
      allowedMistakes: number;
      questions: ChallengeQuestion[];
    };

export type ChallengeResult = {
  roomId: string;
  outcome: ChallengeOutcome;
};

type GameUiStore = {
  isPaused: boolean;
  confirmation: PauseConfirmation | null;
  activeChallenge: ActiveChallenge | null;
  challengeResult: ChallengeResult | null;
  pauseGame: () => void;
  resumeGame: () => void;
  togglePause: () => void;
  openConfirmation: (confirmation: PauseConfirmation) => void;
  closeConfirmation: () => void;
  openChallenge: (roomId: string, technologyId: TechnologyId) => void;
  openHrChallenge: (roomId: string, impression: Impression) => void;
  completeChallenge: (outcome: ChallengeOutcome) => void;
  clearChallengeResult: () => void;
  resetChallenge: () => void;
};

export const useGameUiStore = create<GameUiStore>((set) => ({
  isPaused: false,
  confirmation: null,
  activeChallenge: null,
  challengeResult: null,
  pauseGame: () => set({ isPaused: true, confirmation: null }),
  resumeGame: () => set({ isPaused: false, confirmation: null }),
  togglePause: () => set((state) => ({ isPaused: !state.isPaused, confirmation: null })),
  openConfirmation: (confirmation) => set({ confirmation }),
  closeConfirmation: () => set({ confirmation: null }),
  openChallenge: (roomId, technologyId) =>
    set({
      activeChallenge: {
        kind: "battle",
        roomId,
        technologyId,
        questions: getChallengeQuestions(technologyId),
      },
      challengeResult: null,
      isPaused: false,
      confirmation: null,
    }),
  openHrChallenge: (roomId, impression) =>
    set({
      activeChallenge: {
        kind: "hr",
        roomId,
        impression,
        allowedMistakes: getHrAllowedMistakes(impression),
        questions: getHrChallengeQuestions(),
      },
      challengeResult: null,
      isPaused: false,
      confirmation: null,
    }),
  completeChallenge: (outcome) =>
    set((state) => {
      if (!state.activeChallenge) {
        return state;
      }

      return {
        activeChallenge: null,
        challengeResult: {
          roomId: state.activeChallenge.roomId,
          outcome,
        },
      };
    }),
  clearChallengeResult: () => set({ challengeResult: null }),
  resetChallenge: () => set({ activeChallenge: null, challengeResult: null }),
}));
