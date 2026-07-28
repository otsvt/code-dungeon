import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { BUFFS } from "../src/game";

const EXPECTED_BUFFS = [
  ["noiseSuppression", "noise-suppression.png"],
  ["stackNavigator", "stack-navigator.png"],
  ["headStart", "head-start.png"],
  ["deepSpecialization", "deep-specialization.png"],
  ["broadProfile", "broad-profile.png"],
  ["refactoring", "refactoring.png"],
  ["stableResult", "stable-result.png"],
] as const;

test("каталог содержит только семь утверждённых обычных бафов", () => {
  assert.deepEqual(
    BUFFS.map((buff) => [
      buff.id,
      path.basename(buff.iconPath),
    ]),
    EXPECTED_BUFFS,
  );
});

test("для каждого утверждённого бафа сохранена иконка", () => {
  for (const buff of BUFFS) {
    const iconPath = path.join(
      process.cwd(),
      "public",
      buff.iconPath.replace(/^\//, ""),
    );

    assert.equal(existsSync(iconPath), true, `Не найдена иконка ${buff.iconPath}`);
  }
});
