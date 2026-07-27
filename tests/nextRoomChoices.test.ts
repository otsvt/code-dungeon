import assert from "node:assert/strict";
import test from "node:test";

import {
  generateNextRoomChoices,
  resolveGameplayEffects,
  selectRevealedRoomIds,
  type NextRoomChoice,
} from "../src/game";

function idFactory() {
  let index = 0;
  return () => `room-${index++}`;
}

test("обычная комната заранее получает от двух до четырёх реальных вариантов", () => {
  const twoDoors = generateNextRoomChoices({
    currentRoomNumber: 0,
    totalRooms: 7,
    technologyIds: ["html", "css", "javascript"],
    random: () => 0,
    createId: idFactory(),
  });
  const fourDoors = generateNextRoomChoices({
    currentRoomNumber: 0,
    totalRooms: 7,
    technologyIds: ["html", "css", "javascript", "typescript", "react", "vue", "git"],
    random: () => 0.999,
    createId: idFactory(),
  });

  assert.equal(twoDoors.length, 2);
  assert.equal(fourDoors.length, 4);
  assert.ok(twoDoors.every((choice) => choice.type === "battle"));
  assert.ok(fourDoors.every((choice) => choice.type === "battle"));
  assert.deepEqual(
    twoDoors.map((choice) => choice.technologyId),
    ["html", "css"],
  );
  assert.equal(new Set(fourDoors.map((choice) => choice.technologyId)).size, 4);
});

test("после основных комнат генерируется реальный путь в финал", () => {
  const choices = generateNextRoomChoices({
    currentRoomNumber: 7,
    totalRooms: 7,
    technologyIds: ["html"],
    createId: idFactory(),
  });

  assert.deepEqual(choices, [{ id: "room-0", type: "final" }]);
});

test("Door Insight раскрывает конкретную сохранённую комнату, а не текст-заглушку", () => {
  const choices: NextRoomChoice[] = [
    { id: "html-room", type: "battle", technologyId: "html" },
    { id: "css-room", type: "battle", technologyId: "css" },
    { id: "javascript-room", type: "battle", technologyId: "javascript" },
  ];
  const modifiers = resolveGameplayEffects(
    [{ id: "doorInsight", stacks: 1 }],
    [],
  );
  const revealedIds = selectRevealedRoomIds(
    choices,
    modifiers.doorsToReveal,
    () => 0.4,
  );
  const revealedRoom = choices.find((choice) => revealedIds.has(choice.id));

  assert.equal(revealedIds.size, 1);
  assert.deepEqual(revealedRoom, {
    id: "css-room",
    type: "battle",
    technologyId: "css",
  });
});

test("число раскрытых дверей ограничено реальным числом вариантов", () => {
  const choices: NextRoomChoice[] = [
    { id: "battle-room", type: "battle", technologyId: "html" },
    { id: "another-battle-room", type: "battle", technologyId: "css" },
  ];

  assert.equal(selectRevealedRoomIds(choices, 20, () => 0).size, 2);
  assert.equal(selectRevealedRoomIds(choices, -1, () => 0).size, 0);
});
