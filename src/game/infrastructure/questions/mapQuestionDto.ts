import { type ChallengeQuestion } from "../../domain/challenge/types";
import { type QuestionDto } from "./dto/questionCatalogDto";

export function mapQuestionDto(question: QuestionDto): ChallengeQuestion {
  const base = {
    id: question.id,
    ...(question.kind === "battle"
      ? { technologyId: question.technologyId }
      : {}),
    prompt: { ...question.prompt },
    ...(question.code === null ? {} : { code: question.code }),
    ...(question.codeLanguage === null
      ? {}
      : { codeLanguage: question.codeLanguage }),
    options: question.options.map((option) => ({
      id: option.id,
      label: { ...option.label },
      ...(option.code === null ? {} : { code: option.code }),
    })),
  };

  if (question.format === "orderSteps") {
    return {
      ...base,
      format: "orderSteps",
      correctOptionIds: [...question.correctOptionIds],
    };
  }

  return {
    ...base,
    format: question.format,
    correctOptionId: question.correctOptionId,
  };
}
