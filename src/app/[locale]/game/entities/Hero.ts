import Phaser from "phaser";
import { DEPTH_INDEX, SPRITE_NAMES } from "../types/consts";

export class Hero extends Phaser.GameObjects.Sprite {
  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale;

    super(scene, width * 0.46, height * 1.2, SPRITE_NAMES.hero, 0);

    scene.add.existing(this);

    this.setOrigin(0.5, 1);
    this.setScale(0.5);
    this.setDepth(DEPTH_INDEX[SPRITE_NAMES.hero]);
  }
}
