import Phaser from "phaser";

import { ALL_BUFFS, ALL_DEBUFFS, CURSES } from "@/game";
import { TECHNOLOGIES } from "@/entities/technology";
import {
  ASSETS_PATH,
  getTechnologyAssetPath,
  getTechnologyTextureKey,
  SCENE_NAMES,
  SPRITE_NAMES,
} from "../types/consts";

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super(SCENE_NAMES.preload);
  }

  preload() {
    this.load.image(SPRITE_NAMES.room, ASSETS_PATH[SPRITE_NAMES.room]);
    this.load.image(SPRITE_NAMES.door, ASSETS_PATH[SPRITE_NAMES.door]);
    this.load.image(SPRITE_NAMES.pedestal, ASSETS_PATH[SPRITE_NAMES.pedestal]);
    this.load.image(SPRITE_NAMES.hrTable, ASSETS_PATH[SPRITE_NAMES.hrTable]);
    this.load.image(SPRITE_NAMES.finalTable, ASSETS_PATH[SPRITE_NAMES.finalTable]);

    this.load.spritesheet(SPRITE_NAMES.hero, ASSETS_PATH[SPRITE_NAMES.hero], { frameHeight: 682, frameWidth: 682 });
    for (const flameTexture of Object.values(SPRITE_NAMES.flame)) {
      this.load.spritesheet(flameTexture, ASSETS_PATH[flameTexture], {
        frameHeight: 48,
        frameWidth: 32,
      });
    }

    for (const buff of ALL_BUFFS) {
      this.load.image(buff.id, buff.iconPath);
    }

    for (const debuff of ALL_DEBUFFS) {
      this.load.image(debuff.id, debuff.iconPath);
    }

    for (const curse of CURSES) {
      this.load.image(curse.id, curse.iconPath);
    }

    for (const technology of TECHNOLOGIES) {
      this.load.svg(
        getTechnologyTextureKey(technology.id),
        getTechnologyAssetPath(technology.id),
        { width: 64, height: 64 },
      );
    }
  }
  create() {
    this.scene.start(SCENE_NAMES.game);
  }
}
