import assert from "node:assert/strict";
import test from "node:test";

import {
  createHrRoomReward,
  getHrAllowedMistakes,
  resolveHrChallengeOutcome,
  type CurrentRun,
  type HrRoomReward,
  type Impression,
  useRunStore,
} from "../src/game";
import { LocalQuestionRepository } from "../src/game/infrastructure/questions/localQuestionRepository";

function createHrRun(impression: Impression): CurrentRun {
  return {
    id: `hr-run-${impression}`,
    settings: {
      poolModeId: "frontend",
      technologyIds: ["html"],
    },
    currentRoom: {
      id: "hr-room",
      type: "hr",
    },
    nextRoomChoices: [
      {
        id: "next-battle",
        type: "battle",
        technologyId: "html",
      },
    ],
    roomNumber: 2,
    totalRooms: 5,
    lives: {
      current: 1,
      max: 1,
    },
    activeEffects: [],
    resolvedRoomIds: [],
    startBuffGranted: true,
    impression,
    status: "started",
  };
}

test("Впечатление задаёт допустимое число ошибок в HR-интервью", () => {
  assert.equal(getHrAllowedMistakes(-1), 0);
  assert.equal(getHrAllowedMistakes(0), 1);
  assert.equal(getHrAllowedMistakes(1), 2);

  assert.equal(resolveHrChallengeOutcome(3, 3, -1), "strong");
  assert.equal(resolveHrChallengeOutcome(2, 3, -1), "weak");
  assert.equal(resolveHrChallengeOutcome(2, 3, 0), "strong");
  assert.equal(resolveHrChallengeOutcome(1, 3, 0), "weak");
  assert.equal(resolveHrChallengeOutcome(1, 3, 1), "strong");
  assert.equal(resolveHrChallengeOutcome(0, 3, 1), "weak");
});

test("HR-интервью содержит три отдельных ситуационных вопроса", async () => {
  const repository = new LocalQuestionRepository();
  const questions = await repository.getHrQuestions();

  assert.equal(questions.length, 3);
  assert.ok(questions.every((question) => question.technologyId === undefined));
});

test("HR-награда зависит от результата интервью, а не выдаётся автоматически", () => {
  assert.deepEqual(createHrRoomReward("strong", () => 0), {
    kind: "buff",
    effectId: "goodContact",
  });
  assert.deepEqual(createHrRoomReward("weak", () => 0.999), {
    kind: "debuff",
    effectId: "awkwardPause",
  });
});

test("HR-комната применяет награду только один раз", () => {
  const reward: HrRoomReward = {
    kind: "buff",
    effectId: "confidentDelivery",
  };

  useRunStore.setState({
    currentRun: createHrRun(1),
    pendingStartBuff: null,
  });

  const result = {
    kind: "hr" as const,
    roomId: "hr-room",
    outcome: "strong" as const,
    reward,
  };
  const firstResult = useRunStore.getState().completeChallengeRoom(result);
  const secondResult = useRunStore.getState().completeChallengeRoom(result);
  const currentRun = useRunStore.getState().currentRun;

  assert.deepEqual(firstResult, reward);
  assert.equal(secondResult, null);
  assert.deepEqual(currentRun?.activeEffects, [
    { id: "confidentDelivery", stacks: 1 },
  ]);
  assert.deepEqual(currentRun?.resolvedRoomIds, ["hr-room"]);

  useRunStore.getState().resetRun();
});
