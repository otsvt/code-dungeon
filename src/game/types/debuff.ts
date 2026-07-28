export const DEBUFFS = [
  {
    id: "timerPressure",
    iconPath: "/assets/game/debuffs/timer-pressure.svg",
    nameKey: "debuffNames.timerPressure",
    descriptionKey: "debuffDescriptions.timerPressure",
  },
  {
    id: "hiddenDoorInfo",
    iconPath: "/assets/game/debuffs/hidden-door-info.svg",
    nameKey: "debuffNames.hiddenDoorInfo",
    descriptionKey: "debuffDescriptions.hiddenDoorInfo",
  },
  {
    id: "harderNextRoom",
    iconPath: "/assets/game/debuffs/harder-next-room.svg",
    nameKey: "debuffNames.harderNextRoom",
    descriptionKey: "debuffDescriptions.harderNextRoom",
  },
  {
    id: "extraTechnology",
    iconPath: "/assets/game/debuffs/extra-technology.svg",
    nameKey: "debuffNames.extraTechnology",
    descriptionKey: "debuffDescriptions.extraTechnology",
  },
  {
    id: "fewerHints",
    iconPath: "/assets/game/debuffs/fewer-hints.svg",
    nameKey: "debuffNames.fewerHints",
    descriptionKey: "debuffDescriptions.fewerHints",
  },
] as const;

export const HR_DEBUFFS = [
  {
    id: "redFlag",
    iconPath: "/assets/game/debuffs/red-flag.svg",
    nameKey: "debuffNames.redFlag",
    descriptionKey: "debuffDescriptions.redFlag",
  },
  {
    id: "awkwardPause",
    iconPath: "/assets/game/debuffs/awkward-pause.svg",
    nameKey: "debuffNames.awkwardPause",
    descriptionKey: "debuffDescriptions.awkwardPause",
  },
] as const;

export const ALL_DEBUFFS = [...DEBUFFS, ...HR_DEBUFFS] as const;

export type Debuff = (typeof ALL_DEBUFFS)[number];
export type DebuffId = Debuff["id"];

export function getDebuffById(debuffId: DebuffId): Debuff | undefined {
  return ALL_DEBUFFS.find((debuff) => debuff.id === debuffId);
}
