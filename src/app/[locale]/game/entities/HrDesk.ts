import Phaser from "phaser";

import { type Impression } from "@/game";
import { DEPTH_INDEX, SPRITE_NAMES } from "../types/consts";

const OUTCOME_COLORS: Record<Impression, number> = {
  [-1]: 0xb44c43,
  [0]: 0xe5c398,
  [1]: 0xf4d48c,
};

export class HrDesk extends Phaser.GameObjects.Container {
  private aura: Phaser.GameObjects.Arc;
  private desk: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, variant: "hr" | "final" = "hr") {
    const { width, height } = scene.scale;
    const isFinal = variant === "final";
    const texture = isFinal ? SPRITE_NAMES.finalTable : SPRITE_NAMES.hrTable;

    super(scene, width / 2, height * (isFinal ? 0.48 : 0.55));

    this.aura = scene.add
      .circle(0, -34, 104, 0xe5c398, 0.08)
      .setStrokeStyle(2, 0xe5c398, 0.42)
      .setBlendMode(Phaser.BlendModes.ADD);

    this.desk = scene.add
      .image(0, 0, texture)
      .setDisplaySize(isFinal ? 720 : 520, isFinal ? 480 : 380);

    this.add([this.aura, this.desk]);
    this.sendToBack(this.aura);
    this.setDepth(DEPTH_INDEX[texture]);
    scene.add.existing(this);

    if (!scene.game.device.os.desktop) {
      this.setScale(0.9);
    }
  }

  public playEvaluation(impression: Impression, reducedMotion = false): Promise<void> {
    const color = OUTCOME_COLORS[impression];

    this.aura.setFillStyle(color, 0.16).setStrokeStyle(3, color, 0.85);

    if (reducedMotion) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this.aura,
        scaleX: 1.55,
        scaleY: 1.55,
        alpha: 0,
        duration: 640,
        ease: "Cubic.easeOut",
        yoyo: true,
        onComplete: () => resolve(),
      });
    });
  }
}
