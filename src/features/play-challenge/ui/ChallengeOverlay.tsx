"use client";

import { useMemo, useState } from "react";
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { type ChallengeAnswer } from "@/game/domain/challenge/types";
import { type ChallengeViewModel } from "../model/challengeViewModel";

type ChallengeOverlayProps = {
  challenge: ChallengeViewModel;
  onComplete: (answers: readonly ChallengeAnswer[]) => void;
};

type QuestionViewModel = ChallengeViewModel["questions"][number];
type ChallengeOptionViewModel = QuestionViewModel["options"][number];

function HighlightedCode({ code, language }: { code: string; language: string }) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      wrapLongLines={false}
      className="mt-4 max-h-58 overflow-auto border-l-2 border-bronze font-mono text-sm leading-6 shadow-inner"
      customStyle={{
        marginBottom: 0,
        padding: "1rem 1.25rem",
        background: "#242623F7",
      }}
      codeTagProps={{ className: "font-mono text-sm leading-6" }}
    >
      {code}
    </SyntaxHighlighter>
  );
}

const COPY = {
  ru: {
    eyebrow: "ИСПЫТАНИЕ / BATTLE ROOM",
    question: "ВОПРОС",
    of: "ИЗ",
    next: "СЛЕДУЮЩИЙ ВОПРОС",
    finish: "ЗАВЕРШИТЬ ИСПЫТАНИЕ",
    interviewer: "ДУХ ИНТЕРВЬЮЕР",
    status: "СЕАНС АКТИВЕН",
    note: "Выберите ответ и подтвердите его. После перехода изменить выбор нельзя.",
    hrEyebrow: "ИНТЕРВЬЮ / HR ROOM",
    allowedMistakes: "ДОПУСТИМО ОШИБОК",
    difficulty: "СРЕДНИЙ",
    room: "ОБЫЧНАЯ КОМНАТА",
    formats: {
      quiz: "КВИЗ",
      trueFalse: "ВЕРНО / НЕВЕРНО",
      codeOutput: "РЕЗУЛЬТАТ КОДА",
      findBug: "НАЙДИ ОШИБКУ",
      chooseFragment: "ВЫБЕРИ ФРАГМЕНТ",
      orderSteps: "ПОРЯДОК ШАГОВ",
    },
    instructions: {
      quiz: "ВЫБЕРИТЕ ОДИН ВАРИАНТ",
      trueFalse: "ОПРЕДЕЛИТЕ, ВЕРНО ЛИ УТВЕРЖДЕНИЕ",
      codeOutput: "ВЫБЕРИТЕ РЕЗУЛЬТАТ ВЫПОЛНЕНИЯ",
      findBug: "УКАЖИТЕ СТРОКУ ИЛИ ПРИЧИНУ ОШИБКИ",
      chooseFragment: "ВЫБЕРИТЕ КОРРЕКТНЫЙ ФРАГМЕНТ",
      orderSteps: "РАСПОЛОЖИТЕ ШАГИ В ПРАВИЛЬНОМ ПОРЯДКЕ",
    },
  },
  en: {
    eyebrow: "CHALLENGE / BATTLE ROOM",
    question: "QUESTION",
    of: "OF",
    next: "NEXT QUESTION",
    finish: "FINISH CHALLENGE",
    interviewer: "SPIRIT INTERVIEWER",
    status: "SESSION ACTIVE",
    note: "Choose and confirm an answer. You cannot change it after moving on.",
    hrEyebrow: "INTERVIEW / HR ROOM",
    allowedMistakes: "ALLOWED MISTAKES",
    difficulty: "MEDIUM",
    room: "STANDARD ROOM",
    formats: {
      quiz: "QUIZ",
      trueFalse: "TRUE / FALSE",
      codeOutput: "CODE OUTPUT",
      findBug: "FIND THE BUG",
      chooseFragment: "CHOOSE FRAGMENT",
      orderSteps: "ORDER STEPS",
    },
    instructions: {
      quiz: "CHOOSE ONE OPTION",
      trueFalse: "DECIDE WHETHER THE STATEMENT IS TRUE",
      codeOutput: "CHOOSE THE EXECUTION RESULT",
      findBug: "IDENTIFY THE BUGGY LINE OR CAUSE",
      chooseFragment: "CHOOSE THE CORRECT FRAGMENT",
      orderSteps: "PUT THE STEPS IN THE CORRECT ORDER",
    },
  },
} as const;

