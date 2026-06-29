"use client";

import Phaser from "phaser";
import { useEffect, useRef } from "react";

const COLOR = "#F8F2EC";

export default function PhaserSpikeClient() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const width = window.innerWidth;
    const height = window.innerHeight;

    class SpikeScene extends Phaser.Scene {
      constructor() {
        super("SpikeScene");
      }

      preload() {
        this.load.image("room", "/assets/phaser-spike/scene-test.png");
        this.load.image("hero", "/assets/phaser-spike/hero-main-stand.png");
        this.load.image("pedestal", "/assets/phaser-spike/pedestal-test.png");
      }

      create() {
        this.add.image(width / 2, height / 2, "room");

        const leftDoorHitbox = this.add.rectangle(width * 0.38, height * 0.23, 90, 140, 0x00ff00, 0.25);
        const rightDoorHitbox = this.add.rectangle(width * 0.62, height * 0.23, 90, 140, 0x00ff00, 0.25);

        leftDoorHitbox.setInteractive();
        rightDoorHitbox.setInteractive();

        leftDoorHitbox.on("pointerdown", () => {
          alert("left door clicked");
        });
        rightDoorHitbox.on("pointerdown", () => {
          alert("right door clicked");
        });

        const pedestal = this.add.image(width * 0.5, height * 0.51, "pedestal");
        pedestal.setScale(0.2);

        const techIcon = this.add.text(width * 0.5, height * 0.4, "JS", {
          fontSize: "48px",
          color: "#facc15",
          fontStyle: "bold",
        });
        techIcon.setOrigin(0.5);

        this.tweens.add({
          targets: techIcon,
          y: height * 0.4 - 20,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: "Sine.easeInOut",
        });

        const hero = this.add.image(width * 0.48, height * 0.65, "hero");
        hero.setScale(0.22);
      }
    }

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width,
      height,
      parent: containerRef.current,
      scene: SpikeScene,
      transparent: true,
    });

    return () => {
      game.destroy(true);
    };
  }, []);

  return <div ref={containerRef} className="h-svh overflow-hidden" style={{ backgroundColor: COLOR }} />;
}
