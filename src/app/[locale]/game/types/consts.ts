export const SCENE_NAMES = {
  game: "GameScene",
  preload: "PreloadScene",
} as const;

export const SPRITE_NAMES = {
  room: "room",
  hero: "hero",
  pedestal: "pedestal",
} as const;

export const DEPTH_INDEX = {
  [SPRITE_NAMES.room]: 1,
  [SPRITE_NAMES.pedestal]: 2,
  [SPRITE_NAMES.hero]: 3,
} as const;

export const ASSETS_PATH = {
  [SPRITE_NAMES.room]: "/assets/game/scene.png",
  [SPRITE_NAMES.pedestal]: "/assets/game/pedestal.png",
  [SPRITE_NAMES.hero]: "/assets/game/hero-sprite.png",
} as const;
