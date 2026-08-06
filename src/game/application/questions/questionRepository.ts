import { type TechnologyId } from "@/entities/technology";
import { type ChallengeQuestion } from "../../domain/challenge/types";

export interface QuestionRepository {
  getBattleQuestions(
    technologyId: TechnologyId,
  ): Promise<ChallengeQuestion[]>;
  getAllBattleQuestions(): Promise<ChallengeQuestion[]>;
  getHrQuestions(): Promise<ChallengeQuestion[]>;
}
