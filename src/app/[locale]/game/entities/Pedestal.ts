import Phaser from "phaser";
import { DEPTH_INDEX, SPRITE_NAMES } from "../types/consts";

export class Pedestal extends Phaser.GameObjects.Container {
  private base: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale;

    super(scene, width / 2, height * 0.51);

    this.base = scene.add.image(0, 0, SPRITE_NAMES.pedestal);

    scene.add.existing(this);

    this.base.setScale(0.19);
    this.add(this.base);
    this.setDepth(DEPTH_INDEX[SPRITE_NAMES.pedestal]);
  }
}