function OptionButton({
  option,
  selected,
  monospace,
  onSelect,
}: {
  option: ChallengeOptionViewModel;
  selected: boolean;
  monospace: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={[
        "group flex min-h-14 w-full min-w-0 items-start gap-3 border px-4 py-3 text-left transition duration-150",
        selected
          ? "border-l-4 border-bronze bg-deep text-background shadow-inner"
          : "border-sandy/45 bg-background/65 text-dark hover:border-sandy hover:bg-pure",
      ].join(" ")}
    >
      <span
        className={[
          "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center border font-mono text-[10px] font-bold uppercase",
          selected
            ? "border-accent text-accent"
            : "border-sandy/60 text-bronze group-hover:border-bronze",
        ].join(" ")}
      >
        {option.id.replace(/^l/, "")}
      </span>
      <span
        className={[
          "challenge-copy min-w-0 wrap-break-word text-base font-medium leading-6",
          monospace ? "font-mono" : "font-sans",
        ].join(" ")}
      >
        {option.label}
      </span>
    </button>
  );
}

function OrderStepsControl({
  question,
  optionIds,
  onChange,
}: {
  question: QuestionViewModel;
  optionIds: readonly string[];
  onChange: (optionIds: string[]) => void;
}) {
  const optionsById = new Map(question.options.map((option) => [option.id, option]));

  const move = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= optionIds.length) {
      return;
    }

    const next = [...optionIds];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  };

  return (
    <ol className="flex flex-col gap-2">
      {optionIds.map((optionId, index) => {
        const option = optionsById.get(optionId);

        if (!option) {
          return null;
        }

        return (
          <li
            key={option.id}
            className="flex min-h-14 items-center border border-sandy/45 bg-background/70"
          >
            <span className="flex h-14 w-12 shrink-0 items-center justify-center border-r border-sandy/45 bg-deep font-mono text-xs font-bold text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="challenge-copy min-w-0 flex-1 px-4 py-3 font-sans text-base font-medium leading-6 text-dark">
              {option.label}
            </span>
            <div className="flex h-14 shrink-0 border-l border-sandy/45">
              <button
                type="button"
                aria-label={`Move step ${index + 1} up`}
                disabled={index === 0}
                onClick={() => move(index, -1)}
                className="w-11 font-mono text-sm text-bronze hover:bg-sandy-low disabled:opacity-25"
              >
                ↑
              </button>
              <button
                type="button"
                aria-label={`Move step ${index + 1} down`}
                disabled={index === optionIds.length - 1}
                onClick={() => move(index, 1)}
                className="w-11 border-l border-sandy/45 font-mono text-sm text-bronze hover:bg-sandy-low disabled:opacity-25"
              >
                ↓
              </button>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function ChallengeOverlay({ challenge, onComplete }: ChallengeOverlayProps) {
  const copy = COPY[challenge.locale];
  const isHrChallenge = challenge.kind === "hr";
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [orderedOptionIds, setOrderedOptionIds] = useState<string[]>([]);
  const [answers, setAnswers] = useState<ChallengeAnswer[]>([]);
  const question = challenge.questions[questionIndex];
  const isLastQuestion = questionIndex === challenge.questions.length - 1;
  const progressWidth = useMemo(
    () => `${((questionIndex + 1) / challenge.questions.length) * 100}%`,
    [challenge.questions.length, questionIndex],
  );

  if (!question) {
    return null;
  }

  const currentOrderedOptionIds =
    question.format === "orderSteps" && orderedOptionIds.length === 0
      ? question.options.map((option) => option.id)
      : orderedOptionIds;

  const answerReady =
    question.format === "orderSteps"
      ? currentOrderedOptionIds.length === question.options.length
      : selectedOptionId !== null;

  const submitAnswer = () => {
    if (!answerReady) {
      return;
    }

    const answer: ChallengeAnswer =
      question.format === "orderSteps"
        ? {
            questionId: question.id,
            format: "orderSteps",
            optionIds: currentOrderedOptionIds,
          }
        : {
            questionId: question.id,
            format: question.format,
            optionId: selectedOptionId!,
          };
    const nextAnswers = [...answers, answer];

    if (isLastQuestion) {
      onComplete(nextAnswers);
      return;
    }

    setAnswers(nextAnswers);
    setSelectedOptionId(null);
    setOrderedOptionIds([]);
    setQuestionIndex((current) => current + 1);
  };

  const monospaceOptions = ["codeOutput", "findBug", "chooseFragment"].includes(
    question.format,
  );

  return (
    <div className="challenge-overlay-enter absolute inset-0 z-30 flex items-center justify-center bg-overlay/85 px-6 pb-8 pt-32 backdrop-blur-sm">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="challenge-title"
        className="challenge-dialog grid w-full max-w-[1680px] overflow-hidden border border-sandy bg-background shadow-2xl"
      >
        <div className="challenge-question-layout grid min-h-0 min-w-0">
          <header className="border-b border-sandy/55 px-7 py-3">
            <div className="flex items-center gap-5 font-mono text-[10px] font-semibold tracking-widest text-pale">
              <span>{copy.question} {questionIndex + 1} {copy.of} {challenge.questions.length}</span>
              <span className="h-4 w-px bg-sandy/55" />
              <span>{challenge.interviewerTitle.toUpperCase()}</span>
              <span className="h-4 w-px bg-sandy/55" />
              <span className="text-bronze">{copy.formats[question.format]}</span>
              <span className="h-4 w-px bg-sandy/55" />
              <span>{copy.difficulty}</span>
              <span className="ml-auto">{isHrChallenge ? copy.hrEyebrow : copy.room}</span>
            </div>
            <div className="mt-3 h-px bg-sandy/25">
              <div className="h-px bg-bronze transition-all duration-300" style={{ width: progressWidth }} />
            </div>
          </header>

          <div className="min-h-0 overflow-y-auto overscroll-contain px-7 py-5">
            <h1
              id="challenge-title"
              className="challenge-copy max-w-5xl wrap-break-word font-noto text-2xl font-semibold leading-tight text-dark"
            >
              {question.prompt}
            </h1>

            {question.code && (
              <HighlightedCode
                code={question.code}
                language={question.codeLanguage ?? "text"}
              />
            )}

            <p className="mt-5 font-mono text-[10px] font-semibold tracking-widest text-bronze">
              {copy.instructions[question.format]}
            </p>

            <div className="mt-3">
              {question.format === "orderSteps" ? (
                <OrderStepsControl
                  question={question}
                  optionIds={currentOrderedOptionIds}
                  onChange={setOrderedOptionIds}
                />
              ) : (
                <div
                  className={
                    question.format === "trueFalse"
                      ? "grid grid-cols-2 gap-3"
                      : "flex flex-col gap-2"
                  }
                >
                  {question.options.map((option) => (
                    <OptionButton
                      key={option.id}
                      option={option}
                      selected={selectedOptionId === option.id}
                      monospace={monospaceOptions}
                      onSelect={() => setSelectedOptionId(option.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <footer className="flex items-center justify-between gap-5 border-t border-sandy/40 px-7 py-4">
            <p className="max-w-2xl font-sans text-xs leading-5 text-pale">{copy.note}</p>
            <button
              type="button"
              disabled={!answerReady}
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
              <img src={challenge.interviewerIconPath} alt="" className="h-18 w-18 drop-shadow-lg" />
            </div>
            <h2 className="mt-6 font-noto text-3xl font-semibold text-accent">{challenge.interviewerTitle}</h2>
            <p className="mt-2 font-mono text-xs tracking-widest text-milk/65">
              {isHrChallenge ? `${copy.allowedMistakes}: ${challenge.allowedMistakes}` : copy.status}
            </p>
          </div>
          <div className="border-t border-sandy/35 pt-4">
            <div className="flex justify-between font-mono text-xs text-milk/55">
              <span>ROOM_ID</span>
              <span>{challenge.roomId.slice(0, 8).toUpperCase()}</span>
            </div>
            <div className="mt-2 flex justify-between font-mono text-xs text-milk/55">
              <span>{isHrChallenge ? copy.allowedMistakes : "TECH"}</span>
              <span>{isHrChallenge ? challenge.allowedMistakes : challenge.interviewerTitle.toUpperCase()}</span>
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}
