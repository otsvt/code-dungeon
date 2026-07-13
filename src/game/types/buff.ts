export const START_BUFF_IDS = [
  "removeWrongOption",
  "secondChance",
  "doorInsight",
  "easierNextRoom",
  "skipQuestion",
] as const;

export type StartBuffId = (typeof START_BUFF_IDS)[number];
