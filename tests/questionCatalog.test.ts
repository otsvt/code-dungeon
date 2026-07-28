import assert from "node:assert/strict";
import test from "node:test";

import { parseQuestionCatalog } from "../src/game/infrastructure/questions/parseQuestionCatalog";

const validHrCatalog = {
  version: 1,
  questions: [
    {
      id: "hr-question",
      kind: "hr",
      prompt: {
        ru: "Вопрос",
        en: "Question",
      },
      code: null,
      options: [
        {
          id: "a",
          label: {
            ru: "Ответ",
            en: "Answer",
          },
        },
      ],
      correctOptionId: "a",
    },
  ],
};

test("валидатор принимает корректный versioned-каталог вопросов", () => {
  const catalog = parseQuestionCatalog(validHrCatalog, "hr");

  assert.equal(catalog.version, 1);
  assert.equal(catalog.questions[0]?.id, "hr-question");
});

test("валидатор отклоняет неизвестную версию каталога", () => {
  assert.throws(
    () =>
      parseQuestionCatalog(
        {
          ...validHrCatalog,
          version: 2,
        },
        "hr",
      ),
    /catalog\.version/,
  );
});

test("валидатор отклоняет правильный ответ без соответствующего варианта", () => {
  assert.throws(
    () =>
      parseQuestionCatalog(
        {
          ...validHrCatalog,
          questions: [
            {
              ...validHrCatalog.questions[0],
              correctOptionId: "missing",
            },
          ],
        },
        "hr",
      ),
    /does not reference an existing option/,
  );
});

test("валидатор отклоняет technologyId у HR-вопроса", () => {
  assert.throws(
    () =>
      parseQuestionCatalog(
        {
          ...validHrCatalog,
          questions: [
            {
              ...validHrCatalog.questions[0],
              technologyId: "html",
            },
          ],
        },
        "hr",
      ),
    /must not define technologyId/,
  );
});

test("валидатор отклоняет неподдерживаемую battle-технологию", () => {
  assert.throws(
    () =>
      parseQuestionCatalog(
        {
          version: 1,
          questions: [
            {
              ...validHrCatalog.questions[0],
              kind: "battle",
              technologyId: "cobol",
            },
          ],
        },
        "battle",
      ),
    /unsupported technology/,
  );
});
