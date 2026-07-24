import Phaser from "phaser";
import { DEPTH_INDEX, SPRITE_NAMES } from "../types/consts";

const MIN_DOOR_COUNT = 2;
const MAX_DOOR_COUNT = 4;

const DOOR_ROW_BOTTOM_Y_RATIO = 0.36;
const DOOR_SCALE = 1.08;
const DOOR_GAP = 18;

export class Doors extends Phaser.GameObjects.Container {
  public doorCount = 0;

  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale;

    super(scene, width / 2, height * DOOR_ROW_BOTTOM_Y_RATIO);

    scene.add.existing(this);

    this.setDepth(DEPTH_INDEX[SPRITE_NAMES.door]);
    this.regenerate();
  }

  public regenerate() {
    this.removeAll(true);

    this.doorCount = Phaser.Math.Between(MIN_DOOR_COUNT, MAX_DOOR_COUNT);

    const doorWidth = this.scene.textures.get(SPRITE_NAMES.door).getSourceImage().width * DOOR_SCALE;
    const step = doorWidth + DOOR_GAP;

    for (let index = 0; index < this.doorCount; index += 1) {
      const offsetFromCenter = index - (this.doorCount - 1) / 2;
      const door = this.scene.add.image(offsetFromCenter * step, 0, SPRITE_NAMES.door);

      door.setOrigin(0.5, 1);
      door.setScale(DOOR_SCALE);

      this.add(door);
    }
  }
}
