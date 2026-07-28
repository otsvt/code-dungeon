import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { HR_BUFFS, HR_DEBUFFS } from "../src/game";

const EXPECTED_HR_BUFFS = [
  ["debuffImmunity", "debuff-immunity.png"],
  ["unlowerableReputation", "unlowerable-reputation.png"],
] as const;

const EXPECTED_HR_DEBUFFS = [
  ["buffBan", "buff-ban.png"],
  ["failedStart", "failed-start.png"],
] as const;

test("HR-каталог содержит только четыре утверждённых эффекта", () => {
  assert.deepEqual(
    HR_BUFFS.map((buff) => [buff.id, path.basename(buff.iconPath)]),
    EXPECTED_HR_BUFFS,
  );
  assert.deepEqual(
    HR_DEBUFFS.map((debuff) => [
      debuff.id,
      path.basename(debuff.iconPath),
    ]),
    EXPECTED_HR_DEBUFFS,
  );
});

test("для каждого HR-эффекта сохранена иконка", () => {
  for (const effect of [...HR_BUFFS, ...HR_DEBUFFS]) {
    const iconPath = path.join(
      process.cwd(),
      "public",
      effect.iconPath.replace(/^\//, ""),
    );

    assert.equal(
      existsSync(iconPath),
      true,
      `Не найдена иконка ${effect.iconPath}`,
    );
  }
});
