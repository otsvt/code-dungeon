import Phaser from "phaser";

import { BUFFS } from "@/game";
import { ASSETS_PATH, SCENE_NAMES, SPRITE_NAMES } from "../types/consts";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SCENE_NAMES.preload);
  }

  preload() {
    this.load.image(SPRITE_NAMES.room, ASSETS_PATH[SPRITE_NAMES.room]);
    this.load.image(SPRITE_NAMES.pedestal, ASSETS_PATH[SPRITE_NAMES.pedestal]);

    this.load.spritesheet(SPRITE_NAMES.hero, ASSETS_PATH[SPRITE_NAMES.hero], { frameHeight: 682, frameWidth: 682 });
    this.load.spritesheet(SPRITE_NAMES.flame.base, ASSETS_PATH[SPRITE_NAMES.flame.base], {
      frameHeight: 48,
      frameWidth: 32,
    });

    for (const buff of BUFFS) {
      this.load.image(buff.id, buff.iconPath);
    }
  }
  create() {
    this.scene.start(SCENE_NAMES.game);
  }
}
