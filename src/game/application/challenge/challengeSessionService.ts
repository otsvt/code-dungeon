import {
  countCorrectAnswers,
  createBattleRoomReward,
  resolveChallengeOutcome,
} from "../../domain/challenge/rules";
import {
  type ChallengeAnswer,
  type ChallengeQuestion,
} from "../../domain/challenge/types";
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
const FINAL_QUESTION_COUNT_BY_IMPRESSION = {
  [-1]: { min: 25, max: 30 },
  [0]: { min: 20, max: 25 },
  [1]: { min: 15, max: 20 },
} as const;
const HARD_FINAL_FORMATS = new Set([
  "chooseFragment",
  "chooseCode",
  "orderSteps",
]);

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
  const shuffled = shuffleQuestions(questions, random);

  return shuffled.slice(0, Math.min(requestedCount, shuffled.length));
}

function shuffleQuestions<T>(questions: readonly T[], random: () => number): T[] {
  const shuffled = [...questions];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = randomIndex(random, index + 1);
    [shuffled[index], shuffled[swapIndex]] = [
      shuffled[swapIndex],
      shuffled[index],
    ];
  }

  return shuffled;
}

function selectFinalQuestions(
  battleQuestions: readonly ChallengeQuestion[],
  hrQuestions: readonly ChallengeQuestion[],
  impression: -1 | 0 | 1,
  random: () => number,
) {
  const range = FINAL_QUESTION_COUNT_BY_IMPRESSION[impression];
  const questionCount = range.min + randomIndex(random, range.max - range.min + 1);
  const technicalPool = battleQuestions.filter((question) => {
    const isHard = HARD_FINAL_FORMATS.has(question.format);

    return impression === 0 || (impression === -1 ? isHard : !isHard);
  });
  const selectedHrQuestions = shuffleQuestions(hrQuestions, random).slice(
    0,
    Math.min(hrQuestions.length, questionCount),
  );
  const selectedTechnicalQuestions = shuffleQuestions(technicalPool, random).slice(
    0,
    Math.max(0, questionCount - selectedHrQuestions.length),
  );

  return shuffleQuestions(
    [...selectedHrQuestions, ...selectedTechnicalQuestions],
    random,
  );
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

      if (request.kind === "final") {
        const [battleQuestions, hrQuestions] = await Promise.all([
          repository.getAllBattleQuestions(),
          repository.getHrQuestions(),
        ]);

        return {
          ...request,
          questions: selectFinalQuestions(
            battleQuestions,
            hrQuestions,
            request.impression,
            random,
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
      const totalAnswers = challenge.questions.length;

      if (challenge.kind === "battle") {
        const correctAnswers = countCorrectAnswers(
          challenge.questions,
          answers,
          challenge.activeEffectIds.includes("failedStart"),
        );
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

      if (challenge.kind === "final") {
        const correctAnswers = countCorrectAnswers(
          challenge.questions,
          answers,
          challenge.activeEffectIds.includes("failedStart"),
        );

        return {
          kind: "final",
          roomId: challenge.roomId,
          outcome: resolveChallengeOutcome(correctAnswers, totalAnswers),
          reward: { kind: "none", effectId: null },
        };
      }

      const correctAnswers = countCorrectAnswers(
        challenge.questions,
        answers,
      );
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
