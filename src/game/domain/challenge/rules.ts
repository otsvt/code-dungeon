import { BUFFS } from "../../types/buff";
import { DEBUFFS } from "../../types/debuff";
import {
  type BattleRoomReward,
  type ChallengeAnswer,
  type ChallengeOutcome,
  type ChallengeQuestion,
} from "./types";

export function countCorrectAnswers(
  questions: readonly ChallengeQuestion[],
  answers: readonly ChallengeAnswer[],
): number {
  const answersByQuestionId = new Map(
    answers.map((answer) => [answer.questionId, answer.optionId]),
  );

  return questions.reduce(
    (total, question) =>
      total +
      Number(
        answersByQuestionId.get(question.id) === question.correctOptionId,
      ),
    0,
  );
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
