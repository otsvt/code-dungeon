import {
  countCorrectAnswers,
  createBattleRoomReward,
  resolveChallengeOutcome,
} from "../../domain/challenge/rules";
import { type ChallengeAnswer } from "../../domain/challenge/types";
import {
  createHrRoomReward,
  getHrAllowedMistakes,
  resolveHrChallengeOutcome,
} from "../../domain/room/hrRoom";
import { type QuestionRepository } from "../questions/questionRepository";
import {
  type ActiveChallenge,
  type ChallengeRequest,
  type ChallengeResult,
} from "./types";

const DEFAULT_BATTLE_QUESTION_COUNT = 6;

export type ChallengeSessionService = {
  start(request: ChallengeRequest): Promise<ActiveChallenge>;
  complete(
    challenge: ActiveChallenge,
    answers: readonly ChallengeAnswer[],
  ): ChallengeResult;
};

export function createChallengeSessionService(
  repository: QuestionRepository,
  random: () => number = Math.random,
): ChallengeSessionService {
  return {
    async start(request) {
      if (request.kind === "battle") {
        return {
          ...request,
          questions: await repository.getBattleQuestions(
            request.technologyId,
            DEFAULT_BATTLE_QUESTION_COUNT,
          ),
        };
      }

      return {
        ...request,
        allowedMistakes: getHrAllowedMistakes(request.impression),
        questions: await repository.getHrQuestions(),
      };
    },
    complete(challenge, answers) {
      const correctAnswers = countCorrectAnswers(
        challenge.questions,
        answers,
      );
      const totalAnswers = challenge.questions.length;

      if (challenge.kind === "battle") {
        const outcome = resolveChallengeOutcome(
          correctAnswers,
          totalAnswers,
        );

        return {
          kind: "battle",
          roomId: challenge.roomId,
          outcome,
          reward: createBattleRoomReward(
            outcome,
            challenge.activeEffectIds,
            random,
          ),
        };
      }

      const outcome = resolveHrChallengeOutcome(
        correctAnswers,
        totalAnswers,
        challenge.impression,
      );

      return {
        kind: "hr",
        roomId: challenge.roomId,
        outcome,
        reward: createHrRoomReward(
          outcome,
          challenge.activeEffectIds,
          random,
        ),
      };
    },
  };
}
