import { BUFFS } from "../../types/buff";
import { DEBUFFS } from "../../types/debuff";
import { type EffectId } from "../../types/effect";
import {
  type BattleRoomReward,
  type ChallengeAnswer,
  type ChallengeOutcome,
  type ChallengeQuestion,
} from "./types";

export function countCorrectAnswers(
  questions: readonly ChallengeQuestion[],
  answers: readonly ChallengeAnswer[],
  firstAnswerAlwaysIncorrect = false,
): number {
  const answersByQuestionId = new Map(
    answers.map((answer) => [answer.questionId, answer]),
  );

  return questions.reduce(
    (total, question, questionIndex) =>
      total +
      Number(
        !(firstAnswerAlwaysIncorrect && questionIndex === 0) &&
          isCorrectAnswer(question, answersByQuestionId.get(question.id)),
      ),
    0,
  );
}

function isCorrectAnswer(
  question: ChallengeQuestion,
  answer: ChallengeAnswer | undefined,
): boolean {
  if (!answer || answer.format !== question.format) {
    return false;
  }

  if (question.format === "orderSteps") {
    return (
      answer.format === "orderSteps" &&
      answer.optionIds.length === question.correctOptionIds.length &&
      answer.optionIds.every(
        (optionId, index) => optionId === question.correctOptionIds[index],
      )
    );
  }

  return answer.format !== "orderSteps" && answer.optionId === question.correctOptionId;
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
  activeEffectIds: readonly EffectId[] = [],
  random: () => number = Math.random,
): BattleRoomReward {
  const activeEffectIdSet = new Set(activeEffectIds);

  if (outcome === "strong") {
    if (activeEffectIdSet.has("buffBan")) {
      return { kind: "none", effectId: null };
    }

    const availableBuffs = BUFFS.filter(
      (buff) => !activeEffectIdSet.has(buff.id),
    );
    const buff =
      availableBuffs[Math.floor(random() * availableBuffs.length)];

    if (!buff) {
      return { kind: "none", effectId: null };
    }

    return { kind: "buff", effectId: buff.id };
  }

  if (outcome === "weak") {
    if (activeEffectIdSet.has("debuffImmunity")) {
      return { kind: "none", effectId: null };
    }

    const availableDebuffs = DEBUFFS.filter(
      (debuff) => !activeEffectIdSet.has(debuff.id),
    );
    const debuff =
      availableDebuffs[Math.floor(random() * availableDebuffs.length)];

    if (!debuff) {
      return { kind: "none", effectId: null };
    }

    return { kind: "debuff", effectId: debuff.id };
  }

  return { kind: "none", effectId: null };
}
