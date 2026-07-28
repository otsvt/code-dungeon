import assert from "node:assert/strict";
import test from "node:test";

import { createChallengeSessionService } from "../src/game/application/challenge/challengeSessionService";
import { type QuestionRepository } from "../src/game/application/questions/questionRepository";
import { type ChallengeQuestion } from "../src/game/domain/challenge/types";

const questions: ChallengeQuestion[] = [
  {
    id: "question-1",
    technologyId: "html",
    prompt: { ru: "Вопрос 1", en: "Question 1" },
    options: [
      { id: "a", label: { ru: "A", en: "A" } },
      { id: "b", label: { ru: "B", en: "B" } },
    ],
    correctOptionId: "a",
  },
  {
    id: "question-2",
    technologyId: "html",
    prompt: { ru: "Вопрос 2", en: "Question 2" },
    options: [
      { id: "a", label: { ru: "A", en: "A" } },
      { id: "b", label: { ru: "B", en: "B" } },
    ],
    correctOptionId: "b",
  },
];

class StubQuestionRepository implements QuestionRepository {
  async getBattleQuestions() {
    return questions;
  }

  async getHrQuestions() {
    return questions.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      ...(question.code ? { code: question.code } : {}),
      options: question.options,
      correctOptionId: question.correctOptionId,
    }));
  }
}

test("challenge service зависит от порта, а не от JSON-реализации", async () => {
  const service = createChallengeSessionService(
    new StubQuestionRepository(),
    () => 0,
  );
  const challenge = await service.start({
    kind: "battle",
    roomId: "room-1",
    technologyId: "html",
  });
  const result = service.complete(challenge, [
    { questionId: "question-1", optionId: "a" },
    { questionId: "question-2", optionId: "b" },
  ]);

  assert.equal(challenge.questions.length, 2);
  assert.deepEqual(result, {
    kind: "battle",
    roomId: "room-1",
    outcome: "strong",
    reward: {
      kind: "buff",
      effectId: "noiseSuppression",
    },
  });
});

test("application service сам считает HR outcome по выбранным ответам", async () => {
  const service = createChallengeSessionService(
    new StubQuestionRepository(),
    () => 0,
  );
  const challenge = await service.start({
    kind: "hr",
    roomId: "hr-room",
    impression: -1,
  });
  const result = service.complete(challenge, [
    { questionId: "question-1", optionId: "a" },
    { questionId: "question-2", optionId: "a" },
  ]);

  assert.equal(challenge.kind, "hr");
  assert.equal(challenge.allowedMistakes, 0);
  assert.equal(result.outcome, "weak");
  assert.equal(result.reward.kind, "debuff");
});
