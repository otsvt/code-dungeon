import assert from "node:assert/strict";
import test from "node:test";

import {
  addRunEffect,
  consumeRunEffect,
} from "../src/game/application/run/runLifecycle";
import { type CurrentRun } from "../src/game";

function createRun(): CurrentRun {
  return {
    id: "effect-order-run",
    settings: {
      poolModeId: "frontend",
      technologyIds: ["html"],
    },
    currentRoom: { type: "start" },
    nextRoomChoices: [],
    roomNumber: 0,
    totalRooms: 5,
    lives: { current: 1, max: 1 },
    activeEffects: [],
    resolvedRoomIds: [],
    hrRoomOffered: false,
    startBuffGranted: true,
    impression: 0,
    status: "started",
  };
}

test("бафы и дебафы сохраняют общий порядок получения", () => {
  let run = createRun();

  run = addRunEffect(run, "noiseSuppression");
  run = addRunEffect(run, "routeSubstitution");
  run = addRunEffect(run, "stackNavigator");
  run = addRunEffect(run, "redFlag");

  assert.deepEqual(
    run.activeEffects.map((effect) => effect.id),
    ["noiseSuppression", "routeSubstitution", "stackNavigator", "redFlag"],
  );
});

test("новый стак сохраняет позицию, а повторное получение удалённого эффекта ставит его в конец", () => {
  let run = createRun();

  run = addRunEffect(run, "noiseSuppression");
  run = addRunEffect(run, "routeSubstitution");
  run = addRunEffect(run, "stackNavigator");
  run = addRunEffect(run, "routeSubstitution");

  assert.deepEqual(run.activeEffects, [
    { id: "noiseSuppression", stacks: 1 },
    { id: "routeSubstitution", stacks: 2 },
    { id: "stackNavigator", stacks: 1 },
  ]);

  run = consumeRunEffect(run, "routeSubstitution", 2);
  run = addRunEffect(run, "routeSubstitution");

  assert.deepEqual(
    run.activeEffects.map((effect) => effect.id),
    ["noiseSuppression", "stackNavigator", "routeSubstitution"],
  );
});
