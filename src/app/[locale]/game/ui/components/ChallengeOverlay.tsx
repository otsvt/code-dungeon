"use client";

import { useMemo, useState } from "react";
import { useLocale } from "next-intl";
import { getTechnologyById } from "@/entities/technology";
import { type ActiveChallenge, type ChallengeLocale, type ChallengeOption } from "@/game";

type ChallengeOverlayProps = {
  challenge: ActiveChallenge;
  onComplete: (correctAnswers: number, totalAnswers: number) => void;
};

const COPY = {
  ru: {
    eyebrow: "ИСПЫТАНИЕ / BATTLE ROOM",
    question: "ВОПРОС",
    of: "ИЗ",
    choose: "Выберите один ответ",
    next: "СЛЕДУЮЩИЙ ВОПРОС",
    finish: "ЗАВЕРШИТЬ ИСПЫТАНИЕ",
    interviewer: "ИНТЕРВЬЮЕР",
    status: "СЕАНС АКТИВЕН",
    note: "Ответ фиксируется после перехода к следующему вопросу.",
  },
  en: {
    eyebrow: "CHALLENGE / BATTLE ROOM",
    question: "QUESTION",
    of: "OF",
    choose: "Choose one answer",
    next: "NEXT QUESTION",
    finish: "FINISH CHALLENGE",
    interviewer: "INTERVIEWER",
    status: "SESSION ACTIVE",
    note: "Your answer is locked after moving to the next question.",
  },
} as const;

function OptionButton({
  option,
  locale,
  selected,
  onSelect,
}: {
  option: ChallengeOption;
  locale: ChallengeLocale;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={[
        "group flex min-h-15 w-full min-w-0 items-start gap-3 border px-4 py-3.5 text-left transition duration-150",
        selected
          ? "border-l-4 border-bronze bg-sandy-low text-dark shadow-inner"
          : "border-sandy/45 bg-background/65 text-dark hover:border-sandy hover:bg-pure",
      ].join(" ")}
    >
      <span
        className={[
          "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center border font-mono text-xs font-bold uppercase",
          selected ? "border-bronze bg-deep text-accent" : "border-sandy/60 text-bronze group-hover:border-bronze",
        ].join(" ")}
      >
        {option.id}
      </span>
      <span className="challenge-copy min-w-0 wrap-break-word font-sans text-lg font-medium leading-6">
        {option.label[locale]}
      </span>
    </button>
  );
}

export function ChallengeOverlay({ challenge, onComplete }: ChallengeOverlayProps) {
  const requestedLocale = useLocale();
  const locale: ChallengeLocale = requestedLocale === "en" ? "en" : "ru";
  const copy = COPY[locale];
  const technology = getTechnologyById(challenge.technologyId);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const question = challenge.questions[questionIndex];
  const isLastQuestion = questionIndex === challenge.questions.length - 1;
  const technologyIconPath = `/assets/game/technologies/${challenge.technologyId}.svg`;
  const progressWidth = useMemo(
    () => `${((questionIndex + 1) / challenge.questions.length) * 100}%`,
    [challenge.questions.length, questionIndex],
  );

  if (!question) {
    return null;
  }

  const submitAnswer = () => {
    if (!selectedOptionId) {
      return;
    }

    const nextCorrectAnswers = correctAnswers + Number(selectedOptionId === question.correctOptionId);

    if (isLastQuestion) {
      onComplete(nextCorrectAnswers, challenge.questions.length);
      return;
    }

    setCorrectAnswers(nextCorrectAnswers);
    setQuestionIndex((current) => current + 1);
    setSelectedOptionId(null);
  };

  return (
    <div className="challenge-overlay-enter absolute inset-0 z-30 flex items-center justify-center bg-overlay/85 px-6 pb-8 pt-32 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="challenge-title"
        className="challenge-dialog grid w-full max-w-7xl overflow-hidden border border-sandy bg-background shadow-2xl"
      >
        <div className="challenge-question-layout grid min-h-0 min-w-0">
          <header className="border-b border-sandy/55 px-7 py-4">
            <div className="flex items-center justify-between gap-5">
              <p className="font-mono text-xs font-semibold tracking-widest text-bronze">{copy.eyebrow}</p>
              <p className="font-mono text-xs text-pale">
                {copy.question} {questionIndex + 1} {copy.of} {challenge.questions.length}
              </p>
            </div>
            <div className="mt-3 h-px bg-sandy/25">
              <div className="h-px bg-bronze transition-all duration-300" style={{ width: progressWidth }} />
            </div>
          </header>

          <div className="min-h-0 overflow-y-auto overscroll-contain px-7 py-6">
            <h1
              id="challenge-title"
              className="challenge-copy max-w-5xl wrap-break-word font-noto text-3xl font-semibold leading-tight text-dark"
            >
              {question.prompt[locale]}
            </h1>

            {question.code && (
              <pre className="mt-5 overflow-x-auto border-l-2 border-bronze bg-deep px-5 py-4 font-mono text-sm leading-7 text-milk shadow-inner">
                <code>{question.code}</code>
              </pre>
            )}

            <p className="mt-6 font-mono text-xs font-semibold tracking-widest text-pale">{copy.choose}</p>
            <div className="mt-3 grid grid-cols-2 gap-3 max-md:grid-cols-1">
              {question.options.map((option) => (
                <OptionButton
                  key={option.id}
                  option={option}
                  locale={locale}
                  selected={selectedOptionId === option.id}
                  onSelect={() => setSelectedOptionId(option.id)}
                />
              ))}
            </div>
          </div>

          <footer className="flex items-center justify-between gap-5 border-t border-sandy/40 px-7 py-4">
            <p className="max-w-lg font-sans text-sm leading-5 text-pale">{copy.note}</p>
            <button
              type="button"
              disabled={!selectedOptionId}
              onClick={submitAnswer}
              className="min-w-64 border border-dark bg-dark px-5 py-3.5 font-mono text-xs font-bold tracking-widest text-background transition hover:bg-button-primary-hover disabled:cursor-default disabled:opacity-35"
            >
              {isLastQuestion ? copy.finish : copy.next}
            </button>
          </footer>
        </div>

        <aside className="relative flex min-h-120 flex-col overflow-hidden border-l border-sandy bg-deep px-6 py-6 text-background">
          <div className="absolute inset-x-0 top-0 h-px bg-accent/70" />
          <p className="font-mono text-xs font-semibold tracking-widest text-accent">{copy.interviewer}</p>

          <div className="mt-8 flex flex-1 flex-col items-center justify-center">
            <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-sandy/65 bg-effect-buff-bg shadow-2xl">
              <div className="absolute inset-2 rounded-full border border-sandy/25" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={technologyIconPath} alt="" className="h-18 w-18 drop-shadow-lg" />
            </div>
            <h2 className="mt-6 font-noto text-3xl font-semibold text-accent">
              {technology?.title ?? challenge.technologyId}
            </h2>
            <p className="mt-2 font-mono text-xs tracking-widest text-milk/65">{copy.status}</p>
          </div>

          <div className="border-t border-sandy/35 pt-4">
            <div className="flex justify-between font-mono text-xs text-milk/55">
              <span>ROOM_ID</span>
              <span>{challenge.roomId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="mt-2 flex justify-between font-mono text-xs text-milk/55">
              <span>TECH</span>
              <span>{technology?.title.toUpperCase()}</span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
