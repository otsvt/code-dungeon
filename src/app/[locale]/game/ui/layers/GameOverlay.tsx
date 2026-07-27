import { useEffect } from "react";
import { useGameUiStore } from "@/game";
import { CurrentRun } from "@/game/types/run";
import { PauseConfirmationMenu } from "../components/PauseConfirmationMenu";
import { PauseMenu } from "../components/PauseMenu";
import { ChallengeOverlay } from "../components/ChallengeOverlay";
import { resolveChallengeOutcome } from "@/game";

interface GameOverlayProps {
  currentRun: CurrentRun;
  onRestart: () => void;
  onExitToMenu: () => void;
}

export function GameOverlay({ currentRun, onRestart, onExitToMenu }: GameOverlayProps) {
  const isPaused = useGameUiStore((state) => state.isPaused);
  const confirmation = useGameUiStore((state) => state.confirmation);
  const activeChallenge = useGameUiStore((state) => state.activeChallenge);
  const completeChallenge = useGameUiStore((state) => state.completeChallenge);
  const resumeGame = useGameUiStore((state) => state.resumeGame);
  const closeConfirmation = useGameUiStore((state) => state.closeConfirmation);

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

  if (!activeChallenge && !isPaused) {
    return null;
  }

  return (
    <>
      {activeChallenge && (
        <ChallengeOverlay
          key={activeChallenge.roomId}
          challenge={activeChallenge}
          onComplete={(correctAnswers, totalAnswers) =>
            completeChallenge(resolveChallengeOutcome(correctAnswers, totalAnswers))
          }
        />
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
