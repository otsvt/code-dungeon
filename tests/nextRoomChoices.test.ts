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
    hrRoomChance: 0,
    random: () => 0,
    createId: idFactory(),
  });
  const fourDoors = generateNextRoomChoices({
    currentRoomNumber: 0,
    totalRooms: 7,
    technologyIds: ["html", "css", "javascript", "typescript", "react", "vue", "git"],
    hrRoomChance: 0,
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

test("HR-комната случайно подмешивается максимум в одну дверь", () => {
  const withoutHr = generateNextRoomChoices({
    currentRoomNumber: 1,
    totalRooms: 7,
    technologyIds: ["html", "css", "javascript"],
    hrRoomChance: 0,
    random: () => 0,
    createId: idFactory(),
  });
  const withHr = generateNextRoomChoices({
    currentRoomNumber: 1,
    totalRooms: 7,
    technologyIds: ["html", "css", "javascript"],
    hrRoomChance: 1,
    random: () => 0,
    createId: idFactory(),
  });

  assert.ok(withoutHr.every((choice) => choice.type === "battle"));
  assert.equal(withHr.filter((choice) => choice.type === "hr").length, 1);
  assert.equal(withHr.length, 2);
});

test("после HR-комнаты следующий набор не содержит HR-дверь", () => {
  const choices = generateNextRoomChoices({
    currentRoomNumber: 2,
    totalRooms: 7,
    technologyIds: ["html", "css", "javascript"],
    hrRoomChance: 1,
    allowHrRoom: false,
    random: () => 0,
    createId: idFactory(),
  });

  assert.ok(choices.every((choice) => choice.type === "battle"));
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
