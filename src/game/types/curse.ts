export const CURSES = [
  {
    id: "highExpectations",
    iconPath: "/assets/game/debuffs/technical-debt.png",
    nameKey: "curseNames.highExpectations",
    descriptionKey: "curseDescriptions.highExpectations",
  },
] as const;

export type Curse = (typeof CURSES)[number];
export type CurseId = Curse["id"];

export function getCurseById(curseId: CurseId): Curse | undefined {
  return CURSES.find((curse) => curse.id === curseId);
}

export function isCurseId(effectId: string): effectId is CurseId {
  return CURSES.some((curse) => curse.id === effectId);
}
