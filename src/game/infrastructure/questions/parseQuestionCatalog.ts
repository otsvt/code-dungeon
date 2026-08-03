import { TECHNOLOGIES } from "@/entities/technology";
import { BATTLE_QUESTION_FORMATS } from "../../domain/challenge/types";
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
    code:
      option.code === null || option.code === undefined
        ? null
        : readString(option.code, `${path}.code`),
  };
}

function readStringArray(value: unknown, path: string): string[] {
  if (!Array.isArray(value) || value.length === 0) {
    fail(path, "expected a non-empty array");
  }

  return value.map((item, index) => readString(item, `${path}[${index}]`));
}

function readQuestion(
  value: unknown,
  path: string,
  expectedKind: QuestionKindDto,
): QuestionDto {
  const question = readObject(value, path);
  const id = readString(question.id, `${path}.id`);
  const kind = readString(question.kind, `${path}.kind`);
  const format = readString(question.format, `${path}.format`);

  if (kind !== expectedKind) {
    fail(`${path}.kind`, `expected "${expectedKind}"`);
  }

  if (!BATTLE_QUESTION_FORMATS.some((candidate) => candidate === format)) {
    fail(`${path}.format`, `unsupported question format "${format}"`);
  }

  if (expectedKind === "hr" && format !== "quiz") {
    fail(`${path}.format`, "HR questions must use quiz format");
  }

  if (!Array.isArray(question.options) || question.options.length < 2) {
    fail(`${path}.options`, "expected at least two options");
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

  if (format === "trueFalse") {
    if (options.length !== 2 || !optionIds.has("true") || !optionIds.has("false")) {
      fail(`${path}.options`, 'trueFalse requires exactly "true" and "false" options');
    }
  }

  if (
    format === "chooseCode" &&
    options.some((option) => option.code === null)
  ) {
    fail(`${path}.options`, "chooseCode requires code in every option");
  }

  const code =
    question.code === null || question.code === undefined
      ? null
      : readString(question.code, `${path}.code`);
  const codeLanguage =
    question.codeLanguage === null || question.codeLanguage === undefined
      ? null
      : readString(question.codeLanguage, `${path}.codeLanguage`);

  if (code === null && codeLanguage !== null && format !== "chooseCode") {
    fail(`${path}.codeLanguage`, "requires a code sample");
  }

  if (["codeOutput", "findBug", "chooseFragment"].includes(format) && code === null) {
    fail(`${path}.code`, `${format} requires a code sample`);
  }

  const baseQuestion = {
    id,
    prompt: readLocalizedText(question.prompt, `${path}.prompt`),
    code,
    codeLanguage,
    options,
  };

  const answer =
    format === "orderSteps"
      ? (() => {
          const correctOptionIds = readStringArray(
            question.correctOptionIds,
            `${path}.correctOptionIds`,
          );
          const uniqueCorrectOptionIds = new Set(correctOptionIds);

          if (
            correctOptionIds.length !== options.length ||
            uniqueCorrectOptionIds.size !== options.length ||
            correctOptionIds.some((optionId) => !optionIds.has(optionId))
          ) {
            fail(
              `${path}.correctOptionIds`,
              "must contain every option id exactly once",
            );
          }

          return { format: "orderSteps" as const, correctOptionIds };
        })()
      : (() => {
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

          return {
            format: format as Exclude<typeof format, "orderSteps">,
            correctOptionId,
          };
        })();

  if (expectedKind === "hr") {
    if (question.technologyId !== undefined) {
      fail(`${path}.technologyId`, "HR questions must not define technologyId");
    }

    return {
      ...baseQuestion,
      ...answer,
      kind: "hr",
      format: "quiz",
    } as QuestionDto;
  }

  const technologyId = readString(question.technologyId, `${path}.technologyId`);
  const technology = TECHNOLOGIES.find((candidate) => candidate.id === technologyId);

  if (!technology) {
    fail(`${path}.technologyId`, `unsupported technology "${technologyId}"`);
  }

  return {
    ...baseQuestion,
    ...answer,
    kind: "battle",
    technologyId: technology.id,
  } as QuestionDto;
}

export function parseQuestionCatalog(
  value: unknown,
  expectedKind: QuestionKindDto,
): QuestionCatalogDto {
  const catalog = readObject(value, "catalog");

  if (catalog.version !== 2) {
    fail("catalog.version", "expected version 2");
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

  return { version: 2, questions };
}
