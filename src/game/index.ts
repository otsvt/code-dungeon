export { useRunStore } from "./store/useGameRunStore";

export {
  BUFFS,
  HR_BUFFS,
  ALL_BUFFS,
  START_BUFFS,
  getBuffById,
  isBuffId,
  type Buff,
  type BuffId,
} from "./types/buff";
export {
  DEBUFFS,
  HR_DEBUFFS,
  ALL_DEBUFFS,
  getDebuffById,
  isDebuffId,
  type Debuff,
  type DebuffId,
} from "./types/debuff";
export {
  addEffectStacks,
  consumeEffectStacks,
  type ActiveEffect,
  type EffectId,
} from "./types/effect";
export {
  generateNextRoomChoices,
  selectRevealedRoomIds,
  type NextRoomChoice,
  type NextRoomType,
} from "./rooms/nextRoomChoices";
export {
  createHrRoomReward,
  getHrAllowedMistakes,
  resolveHrChallengeOutcome,
  type HrRoomReward,
} from "./domain/room/hrRoom";
export { type CurrentRun, type Impression, type RoomType } from "./types/run";
export {
  countCorrectAnswers,
  createBattleRoomReward,
  resolveChallengeOutcome,
} from "./domain/challenge/rules";
export {
  type BattleRoomReward,
  type ChallengeAnswer,
  type ChallengeLocale,
  type ChallengeOption,
  type ChallengeOutcome,
  type ChallengeQuestion,
} from "./domain/challenge/types";
export {
  type ActiveChallenge,
  type ChallengeRequest,
  type ChallengeResult,
} from "./application/challenge/types";
