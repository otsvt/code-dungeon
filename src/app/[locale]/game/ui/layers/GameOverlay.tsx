import { useEffect } from "react";
import { useGameUiStore } from "@/game";
import { CurrentRun } from "@/game/types/run";
import { PauseMenu } from "../components/PauseMenu";

interface GameOverlayProps {
  currentRun: CurrentRun;
  onRestart: () => void;
  onExitToMenu: () => void;
}

export function GameOverlay({ currentRun, onRestart, onExitToMenu }: GameOverlayProps) {
  const isPaused = useGameUiStore((state) => state.isPaused);
  const resumeGame = useGameUiStore((state) => state.resumeGame);

  useEffect(() => {
    if (!isPaused) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        resumeGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPaused, resumeGame]);

  if (!isPaused) {
    return null;
  }

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center overflow-y-auto bg-overlay p-6">
      <PauseMenu
        currentRun={currentRun}
        onContinue={resumeGame}
        onRestart={onRestart}
        onExitToMenu={onExitToMenu}
      />
    </div>
  );
}
