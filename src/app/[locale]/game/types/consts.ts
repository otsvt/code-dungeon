export const SCENE_NAMES = {
  game: "GameScene",
  preload: "PreloadScene",
} as const;

export const SPRITE_NAMES = {
  room: "room",
} as const;

export const ASSETS_PATH = {
  [SPRITE_NAMES.room]: "/assets/phaser-spike/scene-test.png",
} as const;
