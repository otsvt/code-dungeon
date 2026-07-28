import { type TechnologyId } from "@/entities/technology";
import { BATTLE_QUESTIONS } from "../content/questions/battleQuestions";
import { BUFFS } from "../types/buff";
import { DEBUFFS } from "../types/debuff";
import {
  type BattleRoomReward,
  type ChallengeOutcome,
  type ChallengeQuestion,
} from "./types";

export type {
  BattleRoomReward,
  ChallengeLocale,
  ChallengeOption,
  ChallengeOutcome,
  ChallengeQuestion,
  LocalizedChallengeText,
} from "./types";

export function getChallengeQuestions(
  technologyId: TechnologyId,
  count = 2,
): ChallengeQuestion[] {
  return BATTLE_QUESTIONS
    .filter((question) => question.technologyId === technologyId)
    .slice(0, count)
    .map((question) => ({
      ...question,
      options: question.options.map((option) => ({
        ...option,
        label: { ...option.label },
      })),
      prompt: { ...question.prompt },
    }));
}

export function resolveChallengeOutcome(
  correctAnswers: number,
  totalAnswers: number,
): ChallengeOutcome {
  if (totalAnswers > 0 && correctAnswers === totalAnswers) {
    return "strong";
  }

  if (correctAnswers === 0) {
    return "weak";
  }

  return "neutral";
}

export function createBattleRoomReward(
  outcome: ChallengeOutcome,
  random: () => number = Math.random,
): BattleRoomReward {
  if (outcome === "strong") {
    const buff = BUFFS[Math.floor(random() * BUFFS.length)] ?? BUFFS[0];
    return { kind: "buff", effectId: buff.id };
  }

  if (outcome === "weak") {
    const debuff = DEBUFFS[Math.floor(random() * DEBUFFS.length)] ?? DEBUFFS[0];
    return { kind: "debuff", effectId: debuff.id };
  }

  return { kind: "none", effectId: null };
}
