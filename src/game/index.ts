export { useRunStore } from "./store/useGameRunStore";
export {
  useGameUiStore,
  type ActiveChallenge,
  type ChallengeResult,
  type PauseConfirmation,
} from "./store/useGameUiStore";

export { BUFFS, START_BUFFS, getBuffById, type Buff, type BuffId } from "./types/buff";
export { DEBUFFS, getDebuffById, type Debuff, type DebuffId } from "./types/debuff";
export {
  addEffectStacks,
  consumeEffectStacks,
  type ActiveEffect,
  type EffectId,
} from "./types/effect";
export {
  resolveGameplayEffects,
  type GameplayModifiers,
} from "./effects/resolveGameplayEffects";
export {
  generateNextRoomChoices,
  selectRevealedRoomIds,
  type NextRoomChoice,
  type NextRoomType,
} from "./rooms/nextRoomChoices";
export { type CurrentRun, type Impression, type RoomType } from "./types/run";
export {
  createBattleRoomReward,
  getChallengeQuestions,
  resolveChallengeOutcome,
  type BattleRoomReward,
  type ChallengeLocale,
  type ChallengeOption,
  type ChallengeOutcome,
  type ChallengeQuestion,
} from "./challenges/challenge";
