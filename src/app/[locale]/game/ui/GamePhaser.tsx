import Phaser from "phaser";

import { useEffect, useRef } from "react";
import { PreloadScene } from "../scenes/PreloadScene";
import { GameScene } from "../scenes/GameScene";

export function GamePhaser() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) {
      return;
    }

    gameRef.current = new Phaser.Game({
      type: Phaser.AUTO,
      parent: containerRef.current,
      width: window.innerWidth,
      height: window.innerHeight,
      scene: [PreloadScene, GameScene],
      transparent: true,
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return <div ref={containerRef}></div>;
}
