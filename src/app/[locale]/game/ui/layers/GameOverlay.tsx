import { useEffect } from "react";
import { useGameUiStore } from "@/game";
import { CurrentRun } from "@/game/types/run";
import { PauseConfirmationMenu } from "../components/PauseConfirmationMenu";
import { PauseMenu } from "../components/PauseMenu";

interface GameOverlayProps {
  currentRun: CurrentRun;
  onRestart: () => void;
  onExitToMenu: () => void;
}

export function GameOverlay({ currentRun, onRestart, onExitToMenu }: GameOverlayProps) {
  const isPaused = useGameUiStore((state) => state.isPaused);
  const confirmation = useGameUiStore((state) => state.confirmation);
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

  if (!isPaused) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-30 p-6 flex-center bg-overlay">
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
  );
}
