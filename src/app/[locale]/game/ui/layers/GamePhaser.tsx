import Phaser from "phaser";

import { useEffect, useRef } from "react";
import { useGameUiStore } from "@/game";
import { PreloadScene } from "../../scenes/PreloadScene";
import { GameScene } from "../../scenes/GameScene";

export function GamePhaser() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const isPaused = useGameUiStore((state) => state.isPaused);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) {
      return;
    }

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      transparent: true,
      scene: [PreloadScene, GameScene],
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    const game = gameRef.current;

    if (!game) {
      return;
    }

    if (isPaused) {
      game.scene.pause("GameScene");
      return;
    }

    if (game.scene.isPaused("GameScene")) {
      game.scene.resume("GameScene");
    }
  }, [isPaused]);

  return <div ref={containerRef} className="h-full w-full"></div>;
}
