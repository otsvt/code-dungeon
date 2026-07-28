import { createChallengeSessionService } from "./application/challenge/challengeSessionService";
import { LocalQuestionRepository } from "./infrastructure/questions/localQuestionRepository";

const questionRepository = new LocalQuestionRepository();

export const challengeSessionService =
  createChallengeSessionService(questionRepository);
