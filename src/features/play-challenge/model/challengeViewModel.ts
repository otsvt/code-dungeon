import { getTechnologyById } from "@/entities/technology";
import { type ActiveChallenge } from "@/game/application/challenge/types";
import { type ChallengeLocale } from "@/game/domain/challenge/types";

export type ChallengeViewModel = {
  kind: ActiveChallenge["kind"];
  roomId: string;
  locale: ChallengeLocale;
  interviewerTitle: string;
  interviewerIconPath: string;
  allowedMistakes?: number;
  questions: Array<{
    id: string;
    prompt: string;
    code?: string;
    options: Array<{
      id: string;
      label: string;
    }>;
  }>;
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
      challenge.kind === "hr" ? "HR" : (technology?.title ?? ""),
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
    questions: challenge.questions.map((question) => ({
      id: question.id,
      prompt: question.prompt[locale],
      ...(question.code ? { code: question.code } : {}),
      options: question.options.map((option) => ({
        id: option.id,
        label: option.label[locale],
      })),
    })),
  };
}
