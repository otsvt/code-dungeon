export const BUFFS = [
  {
    id: "removeWrongOption",
    iconPath: "/assets/game/buffs/remove-wrong-option.png",
    nameKey: "buffNames.removeWrongOption",
    descriptionKey: "buffDescriptions.removeWrongOption",
    availableAtStart: true,
  },
  {
    id: "secondChance",
    iconPath: "/assets/game/buffs/second-chance.png",
    nameKey: "buffNames.secondChance",
    descriptionKey: "buffDescriptions.secondChance",
    availableAtStart: true,
  },
  {
    id: "doorInsight",
    iconPath: "/assets/game/buffs/door-insight.png",
    nameKey: "buffNames.doorInsight",
    descriptionKey: "buffDescriptions.doorInsight",
    availableAtStart: true,
  },
  {
    id: "easierNextRoom",
    iconPath: "/assets/game/buffs/easier-next-room.png",
    nameKey: "buffNames.easierNextRoom",
    descriptionKey: "buffDescriptions.easierNextRoom",
    availableAtStart: true,
  },
  {
    id: "skipQuestion",
    iconPath: "/assets/game/buffs/skip-question.png",
    nameKey: "buffNames.skipQuestion",
    descriptionKey: "buffDescriptions.skipQuestion",
    availableAtStart: true,
  },
] as const;

export type Buff = (typeof BUFFS)[number];

export type BuffId = Buff["id"];

export const START_BUFFS = BUFFS.filter((buff) => buff.availableAtStart);

export function getBuffById(buffId: BuffId): Buff | undefined {
  return BUFFS.find((buff) => buff.id === buffId);
}
