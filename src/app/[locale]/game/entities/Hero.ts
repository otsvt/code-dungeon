import Phaser from "phaser";
import { DEPTH_INDEX, SPRITE_NAMES } from "../types/consts";

export class Hero extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale;

    super(scene, width * 0.46, height * 1.2, SPRITE_NAMES.hero, 0);

    scene.add.existing(this);

    this.setOrigin(0.5, 1);
    this.setScale(0.52);
    this.setDepth(DEPTH_INDEX[SPRITE_NAMES.hero]);
  }

  moveTo(x: number, y: number, duration: number): Promise<void> {
    this.setFrame(1);

    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: this,
        x,
        y,
        duration,
        ease: "Sine.easeInOut",
        onUpdate: (tween) => {
          const step = Math.floor(tween.progress * 5);
          const frame = step % 2 === 0 ? 1 : 2;

          this.setFrame(frame);
        },
        onComplete: () => {
          this.setFrame(0);
          resolve();
        },
      });
    });
  }
}
