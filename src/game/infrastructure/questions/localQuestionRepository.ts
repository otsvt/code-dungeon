import { type TechnologyId } from "@/entities/technology";
import { type ChallengeQuestion } from "../../domain/challenge/types";
import { type QuestionRepository } from "../../application/questions/questionRepository";
import {
  getLocalBattleQuestions,
  getLocalHrQuestions,
} from "./localQuestionCatalog";

function cloneQuestion(question: ChallengeQuestion): ChallengeQuestion {
  const base = {
    ...question,
    prompt: { ...question.prompt },
    options: question.options.map((option) => ({
      ...option,
      label: { ...option.label },
    })),
  };

  return question.format === "orderSteps"
    ? { ...base, format: "orderSteps", correctOptionIds: [...question.correctOptionIds] }
    : { ...base, format: question.format, correctOptionId: question.correctOptionId };
}

export class LocalQuestionRepository implements QuestionRepository {
  async getBattleQuestions(
    technologyId: TechnologyId,
  ): Promise<ChallengeQuestion[]> {
    return getLocalBattleQuestions()
      .filter((question) => question.technologyId === technologyId)
      .map(cloneQuestion);
  }

  async getAllBattleQuestions(): Promise<ChallengeQuestion[]> {
    return getLocalBattleQuestions().map(cloneQuestion);
  }

  async getHrQuestions(): Promise<ChallengeQuestion[]> {
    return getLocalHrQuestions().map(cloneQuestion);
  }
}
