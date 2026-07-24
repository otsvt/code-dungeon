export const SCENE_NAMES = {
  game: "GameScene",
  preload: "PreloadScene",
} as const;

export const SPRITE_NAMES = {
  room: "room",
  door: "door",
  hero: "hero",
  pedestal: "pedestal",
  flame: {
    base: "baseFlame",
  },
} as const;

export const DEPTH_INDEX = {
  [SPRITE_NAMES.room]: 1,
  [SPRITE_NAMES.door]: 2,
  [SPRITE_NAMES.pedestal]: 3,
  [SPRITE_NAMES.hero]: 4,
} as const;

export const ASSETS_PATH = {
  [SPRITE_NAMES.room]: "/assets/game/scene.png",
  [SPRITE_NAMES.door]: "/assets/game/door.png",
  [SPRITE_NAMES.pedestal]: "/assets/game/pedestal.png",
  [SPRITE_NAMES.hero]: "/assets/game/hero-sprite.png",
  [SPRITE_NAMES.flame.base]: "/assets/game/flame/red-flame-sprite.png",
} as const;
