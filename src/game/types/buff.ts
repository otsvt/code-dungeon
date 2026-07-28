export const BUFFS = [
  {
    id: "noiseSuppression",
    iconPath: "/assets/game/buffs/noise-suppression.png",
    nameKey: "buffNames.noiseSuppression",
    descriptionKey: "buffDescriptions.noiseSuppression",
    availableAtStart: true,
  },
  {
    id: "stackNavigator",
    iconPath: "/assets/game/buffs/stack-navigator.png",
    nameKey: "buffNames.stackNavigator",
    descriptionKey: "buffDescriptions.stackNavigator",
    availableAtStart: true,
  },
  {
    id: "headStart",
    iconPath: "/assets/game/buffs/head-start.png",
    nameKey: "buffNames.headStart",
    descriptionKey: "buffDescriptions.headStart",
    availableAtStart: true,
  },
  {
    id: "deepSpecialization",
    iconPath: "/assets/game/buffs/deep-specialization.png",
    nameKey: "buffNames.deepSpecialization",
    descriptionKey: "buffDescriptions.deepSpecialization",
    availableAtStart: true,
  },
  {
    id: "broadProfile",
    iconPath: "/assets/game/buffs/broad-profile.png",
    nameKey: "buffNames.broadProfile",
    descriptionKey: "buffDescriptions.broadProfile",
    availableAtStart: true,
  },
  {
    id: "refactoring",
    iconPath: "/assets/game/buffs/refactoring.png",
    nameKey: "buffNames.refactoring",
    descriptionKey: "buffDescriptions.refactoring",
    availableAtStart: true,
  },
  {
    id: "stableResult",
    iconPath: "/assets/game/buffs/stable-result.png",
    nameKey: "buffNames.stableResult",
    descriptionKey: "buffDescriptions.stableResult",
    availableAtStart: true,
  },
] as const;

export const HR_BUFFS = [
  {
    id: "debuffImmunity",
    iconPath: "/assets/game/buffs/debuff-immunity.png",
    nameKey: "buffNames.debuffImmunity",
    descriptionKey: "buffDescriptions.debuffImmunity",
  },
  {
    id: "unlowerableReputation",
    iconPath: "/assets/game/buffs/unlowerable-reputation.png",
    nameKey: "buffNames.unlowerableReputation",
    descriptionKey: "buffDescriptions.unlowerableReputation",
  },
] as const;

export const ALL_BUFFS = [...BUFFS, ...HR_BUFFS] as const;

export type Buff = (typeof ALL_BUFFS)[number];

export type BuffId = Buff["id"];

export const START_BUFFS = BUFFS.filter((buff) => buff.availableAtStart);

export function getBuffById(buffId: BuffId): Buff | undefined {
  return ALL_BUFFS.find((buff) => buff.id === buffId);
}

export function isBuffId(effectId: string): effectId is BuffId {
  return ALL_BUFFS.some((buff) => buff.id === effectId);
}
