import assert from "node:assert/strict";
import test from "node:test";

import { type CurrentRun, type NextRoomChoice, useRunStore } from "../src/game";

function createRun(nextRoomChoices: NextRoomChoice[]): CurrentRun {
  return {
    id: "run-transition-test",
    settings: {
      poolModeId: "frontend",
      technologyIds: ["html", "css", "javascript"],
    },
    currentRoom: { type: "start" },
    nextRoomChoices,
    roomNumber: 0,
    totalRooms: 5,
    lives: {
      current: 1,
      max: 1,
    },
    activeBuffs: [],
    activeDebuffs: [],
    resolvedRoomIds: [],
    startBuffGranted: true,
    impression: 0,
    status: "created",
  };
}

test("выбранная дверь становится текущей комнатой и готовит следующий путь", () => {
  const selectedRoom: NextRoomChoice = {
    id: "selected-react-room",
    type: "battle",
    technologyId: "react",
  };

  useRunStore.setState({
    currentRun: createRun([selectedRoom]),
    pendingStartBuff: null,
  });

  const didAdvance = useRunStore.getState().advanceToRoom(selectedRoom);
  const currentRun = useRunStore.getState().currentRun;

  assert.equal(didAdvance, true);
  assert.deepEqual(currentRun?.currentRoom, selectedRoom);
  assert.equal(currentRun?.roomNumber, 1);
  assert.equal(currentRun?.status, "started");
  assert.ok(
    currentRun &&
      currentRun.nextRoomChoices.length >= 2 &&
      currentRun.nextRoomChoices.length <= 4,
  );
  assert.ok(
    currentRun?.nextRoomChoices.every(
      (choice) => choice.type === "battle" || choice.type === "hr",
    ),
  );

  useRunStore.getState().resetRun();
});

test("HR-дверь становится текущей комнатой", () => {
  const selectedRoom: NextRoomChoice = {
    id: "selected-hr-room",
    type: "hr",
  };

  useRunStore.setState({
    currentRun: createRun([selectedRoom]),
    pendingStartBuff: null,
  });

  const didAdvance = useRunStore.getState().advanceToRoom(selectedRoom);

  assert.equal(didAdvance, true);
  assert.deepEqual(useRunStore.getState().currentRun?.currentRoom, selectedRoom);
  assert.ok(
    useRunStore
      .getState()
      .currentRun?.nextRoomChoices.every((choice) => choice.type !== "hr"),
  );

  useRunStore.getState().resetRun();
});

test("несуществующая дверь не может повторно изменить комнату", () => {
  const availableRoom: NextRoomChoice = {
    id: "available-room",
    type: "battle",
    technologyId: "html",
  };
  const unavailableRoom: NextRoomChoice = {
    id: "unavailable-room",
    type: "battle",
    technologyId: "css",
  };

  useRunStore.setState({
    currentRun: createRun([availableRoom]),
    pendingStartBuff: null,
  });

  const didAdvance = useRunStore.getState().advanceToRoom(unavailableRoom);
  const currentRun = useRunStore.getState().currentRun;

  assert.equal(didAdvance, false);
  assert.deepEqual(currentRun?.currentRoom, { type: "start" });
  assert.equal(currentRun?.roomNumber, 0);

  useRunStore.getState().resetRun();
});
