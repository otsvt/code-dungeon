"use client";

import Phaser from "phaser";

import { useEffect, useRef, useState } from "react";
import { InterviewOverlay } from "./InterviewOverlay";

const COLOR = "#F8F2EC";

export default function PhaserSpikeClient() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isInterview, setIsInterview] = useState<boolean>(false);

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
        this.load.image("pedestal", "/assets/phaser-spike/pedestal-test.png");
        this.load.image("hero-stand", "/assets/phaser-spike/hero-main-stand.png");
        this.load.image("hero-left", "/assets/phaser-spike/hero-main-left.png");
        this.load.image("hero-right", "/assets/phaser-spike/hero-main-right.png");
      }

      create() {
        this.add.image(width / 2, height / 2, "room");

        const leftDoorHitbox = this.add.rectangle(width * 0.38, height * 0.23, 90, 140, 0x00ff00, 0.25);
        const rightDoorHitbox = this.add.rectangle(width * 0.62, height * 0.23, 90, 140, 0x00ff00, 0.25);

        leftDoorHitbox.on("pointerdown", () => {
          // setIsInterview(true);
        });
        rightDoorHitbox.on("pointerdown", () => {
          // setIsInterview(true);
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

        const heroStartY = height;
        const heroFinalY = height * 0.65;
        const heroFinalX = width * 0.48;

        const hero = this.add.image(heroFinalX, heroStartY, "hero-stand");
        hero.setScale(0.22);
        hero.setDepth(10);

        const playHeroEnter = () => {
          let stepIndex = 0;

          const walkTimer = this.time.addEvent({
            delay: 400,
            loop: true,
            callback: () => {
              stepIndex += 1;
              hero.setTexture(stepIndex % 2 === 0 ? "hero-left" : "hero-right");
            },
          });

          this.tweens.add({
            targets: hero,
            y: heroFinalY,
            ease: "Sine.easeInOut",
            duration: 2400,
            onComplete: () => {
              walkTimer.remove(false);
              hero.setTexture("hero-stand");

              leftDoorHitbox.setInteractive();
              rightDoorHitbox.setInteractive();
              setTimeout(() => setIsInterview(true), 500);
            },
          });
        };

        playHeroEnter();
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

  return (
    <div className="relative h-svh overflow-hidden">
      <div ref={containerRef} style={{ backgroundColor: COLOR }} />
      <InterviewOverlay isOpen={isInterview} onClose={() => setIsInterview(false)} />
    </div>
  );
}
