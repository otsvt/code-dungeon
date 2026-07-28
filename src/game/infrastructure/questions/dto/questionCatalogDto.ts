export type QuestionKindDto = "battle" | "hr";

export type LocalizedTextDto = {
  ru: string;
  en: string;
};

export type QuestionOptionDto = {
  id: string;
  label: LocalizedTextDto;
};

type BaseQuestionDto = {
  id: string;
  prompt: LocalizedTextDto;
  code: string | null;
  options: QuestionOptionDto[];
  correctOptionId: string;
};

export type BattleQuestionDto = BaseQuestionDto & {
  kind: "battle";
  technologyId: TechnologyId;
};

export type HrQuestionDto = BaseQuestionDto & {
  kind: "hr";
};

export type QuestionDto = BattleQuestionDto | HrQuestionDto;

export type QuestionCatalogDto = {
  version: 1;
  questions: QuestionDto[];
};
import { type TechnologyId } from "@/entities/technology";
