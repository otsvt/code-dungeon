import { type TechnologyId } from "@/entities/technology";
import { type BuffId } from "../types/buff";
import { type DebuffId } from "../types/debuff";

export type ChallengeLocale = "ru" | "en";

export type LocalizedChallengeText = Record<ChallengeLocale, string>;

export type ChallengeOption = {
  id: string;
  label: LocalizedChallengeText;
};

export type ChallengeQuestion = {
  id: string;
  technologyId?: TechnologyId;
  prompt: LocalizedChallengeText;
  code?: string;
  options: readonly ChallengeOption[];
  correctOptionId: string;
};

export type ChallengeOutcome = "strong" | "neutral" | "weak";

export type BattleRoomReward =
  | { kind: "buff"; effectId: BuffId }
  | { kind: "debuff"; effectId: DebuffId }
  | { kind: "none"; effectId: null };
