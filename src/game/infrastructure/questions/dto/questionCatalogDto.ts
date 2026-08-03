import { type TechnologyId } from "@/entities/technology";
import {
  type SingleChoiceQuestionFormat,
} from "../../../domain/challenge/types";

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
  codeLanguage: string | null;
  options: QuestionOptionDto[];
};

type SingleChoiceQuestionDto = BaseQuestionDto & {
  format: SingleChoiceQuestionFormat;
  correctOptionId: string;
};

type OrderStepsQuestionDto = BaseQuestionDto & {
  format: "orderSteps";
  correctOptionIds: string[];
};

export type BattleQuestionDto = (SingleChoiceQuestionDto | OrderStepsQuestionDto) & {
  kind: "battle";
  technologyId: TechnologyId;
};

export type HrQuestionDto = SingleChoiceQuestionDto & {
  kind: "hr";
  format: "quiz";
};

export type QuestionDto = BattleQuestionDto | HrQuestionDto;

export type QuestionCatalogDto = {
  version: 2;
  questions: QuestionDto[];
};
