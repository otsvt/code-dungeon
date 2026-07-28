import { type BuffId } from "../types/buff";
import { type DebuffId } from "../types/debuff";
import { type ActiveEffect, type EffectId } from "../types/effect";

const BASE_ROOM_TIMER_SECONDS = 60;
const TIMER_PENALTY_PER_STACK_SECONDS = 10;
const MIN_ROOM_TIMER_SECONDS = 15;

type EffectContributions = {
  doorRevealBalance: number;
  wrongOptionRemovalBalance: number;
  mistakeShields: number;
  nextRoomDifficultyDelta: number;
  questionSkips: number;
  timerPressure: number;
  extraTechnologyCount: number;
};

export type GameplayModifiers = {
  doorsToReveal: number;
  wrongOptionsToRemove: number;
  mistakeShields: number;
  nextRoomDifficultyDelta: number;
  questionSkips: number;
  roomTimerSeconds: number | null;
  extraTechnologyCount: number;
};

type EffectRule = {
  apply: (contributions: EffectContributions, stacks: number) => void;
};

const EFFECT_RULES: Record<EffectId, EffectRule> = {
  removeWrongOption: {
    apply: (contributions, stacks) => {
      contributions.wrongOptionRemovalBalance += stacks;
    },
  },
  secondChance: {
    apply: (contributions, stacks) => {
      contributions.mistakeShields += stacks;
    },
  },
  doorInsight: {
    apply: (contributions, stacks) => {
      contributions.doorRevealBalance += stacks;
    },
  },
  easierNextRoom: {
    apply: (contributions, stacks) => {
      contributions.nextRoomDifficultyDelta -= stacks;
    },
  },
  skipQuestion: {
    apply: (contributions, stacks) => {
      contributions.questionSkips += stacks;
    },
  },
  goodContact: {
    apply: () => {},
  },
  confidentDelivery: {
    apply: () => {},
  },
  timerPressure: {
    apply: (contributions, stacks) => {
      contributions.timerPressure += stacks;
    },
  },
  hiddenDoorInfo: {
    apply: (contributions, stacks) => {
      contributions.doorRevealBalance -= stacks;
    },
  },
  harderNextRoom: {
    apply: (contributions, stacks) => {
      contributions.nextRoomDifficultyDelta += stacks;
    },
  },
  extraTechnology: {
    apply: (contributions, stacks) => {
      contributions.extraTechnologyCount += stacks;
    },
  },
  fewerHints: {
    apply: (contributions, stacks) => {
      contributions.wrongOptionRemovalBalance -= stacks;
    },
  },
  redFlag: {
    apply: () => {},
  },
  awkwardPause: {
    apply: () => {},
  },
};

function createEmptyContributions(): EffectContributions {
  return {
    doorRevealBalance: 0,
    wrongOptionRemovalBalance: 0,
    mistakeShields: 0,
    nextRoomDifficultyDelta: 0,
    questionSkips: 0,
    timerPressure: 0,
    extraTechnologyCount: 0,
  };
}

export function resolveGameplayEffects(
  activeBuffs: readonly ActiveEffect<BuffId>[],
  activeDebuffs: readonly ActiveEffect<DebuffId>[],
): GameplayModifiers {
  const contributions = createEmptyContributions();
  const activeEffects: readonly ActiveEffect[] = [...activeBuffs, ...activeDebuffs];

  for (const effect of activeEffects) {
    if (effect.stacks <= 0) {
      continue;
    }

    EFFECT_RULES[effect.id].apply(contributions, effect.stacks);
  }

  return {
    doorsToReveal: Math.max(0, contributions.doorRevealBalance),
    wrongOptionsToRemove: Math.max(0, contributions.wrongOptionRemovalBalance),
    mistakeShields: contributions.mistakeShields,
    nextRoomDifficultyDelta: contributions.nextRoomDifficultyDelta,
    questionSkips: contributions.questionSkips,
    roomTimerSeconds:
      contributions.timerPressure > 0
        ? Math.max(
            MIN_ROOM_TIMER_SECONDS,
            BASE_ROOM_TIMER_SECONDS - contributions.timerPressure * TIMER_PENALTY_PER_STACK_SECONDS,
          )
        : null,
    extraTechnologyCount: contributions.extraTechnologyCount,
  };
}
