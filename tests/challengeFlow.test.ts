import assert from "node:assert/strict";
import test from "node:test";

import {
  createBattleRoomReward,
  getChallengeQuestions,
  resolveChallengeOutcome,
  type CurrentRun,
  type NextRoomChoice,
  useRunStore,
} from "../src/game";

test("испытание выбирает вопросы только для технологии комнаты", () => {
  const questions = getChallengeQuestions("typescript", 2);

  assert.equal(questions.length, 2);
  assert.ok(questions.every((question) => question.technologyId === "typescript"));
  assert.ok(questions[1].prompt.ru.length > questions[0].prompt.ru.length);
  assert.ok(
    questions[1].options.every(
      (option) => option.label.ru.length > questions[0].options[0].label.ru.length,
    ),
  );
});

test("результат зависит от количества правильных ответов", () => {
  assert.equal(resolveChallengeOutcome(2, 2), "strong");
  assert.equal(resolveChallengeOutcome(1, 2), "neutral");
  assert.equal(resolveChallengeOutcome(0, 2), "weak");
});

test("награда соответствует исходу комнаты", () => {
  assert.equal(createBattleRoomReward("strong", () => 0).kind, "buff");
  assert.equal(createBattleRoomReward("neutral", () => 0).kind, "none");
  assert.equal(createBattleRoomReward("weak", () => 0).kind, "debuff");
});

test("одна battle-комната применяет результат только один раз", () => {
  const currentRoom: NextRoomChoice = {
    id: "battle-room",
    type: "battle",
    technologyId: "javascript",
  };
  const currentRun: CurrentRun = {
    id: "challenge-run",
    settings: {
      poolModeId: "frontend",
      technologyIds: ["javascript", "typescript", "react"],
    },
    currentRoom,
    nextRoomChoices: [],
    roomNumber: 1,
    totalRooms: 5,
    lives: { current: 1, max: 1 },
    activeBuffs: [],
    activeDebuffs: [],
    resolvedRoomIds: [],
    startBuffGranted: true,
    impression: 0,
    status: "started",
  };

  useRunStore.setState({ currentRun, pendingStartBuff: null });

  const first = useRunStore
    .getState()
    .completeBattleRoom("strong", { kind: "buff", effectId: "doorInsight" });
  const second = useRunStore
    .getState()
    .completeBattleRoom("weak", { kind: "debuff", effectId: "timerPressure" });
  const resolvedRun = useRunStore.getState().currentRun;

  assert.deepEqual(first, { kind: "buff", effectId: "doorInsight" });
  assert.equal(second, null);
  assert.equal(resolvedRun?.activeBuffs[0]?.stacks, 1);
  assert.equal(resolvedRun?.activeDebuffs.length, 0);
  assert.equal(resolvedRun?.impression, 1);
  assert.deepEqual(resolvedRun?.resolvedRoomIds, ["battle-room"]);

  useRunStore.getState().resetRun();
});
