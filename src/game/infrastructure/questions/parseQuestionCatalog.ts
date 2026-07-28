import { TECHNOLOGIES } from "@/entities/technology";
import {
  type LocalizedTextDto,
  type QuestionCatalogDto,
  type QuestionDto,
  type QuestionKindDto,
  type QuestionOptionDto,
} from "./dto/questionCatalogDto";

function fail(path: string, message: string): never {
  throw new Error(`Invalid question catalog at ${path}: ${message}`);
}

function readObject(value: unknown, path: string): Record<string, unknown> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    fail(path, "expected an object");
  }

  return value as Record<string, unknown>;
}

function readString(value: unknown, path: string): string {
  if (typeof value !== "string" || value.length === 0) {
    fail(path, "expected a non-empty string");
  }

  return value;
}

function readLocalizedText(value: unknown, path: string): LocalizedTextDto {
  const text = readObject(value, path);

  return {
    ru: readString(text.ru, `${path}.ru`),
    en: readString(text.en, `${path}.en`),
  };
}

function readOption(value: unknown, path: string): QuestionOptionDto {
  const option = readObject(value, path);

  return {
    id: readString(option.id, `${path}.id`),
    label: readLocalizedText(option.label, `${path}.label`),
  };
}

function readQuestion(
  value: unknown,
  path: string,
  expectedKind: QuestionKindDto,
): QuestionDto {
  const question = readObject(value, path);
  const id = readString(question.id, `${path}.id`);
  const kind = readString(question.kind, `${path}.kind`);

  if (kind !== expectedKind) {
    fail(`${path}.kind`, `expected "${expectedKind}"`);
  }

  if (!Array.isArray(question.options) || question.options.length === 0) {
    fail(`${path}.options`, "expected a non-empty array");
  }

  const options = question.options.map((option, index) =>
    readOption(option, `${path}.options[${index}]`),
  );
  const optionIds = new Set<string>();

  for (const option of options) {
    if (optionIds.has(option.id)) {
      fail(`${path}.options`, `duplicate option id "${option.id}"`);
    }

    optionIds.add(option.id);
  }

  const correctOptionId = readString(
    question.correctOptionId,
    `${path}.correctOptionId`,
  );

  if (!optionIds.has(correctOptionId)) {
    fail(
      `${path}.correctOptionId`,
      `"${correctOptionId}" does not reference an existing option`,
    );
  }

  const code =
    question.code === null || question.code === undefined
      ? null
      : readString(question.code, `${path}.code`);
  const baseQuestion = {
    id,
    prompt: readLocalizedText(question.prompt, `${path}.prompt`),
    code,
    options,
    correctOptionId,
  };

  if (expectedKind === "hr") {
    if (question.technologyId !== undefined) {
      fail(`${path}.technologyId`, "HR questions must not define technologyId");
    }

    return {
      ...baseQuestion,
      kind: "hr",
    };
  }

  const technologyId = readString(
    question.technologyId,
    `${path}.technologyId`,
  );

  const technology = TECHNOLOGIES.find(
    (candidate) => candidate.id === technologyId,
  );

  if (!technology) {
    fail(`${path}.technologyId`, `unsupported technology "${technologyId}"`);
  }

  return {
    ...baseQuestion,
    kind: "battle",
    technologyId: technology.id,
  };
}

export function parseQuestionCatalog(
  value: unknown,
  expectedKind: QuestionKindDto,
): QuestionCatalogDto {
  const catalog = readObject(value, "catalog");

  if (catalog.version !== 1) {
    fail("catalog.version", "expected version 1");
  }

  if (!Array.isArray(catalog.questions)) {
    fail("catalog.questions", "expected an array");
  }

  const questions = catalog.questions.map((question, index) =>
    readQuestion(question, `catalog.questions[${index}]`, expectedKind),
  );
  const questionIds = new Set<string>();

  for (const question of questions) {
    if (questionIds.has(question.id)) {
      fail("catalog.questions", `duplicate question id "${question.id}"`);
    }

    questionIds.add(question.id);
  }

  return {
    version: 1,
    questions,
  };
}
