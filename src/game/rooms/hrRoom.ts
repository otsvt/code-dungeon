import { HR_QUESTIONS } from "../content/questions/hrQuestions";
import { type ChallengeOutcome, type ChallengeQuestion } from "../challenges/types";
import { HR_BUFFS } from "../types/buff";
import { HR_DEBUFFS } from "../types/debuff";
import { type Impression } from "../types/run";

export type HrRoomReward =
  | { kind: "buff"; effectId: (typeof HR_BUFFS)[number]["id"] }
  | { kind: "debuff"; effectId: (typeof HR_DEBUFFS)[number]["id"] };

export function createHrRoomReward(
  outcome: ChallengeOutcome,
  random = Math.random,
): HrRoomReward {
  if (outcome === "strong") {
    const buff = HR_BUFFS[Math.floor(random() * HR_BUFFS.length)] ?? HR_BUFFS[0];

    return {
      kind: "buff",
      effectId: buff.id,
    };
  }

  const debuff = HR_DEBUFFS[Math.floor(random() * HR_DEBUFFS.length)] ?? HR_DEBUFFS[0];

  return {
    kind: "debuff",
    effectId: debuff.id,
  };
}

export function getHrChallengeQuestions(): ChallengeQuestion[] {
  return HR_QUESTIONS.map((question) => ({
    ...question,
    options: question.options.map((option) => ({
      ...option,
      label: { ...option.label },
    })),
    prompt: { ...question.prompt },
  }));
}

export function getHrAllowedMistakes(impression: Impression): number {
  return impression + 1;
}

export function resolveHrChallengeOutcome(
  correctAnswers: number,
  totalAnswers: number,
  impression: Impression,
): ChallengeOutcome {
  const mistakes = Math.max(0, totalAnswers - correctAnswers);

  return mistakes <= getHrAllowedMistakes(impression) ? "strong" : "weak";
}
