"use client";

import { useEffect } from "react";
import { useRunStore } from "@/game";
import { useRouter } from "@/shared/i18n/navigation";
import { ROUTES } from "@/shared/routes";
import { GamePhaser } from "./layers/GamePhaser";
import { GameHud } from "./layers/GameHud";
import { GameOverlay } from "./layers/GameOverlay";

export function GameClient() {
  const router = useRouter();
  const currentRun = useRunStore((state) => state.currentRun);

  useEffect(() => {
    if (!currentRun) {
      router.replace(ROUTES.runSetup);
    }
  }, [currentRun, router]);

  if (!currentRun) {
    return null;
  }

  return (
    <section className="relative h-full w-full overflow-hidden">
      <GamePhaser />
      <GameOverlay />
      <GameHud currentRun={currentRun} />
    </section>
  );
}
