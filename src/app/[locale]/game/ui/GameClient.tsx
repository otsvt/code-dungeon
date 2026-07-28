"use client";

import { useEffect } from "react";
import { useRunStore } from "@/game";
import { useChallengeStore } from "@/features/play-challenge";
import { usePauseStore } from "@/features/pause-game";
import { useRouter } from "@/shared/i18n/navigation";
import { ROUTES } from "@/shared/routes";
import { GamePhaser } from "./layers/GamePhaser";
import { GameHud } from "./layers/GameHud";
import { GameOverlay } from "./layers/GameOverlay";

export function GameClient() {
  const router = useRouter();

  const currentRun = useRunStore((state) => state.currentRun);
  const startRun = useRunStore((state) => state.startRun);
  const resumeGame = usePauseStore((state) => state.resumeGame);
  const resetChallenge = useChallengeStore((state) => state.resetChallenge);

  useEffect(() => {
    if (!currentRun) {
      router.replace(ROUTES.runSetup);
    }
  }, [currentRun, router]);

  if (!currentRun) {
    return null;
  }

  const restartRun = () => {
    resetChallenge();
    startRun(currentRun.settings);
    resumeGame();
  };

  const exitToMenu = () => {
    resetChallenge();
    resumeGame();
    router.replace(ROUTES.home);
  };

  return (
    <section className="relative h-full w-full overflow-hidden">
      <GamePhaser key={currentRun.id} />
      <GameHud currentRun={currentRun} />
      <GameOverlay currentRun={currentRun} onRestart={restartRun} onExitToMenu={exitToMenu} />
    </section>
  );
}
