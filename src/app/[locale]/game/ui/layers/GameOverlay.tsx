import { useEffect } from "react";
import { useLocale } from "next-intl";
import { CurrentRun } from "@/game/types/run";
import { ChallengeOverlay, createChallengeViewModel, useChallengeStore } from "@/features/play-challenge";
import { usePauseStore } from "@/features/pause-game";
import { PauseConfirmationMenu } from "../components/PauseConfirmationMenu";
import { PauseMenu } from "../components/PauseMenu";

interface GameOverlayProps {
  currentRun: CurrentRun;
  onRestart: () => void;
  onExitToMenu: () => void;
}

export function GameOverlay({ currentRun, onRestart, onExitToMenu }: GameOverlayProps) {
  const requestedLocale = useLocale();
  const locale = requestedLocale === "en" ? "en" : "ru";
  const isPaused = usePauseStore((state) => state.isPaused);
  const confirmation = usePauseStore((state) => state.confirmation);
  const resumeGame = usePauseStore((state) => state.resumeGame);
  const closeConfirmation = usePauseStore((state) => state.closeConfirmation);
  const activeChallenge = useChallengeStore((state) => state.activeChallenge);
  const isChallengeLoading = useChallengeStore((state) => state.isChallengeLoading);
  const challengeError = useChallengeStore((state) => state.challengeError);
  const completeChallenge = useChallengeStore((state) => state.completeChallenge);
  const challengeViewModel = activeChallenge ? createChallengeViewModel(activeChallenge, locale) : null;
  const finalResult =
    currentRun.status === "completed" ? currentRun.finalResult : null;

  useEffect(() => {
    if (!isPaused) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (confirmation) {
          closeConfirmation();
          return;
        }

        resumeGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeConfirmation, confirmation, isPaused, resumeGame]);

  if (
    !challengeViewModel &&
    !isChallengeLoading &&
    !challengeError &&
    !isPaused &&
    !finalResult
  ) {
    return null;
  }

  return (
    <>
      {isChallengeLoading && (
        <div
          role="status"
          className="absolute inset-0 z-30 flex items-center justify-center bg-overlay/85 font-mono text-sm tracking-widest text-background"
        >
          {locale === "ru" ? "ЗАГРУЗКА ИСПЫТАНИЯ…" : "LOADING CHALLENGE…"}
        </div>
      )}
      {challengeError && (
        <div
          role="alert"
          className="absolute inset-0 z-30 flex items-center justify-center bg-overlay/85 px-6 text-center font-mono text-sm text-background"
        >
          {challengeError}
        </div>
      )}
      {challengeViewModel && (
        <ChallengeOverlay
          key={challengeViewModel.roomId}
          challenge={challengeViewModel}
          onComplete={completeChallenge}
        />
      )}
      {finalResult && (
        <section className="absolute inset-0 z-40 bg-background p-6">
          <h1>
            {locale === "ru"
              ? finalResult.passed
                ? "Победа"
                : "Поражение"
              : finalResult.passed
                ? "Victory"
                : "Defeat"}
          </h1>
          <p>
            {locale === "ru" ? "Правильные ответы" : "Correct answers"}: {finalResult.correctAnswers} / {finalResult.totalAnswers}
          </p>
          <p>
            {locale === "ru" ? "Результат" : "Result"}: {Math.round(finalResult.accuracyPercent * 10) / 10}%
          </p>
          <p>
            {locale === "ru" ? "Необходимый результат" : "Required result"}: {currentRun.impression === -1 ? ">" : "≥"} {finalResult.requiredAccuracyPercent}%
          </p>
        </section>
      )}
      {isPaused && (
        <div className="absolute inset-0 z-50 p-6 flex-center bg-overlay">
          {confirmation ? (
            <PauseConfirmationMenu
              confirmation={confirmation}
              currentRun={currentRun}
              onCancel={closeConfirmation}
              onConfirm={confirmation === "restart" ? onRestart : onExitToMenu}
            />
          ) : (
            <PauseMenu currentRun={currentRun} />
          )}
        </div>
      )}
    </>
  );
}
