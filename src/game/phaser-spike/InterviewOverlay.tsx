import Image from "next/image";
import { useState } from "react";

type InterviewOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

const question = {
  spiritName: "JavaScript Spirit",
  prompt: "Что выведет этот код?",
  code: "console.log(typeof null);",
  correctOptionId: "object",
  options: [
    { id: "object", label: '"object"' },
    { id: "null", label: '"null"' },
    { id: "undefined", label: '"undefined"' },
    { id: "error", label: "Будет ошибка" },
  ],
};

export function InterviewOverlay({ isOpen, onClose }: InterviewOverlayProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const isAnswered = selectedOptionId !== null;
  const isCorrect = selectedOptionId === question.correctOptionId;

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSelectedOptionId(null);
    }, 300);
  };

  const getOptionClassName = (optionId: string) => {
    const baseClassName = "rounded-lg border-2 bg-white p-3 text-left font-medium transition";

    if (!isAnswered) {
      return `${baseClassName} border-slate-300 hover:border-amber-500 hover:bg-amber-50`;
    }

    if (optionId === question.correctOptionId && optionId === selectedOptionId) {
      return `${baseClassName} border-green-500 bg-green-100 text-green-800`;
    }

    if (optionId === selectedOptionId) {
      return `${baseClassName} border-red-500 bg-red-100 text-red-800`;
    }

    return `${baseClassName} border-slate-200 opacity-50`;
  };

  return (
    <div
      className={[
        "absolute inset-0 z-10 flex-center bg-foreground/75 transition-opacity duration-300 ease-out",
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
      ].join(" ")}
    >
      <article className="grid w-full max-w-5xl text-xl">
        <div className="flex items-center">
          <div className="grow border-4 border-amber-500 bg-white p-4">
            <p className="mb-4 text-sm font-bold uppercase text-amber-600">{question.spiritName}</p>
            <p className="font-medium text-slate-900">{question.prompt}</p>
            <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 text-base text-amber-200">
              {question.code}
            </pre>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {question.options.map((option) => (
                <button
                  key={option.id}
                  className={getOptionClassName(option.id)}
                  disabled={isAnswered}
                  onClick={() => setSelectedOptionId(option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <Image src="/assets/phaser-spike/spirit-test.png" alt="Spirit" width={360} height={420} />
        </div>
        <div className="border-4 border-amber-500 bg-white p-4">
          {isAnswered ? (
            <div>
              <p className={isCorrect ? "font-bold text-green-700" : "font-bold text-red-700"}>
                {isCorrect ? "Верно." : "Неверно."}
              </p>
              <button
                className="mt-4 rounded-lg bg-slate-950 px-5 py-2 font-bold text-white transition hover:bg-slate-800"
                onClick={handleClose}
              >
                Продолжить
              </button>
            </div>
          ) : (
            <p>Выбери ответ, кандидат. Даже древние баги JavaScript помнят твои сомнения.</p>
          )}
        </div>
      </article>
    </div>
  );
}
