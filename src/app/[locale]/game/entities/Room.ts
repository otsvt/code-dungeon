import Phaser from "phaser";
import { DEPTH_INDEX, SPRITE_NAMES } from "../types/consts";

export class Room extends Phaser.GameObjects.Image {
  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale;

    super(scene, width / 2, height / 2, SPRITE_NAMES.room);

    scene.add.existing(this);

    const scaleY = height / this.height;
    this.setScale(scaleY);
    this.setDepth(DEPTH_INDEX[SPRITE_NAMES.room]);
  }
}
