export const DEBUFFS = [
  {
    id: "timerPressure",
    nameKey: "debuffNames.timerPressure",
    descriptionKey: "debuffDescriptions.timerPressure",
  },
  {
    id: "hiddenDoorInfo",
    nameKey: "debuffNames.hiddenDoorInfo",
    descriptionKey: "debuffDescriptions.hiddenDoorInfo",
  },
  {
    id: "harderNextRoom",
    nameKey: "debuffNames.harderNextRoom",
    descriptionKey: "debuffDescriptions.harderNextRoom",
  },
  {
    id: "extraTechnology",
    nameKey: "debuffNames.extraTechnology",
    descriptionKey: "debuffDescriptions.extraTechnology",
  },
  {
    id: "fewerHints",
    nameKey: "debuffNames.fewerHints",
    descriptionKey: "debuffDescriptions.fewerHints",
  },
] as const;

export type Debuff = (typeof DEBUFFS)[number];
export type DebuffId = Debuff["id"];

export function getDebuffById(debuffId: DebuffId): Debuff | undefined {
  return DEBUFFS.find((debuff) => debuff.id === debuffId);
}
