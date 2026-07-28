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
  activeEffectIds: readonly EffectId[] = [],
  random: () => number = Math.random,
): BattleRoomReward {
  const activeEffectIdSet = new Set(activeEffectIds);

  if (outcome === "strong") {
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
