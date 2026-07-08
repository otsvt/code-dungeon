import Phaser from "phaser";

import { ASSETS_PATH, SCENE_NAMES, SPRITE_NAMES } from "../types/consts";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SCENE_NAMES.preload);
  }

  preload() {
    this.load.image(SPRITE_NAMES.room, ASSETS_PATH[SPRITE_NAMES.room]);
  }
  create() {
    this.scene.start(SCENE_NAMES.game);
  }
}
