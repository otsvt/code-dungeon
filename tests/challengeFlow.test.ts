import assert from "node:assert/strict";
import test from "node:test";

import {
  createBattleRoomReward,
  HR_BUFFS,
  HR_DEBUFFS,
  resolveChallengeOutcome,
  type CurrentRun,
  type NextRoomChoice,
  useRunStore,
} from "../src/game";
import { LocalQuestionRepository } from "../src/game/infrastructure/questions/localQuestionRepository";

test("испытание выбирает вопросы только для технологии комнаты", async () => {
  const repository = new LocalQuestionRepository();
  const questions = await repository.getBattleQuestions("typescript", 2);

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

test("обычная Battle Room никогда не выдаёт HR-эффекты", () => {
  const hrEffectIds = new Set<string>([
    ...HR_BUFFS.map((buff) => buff.id),
    ...HR_DEBUFFS.map((debuff) => debuff.id),
  ]);

  for (const randomValue of [0, 0.25, 0.5, 0.75, 0.999]) {
    const buffReward = createBattleRoomReward("strong", () => randomValue);
    const debuffReward = createBattleRoomReward("weak", () => randomValue);

    assert.equal(buffReward.kind, "buff");
    assert.equal(debuffReward.kind, "debuff");
    assert.equal(hrEffectIds.has(buffReward.effectId), false);
    assert.equal(hrEffectIds.has(debuffReward.effectId), false);
  }
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
    activeEffects: [],
    resolvedRoomIds: [],
    hrRoomOffered: false,
    startBuffGranted: true,
    impression: 0,
    status: "started",
  };

  useRunStore.setState({ currentRun, pendingStartBuff: null });

  const first = useRunStore
    .getState()
    .completeChallengeRoom({
      kind: "battle",
      roomId: "battle-room",
      outcome: "strong",
      reward: { kind: "buff", effectId: "stackNavigator" },
    });
  const second = useRunStore
    .getState()
    .completeChallengeRoom({
      kind: "battle",
      roomId: "battle-room",
      outcome: "weak",
      reward: { kind: "debuff", effectId: "routeSubstitution" },
    });
  const resolvedRun = useRunStore.getState().currentRun;

  assert.deepEqual(first, { kind: "buff", effectId: "stackNavigator" });
  assert.equal(second, null);
  assert.deepEqual(resolvedRun?.activeEffects, [
    { id: "stackNavigator", stacks: 1 },
  ]);
  assert.equal(resolvedRun?.impression, 1);
  assert.deepEqual(resolvedRun?.resolvedRoomIds, ["battle-room"]);

  useRunStore.getState().resetRun();
});
