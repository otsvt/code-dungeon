import { getTechnologyById, type TechnologyId } from "@/entities/technology";
import { type ActiveChallenge } from "@/game/application/challenge/types";
import { type ChallengeLocale } from "@/game/domain/challenge/types";

export type ChallengeViewModel = {
  kind: ActiveChallenge["kind"];
  roomId: string;
  locale: ChallengeLocale;
  interviewerTitle: string;
  interviewerIconPath: string;
  allowedMistakes?: number;
  finalDifficulty?: "easyMedium" | "mixed" | "hard";
  questions: Array<{
    id: string;
    format: ActiveChallenge["questions"][number]["format"];
    prompt: string;
    interviewerTitle: string;
    interviewerIconPath: string;
    code?: string;
    codeLanguage?: string;
    options: Array<{
      id: string;
      label: string;
      code?: string;
    }>;
  }>;
};

const CODE_LANGUAGE_BY_TECHNOLOGY: Record<TechnologyId, string> = {
  html: "markup",
  css: "css",
  javascript: "javascript",
  typescript: "typescript",
  react: "tsx",
  vue: "javascript",
  git: "bash",
};

export function createChallengeViewModel(
  challenge: ActiveChallenge,
  locale: ChallengeLocale,
): ChallengeViewModel {
  const technology =
    challenge.kind === "battle"
      ? getTechnologyById(challenge.technologyId)
      : undefined;

  return {
    kind: challenge.kind,
    roomId: challenge.roomId,
    locale,
    interviewerTitle:
      challenge.kind === "hr"
        ? "HR"
        : challenge.kind === "final"
          ? "HR + TEAM LEAD"
          : (technology?.title ?? ""),
    interviewerIconPath:
      challenge.kind === "battle"
        ? `/assets/game/technologies/${challenge.technologyId}.svg`
        : `/assets/game/impressions/${
            challenge.impression === -1
              ? "impression-weak"
              : challenge.impression === 1
                ? "impression-strong"
                : "impression-neutral"
          }.png`,
    ...(challenge.kind === "hr"
      ? { allowedMistakes: challenge.allowedMistakes }
      : {}),
    ...(challenge.kind === "final"
      ? {
          finalDifficulty:
            challenge.impression === -1
              ? ("hard" as const)
              : challenge.impression === 1
                ? ("easyMedium" as const)
                : ("mixed" as const),
        }
      : {}),
    questions: challenge.questions.map((question) => ({
      id: question.id,
      format: question.format,
      prompt: question.prompt[locale],
      interviewerTitle:
        challenge.kind === "final"
          ? question.technologyId
            ? "TEAM LEAD"
            : "HR"
          : challenge.kind === "hr"
            ? "HR"
            : (technology?.title ?? ""),
      interviewerIconPath:
        challenge.kind === "final"
          ? question.technologyId
            ? "/assets/game/interviewers/team-lead.png"
            : "/assets/game/interviewers/hr-spirit.png"
          : challenge.kind === "battle"
            ? `/assets/game/technologies/${challenge.technologyId}.svg`
            : `/assets/game/impressions/${
                challenge.impression === -1
                  ? "impression-weak"
                  : challenge.impression === 1
                    ? "impression-strong"
                    : "impression-neutral"
              }.png`,
      ...(question.code ? { code: question.code } : {}),
      ...((question.code || question.format === "chooseCode") &&
      question.technologyId
        ? {
            codeLanguage:
              question.codeLanguage ??
              CODE_LANGUAGE_BY_TECHNOLOGY[question.technologyId],
          }
        : {}),
      options: question.options.map((option) => ({
        id: option.id,
        label: option.label[locale],
        ...(option.code ? { code: option.code } : {}),
      })),
    })),
  };
}
