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

const MIN_BATTLE_QUESTION_COUNT = 5;
const MAX_BATTLE_QUESTION_COUNT = 10;

function randomIndex(random: () => number, upperBound: number): number {
  return Math.floor(Math.min(Math.max(random(), 0), 0.999999999999) * upperBound);
}

function selectRandomBattleQuestions<T>(
  questions: readonly T[],
  random: () => number,
): T[] {
  const requestedCount =
    MIN_BATTLE_QUESTION_COUNT +
    randomIndex(
      random,
      MAX_BATTLE_QUESTION_COUNT - MIN_BATTLE_QUESTION_COUNT + 1,
    );
  const shuffled = [...questions];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(random, index + 1);
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled.slice(0, Math.min(requestedCount, shuffled.length));
}

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
        const questionPool = await repository.getBattleQuestions(
          request.technologyId,
        );

        return {
          ...request,
          questions: selectRandomBattleQuestions(questionPool, random),
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
