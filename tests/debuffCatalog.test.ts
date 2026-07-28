import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";

import { DEBUFFS } from "../src/game";

const EXPECTED_DEBUFFS = [
  ["routeSubstitution", "route-substitution.png"],
  ["lostTranslation", "lost-translation.png"],
  ["glassCeiling", "glass-ceiling.png"],
  ["technicalDebt", "technical-debt.png"],
  ["undeclaredStack", "undeclared-stack.png"],
  ["busFactor", "bus-factor.png"],
  ["reversedWording", "reversed-wording.png"],
  ["crossFunctionalTeam", "cross-functional-team.png"],
] as const;

test("каталог содержит только восемь утверждённых обычных дебафов", () => {
  assert.deepEqual(
    DEBUFFS.map((debuff) => [
      debuff.id,
      path.basename(debuff.iconPath),
    ]),
    EXPECTED_DEBUFFS,
  );
});

test("для каждого утверждённого дебафа сохранена иконка", () => {
  for (const debuff of DEBUFFS) {
    const iconPath = path.join(
      process.cwd(),
      "public",
      debuff.iconPath.replace(/^\//, ""),
    );

    assert.equal(
      existsSync(iconPath),
      true,
      `Не найдена иконка ${debuff.iconPath}`,
    );
  }
});
