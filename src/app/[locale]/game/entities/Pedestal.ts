import Phaser from "phaser";
import { DEPTH_INDEX, SPRITE_NAMES } from "../types/consts";
import { type BuffId } from "@/game";

const FLAME_ANIMATION_KEY = "base-flame-burning";

export class Pedestal extends Phaser.GameObjects.Container {
  private base: Phaser.GameObjects.Image;
  private flame: Phaser.GameObjects.Sprite;

  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale;

    super(scene, width / 2, height * 0.51);

    this.base = scene.add.image(0, 0, SPRITE_NAMES.pedestal);
    this.flame = scene.add.sprite(0, -150, SPRITE_NAMES.flame.base, 0);

    scene.add.existing(this);

    this.base.setScale(0.19);
    this.flame.setScale(5);

    this.add([this.base, this.flame]);

    this.setDepth(DEPTH_INDEX[SPRITE_NAMES.pedestal]);

    this.startFlameAnimation();
  }

  private startFlameAnimation() {
    if (!this.scene.anims.exists(FLAME_ANIMATION_KEY)) {
      this.scene.anims.create({
        key: FLAME_ANIMATION_KEY,
        frames: this.scene.anims.generateFrameNumbers(SPRITE_NAMES.flame.base, {
          start: 0,
          end: 7,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    this.flame.play(FLAME_ANIMATION_KEY);
  }

  public giveBuff(buffId: BuffId) {
    const flameStartY = -150;

    this.scene.tweens.add({
      targets: this.flame,
      scaleX: 7.5,
      scaleY: 7.5,
      y: this.flame.y - 50,
      duration: 300,
      ease: "Sine.easeInOut",
      yoyo: true,
    });

    const buffIcon = this.scene.add.image(0, this.flame.y, buffId);
    this.add(buffIcon);

    buffIcon.setScale(0);
    buffIcon.setAlpha(0);

    this.scene.tweens.add({
      targets: buffIcon,
      scaleX: 0.075,
      scaleY: 0.075,
      alpha: 1,
      y: flameStartY - 50,
      duration: 500,
      ease: "Back.easeOut",
    });
  }
}
