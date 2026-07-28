import { type TechnologyId } from "@/entities/technology";
import { type ChallengeQuestion } from "../../domain/challenge/types";
import { type QuestionRepository } from "../../application/questions/questionRepository";
import {
  getLocalBattleQuestions,
  getLocalHrQuestions,
} from "./localQuestionCatalog";

function cloneQuestion(question: ChallengeQuestion): ChallengeQuestion {
  return {
    ...question,
    prompt: { ...question.prompt },
    options: question.options.map((option) => ({
      ...option,
      label: { ...option.label },
    })),
  };
}

export class LocalQuestionRepository implements QuestionRepository {
  async getBattleQuestions(
    technologyId: TechnologyId,
    count: number,
  ): Promise<ChallengeQuestion[]> {
    return getLocalBattleQuestions()
      .filter((question) => question.technologyId === technologyId)
      .slice(0, count)
      .map(cloneQuestion);
  }

  async getHrQuestions(): Promise<ChallengeQuestion[]> {
    return getLocalHrQuestions().map(cloneQuestion);
  }
}
