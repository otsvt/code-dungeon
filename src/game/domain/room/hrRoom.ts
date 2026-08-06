import { type ChallengeOutcome } from "../challenge/types";
import { HR_BUFFS } from "../../types/buff";
import { HR_DEBUFFS } from "../../types/debuff";
import { type EffectId } from "../../types/effect";
import { type Impression } from "../../types/run";

export type HrRoomReward =
  | { kind: "buff"; effectId: (typeof HR_BUFFS)[number]["id"] }
  | { kind: "debuff"; effectId: (typeof HR_DEBUFFS)[number]["id"] }
  | { kind: "none"; effectId: null };

export function createHrRoomReward(
  outcome: ChallengeOutcome,
  activeEffectIds: readonly EffectId[] = [],
  random: () => number = Math.random,
): HrRoomReward {
  const activeEffectIdSet = new Set(activeEffectIds);

  if (outcome === "strong") {
    if (activeEffectIdSet.has("buffBan")) {
      return { kind: "none", effectId: null };
    }

    const availableBuffs = HR_BUFFS.filter(
      (buff) => !activeEffectIdSet.has(buff.id),
    );
    const buff =
      availableBuffs[Math.floor(random() * availableBuffs.length)];

    return buff
      ? { kind: "buff", effectId: buff.id }
      : { kind: "none", effectId: null };
  }

  if (activeEffectIdSet.has("debuffImmunity")) {
    return { kind: "none", effectId: null };
  }

  const availableDebuffs = HR_DEBUFFS.filter(
    (debuff) => !activeEffectIdSet.has(debuff.id),
  );
  const debuff =
    availableDebuffs[Math.floor(random() * availableDebuffs.length)];

  return debuff
    ? { kind: "debuff", effectId: debuff.id }
    : { kind: "none", effectId: null };
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
