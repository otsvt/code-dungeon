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
  run = addRunEffect(run, "buffBan");

  assert.deepEqual(
    run.activeEffects.map((effect) => effect.id),
    ["noiseSuppression", "routeSubstitution", "stackNavigator", "buffBan"],
  );
});

test("активный эффект не дублируется, но может вернуться после удаления", () => {
  let run = createRun();

  run = addRunEffect(run, "noiseSuppression");
  run = addRunEffect(run, "routeSubstitution");
  run = addRunEffect(run, "stackNavigator");
  run = addRunEffect(run, "routeSubstitution");

  assert.deepEqual(run.activeEffects, [
    { id: "noiseSuppression" },
    { id: "routeSubstitution" },
    { id: "stackNavigator" },
  ]);

  run = consumeRunEffect(run, "routeSubstitution");
  run = addRunEffect(run, "routeSubstitution");

  assert.deepEqual(
    run.activeEffects.map((effect) => effect.id),
    ["noiseSuppression", "stackNavigator", "routeSubstitution"],
  );
});
