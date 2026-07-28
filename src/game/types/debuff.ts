export const DEBUFFS = [
  {
    id: "routeSubstitution",
    iconPath: "/assets/game/debuffs/route-substitution.png",
    nameKey: "debuffNames.routeSubstitution",
    descriptionKey: "debuffDescriptions.routeSubstitution",
  },
  {
    id: "lostTranslation",
    iconPath: "/assets/game/debuffs/lost-translation.png",
    nameKey: "debuffNames.lostTranslation",
    descriptionKey: "debuffDescriptions.lostTranslation",
  },
  {
    id: "glassCeiling",
    iconPath: "/assets/game/debuffs/glass-ceiling.png",
    nameKey: "debuffNames.glassCeiling",
    descriptionKey: "debuffDescriptions.glassCeiling",
  },
  {
    id: "technicalDebt",
    iconPath: "/assets/game/debuffs/technical-debt.png",
    nameKey: "debuffNames.technicalDebt",
    descriptionKey: "debuffDescriptions.technicalDebt",
  },
  {
    id: "undeclaredStack",
    iconPath: "/assets/game/debuffs/undeclared-stack.png",
    nameKey: "debuffNames.undeclaredStack",
    descriptionKey: "debuffDescriptions.undeclaredStack",
  },
  {
    id: "busFactor",
    iconPath: "/assets/game/debuffs/bus-factor.png",
    nameKey: "debuffNames.busFactor",
    descriptionKey: "debuffDescriptions.busFactor",
  },
  {
    id: "reversedWording",
    iconPath: "/assets/game/debuffs/reversed-wording.png",
    nameKey: "debuffNames.reversedWording",
    descriptionKey: "debuffDescriptions.reversedWording",
  },
  {
    id: "crossFunctionalTeam",
    iconPath: "/assets/game/debuffs/cross-functional-team.png",
    nameKey: "debuffNames.crossFunctionalTeam",
    descriptionKey: "debuffDescriptions.crossFunctionalTeam",
  },
] as const;

export const HR_DEBUFFS = [
  {
    id: "buffBan",
    iconPath: "/assets/game/debuffs/buff-ban.png",
    nameKey: "debuffNames.buffBan",
    descriptionKey: "debuffDescriptions.buffBan",
  },
  {
    id: "failedStart",
    iconPath: "/assets/game/debuffs/failed-start.png",
    nameKey: "debuffNames.failedStart",
    descriptionKey: "debuffDescriptions.failedStart",
  },
] as const;

export const ALL_DEBUFFS = [...DEBUFFS, ...HR_DEBUFFS] as const;

export type Debuff = (typeof ALL_DEBUFFS)[number];
export type DebuffId = Debuff["id"];

export function getDebuffById(debuffId: DebuffId): Debuff | undefined {
  return ALL_DEBUFFS.find((debuff) => debuff.id === debuffId);
}

export function isDebuffId(effectId: string): effectId is DebuffId {
  return ALL_DEBUFFS.some((debuff) => debuff.id === effectId);
}
