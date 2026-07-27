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

export type Debuff = (typeof DEBUFFS)[number];
export type DebuffId = Debuff["id"];

export function getDebuffById(debuffId: DebuffId): Debuff | undefined {
  return DEBUFFS.find((debuff) => debuff.id === debuffId);
}
