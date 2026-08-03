import { type TechnologyId } from "@/entities/technology";
import { type BuffId } from "../../types/buff";
import { type DebuffId } from "../../types/debuff";

export type ChallengeLocale = "ru" | "en";

export type LocalizedChallengeText = Record<ChallengeLocale, string>;

export const BATTLE_QUESTION_FORMATS = [
  "quiz",
  "trueFalse",
  "codeOutput",
  "findBug",
  "chooseFragment",
  "chooseCode",
  "orderSteps",
] as const;

export type BattleQuestionFormat = (typeof BATTLE_QUESTION_FORMATS)[number];
export type SingleChoiceQuestionFormat = Exclude<BattleQuestionFormat, "orderSteps">;

export type ChallengeOption = {
  id: string;
  label: LocalizedChallengeText;
  code?: string;
};

type BaseChallengeQuestion = {
  id: string;
  technologyId?: TechnologyId;
  prompt: LocalizedChallengeText;
  code?: string;
  codeLanguage?: string;
  options: readonly ChallengeOption[];
};

export type SingleChoiceChallengeQuestion = BaseChallengeQuestion & {
  format: SingleChoiceQuestionFormat;
  correctOptionId: string;
};

export type OrderStepsChallengeQuestion = BaseChallengeQuestion & {
  format: "orderSteps";
  correctOptionIds: readonly string[];
};

export type ChallengeQuestion = SingleChoiceChallengeQuestion | OrderStepsChallengeQuestion;

export type SingleChoiceChallengeAnswer = {
  questionId: string;
  format: SingleChoiceQuestionFormat;
  optionId: string;
};

export type OrderStepsChallengeAnswer = {
  questionId: string;
  format: "orderSteps";
  optionIds: readonly string[];
};

export type ChallengeAnswer = SingleChoiceChallengeAnswer | OrderStepsChallengeAnswer;

export type ChallengeOutcome = "strong" | "neutral" | "weak";

export type BattleRoomReward =
  | { kind: "buff"; effectId: BuffId }
  | { kind: "debuff"; effectId: DebuffId }
  | { kind: "none"; effectId: null };
