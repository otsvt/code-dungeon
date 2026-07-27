import assert from "node:assert/strict";
import test from "node:test";

import {
  addEffectStacks,
  consumeEffectStacks,
  resolveGameplayEffects,
  type ActiveEffect,
  type BuffId,
  type DebuffId,
} from "../src/game";

const noBuffs: ActiveEffect<BuffId>[] = [];
const noDebuffs: ActiveEffect<DebuffId>[] = [];

test("каждый баф вносит собственный игровой модификатор", () => {
  const cases: Array<{
    effect: ActiveEffect<BuffId>;
    field:
      | "doorsToReveal"
      | "wrongOptionsToRemove"
      | "mistakeShields"
      | "nextRoomDifficultyDelta"
      | "questionSkips";
    expected: number;
  }> = [
    {
      effect: { id: "removeWrongOption", stacks: 2 },
      field: "wrongOptionsToRemove",
      expected: 2,
    },
    {
      effect: { id: "secondChance", stacks: 2 },
      field: "mistakeShields",
      expected: 2,
    },
    {
      effect: { id: "doorInsight", stacks: 2 },
      field: "doorsToReveal",
      expected: 2,
    },
    {
      effect: { id: "easierNextRoom", stacks: 2 },
      field: "nextRoomDifficultyDelta",
      expected: -2,
    },
    {
      effect: { id: "skipQuestion", stacks: 2 },
      field: "questionSkips",
      expected: 2,
    },
  ];

  for (const { effect, field, expected } of cases) {
    const modifiers = resolveGameplayEffects([effect], noDebuffs);
    assert.equal(modifiers[field], expected, `${effect.id} должен изменять ${field}`);
  }
});

test("каждый дебаф вносит собственный игровой модификатор", () => {
  const timerModifiers = resolveGameplayEffects(noBuffs, [
    { id: "timerPressure", stacks: 2 },
  ]);
  assert.equal(timerModifiers.roomTimerSeconds, 40);

  const hiddenDoorModifiers = resolveGameplayEffects(
    [{ id: "doorInsight", stacks: 3 }],
    [{ id: "hiddenDoorInfo", stacks: 2 }],
  );
  assert.equal(hiddenDoorModifiers.doorsToReveal, 1);

  const harderRoomModifiers = resolveGameplayEffects(noBuffs, [
    { id: "harderNextRoom", stacks: 2 },
  ]);
  assert.equal(harderRoomModifiers.nextRoomDifficultyDelta, 2);

  const technologyModifiers = resolveGameplayEffects(noBuffs, [
    { id: "extraTechnology", stacks: 2 },
  ]);
  assert.equal(technologyModifiers.extraTechnologyCount, 2);

  const fewerHintsModifiers = resolveGameplayEffects(
    [{ id: "removeWrongOption", stacks: 3 }],
    [{ id: "fewerHints", stacks: 2 }],
  );
  assert.equal(fewerHintsModifiers.wrongOptionsToRemove, 1);
});

test("противоположные эффекты складываются независимо и дают единый итог", () => {
  const modifiers = resolveGameplayEffects(
    [
      { id: "doorInsight", stacks: 4 },
      { id: "easierNextRoom", stacks: 3 },
      { id: "removeWrongOption", stacks: 5 },
    ],
    [
      { id: "hiddenDoorInfo", stacks: 1 },
      { id: "harderNextRoom", stacks: 5 },
      { id: "fewerHints", stacks: 2 },
    ],
  );

  assert.equal(modifiers.doorsToReveal, 3);
  assert.equal(modifiers.nextRoomDifficultyDelta, 2);
  assert.equal(modifiers.wrongOptionsToRemove, 3);
});

test("одинаковые эффекты накапливаются без лимита и расходуются по стакам", () => {
  const stacked = addEffectStacks(noBuffs, "secondChance", 1_000);
  const accumulated = addEffectStacks(stacked, "secondChance", 250);

  assert.deepEqual(accumulated, [{ id: "secondChance", stacks: 1_250 }]);
  assert.equal(resolveGameplayEffects(accumulated, noDebuffs).mistakeShields, 1_250);

  const consumed = consumeEffectStacks(accumulated, "secondChance", 1_249);
  assert.deepEqual(consumed, [{ id: "secondChance", stacks: 1 }]);
  assert.deepEqual(consumeEffectStacks(consumed, "secondChance"), []);
});
