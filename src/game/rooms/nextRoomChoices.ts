import { type TechnologyId } from "@/entities/technology";
import { type RoomType } from "../types/run";

const MIN_DOOR_COUNT = 2;
const MAX_DOOR_COUNT = 4;

export type NextRoomType = Exclude<RoomType, "start">;

export type NextRoomChoice =
  | {
      id: string;
      type: "battle";
      technologyId: TechnologyId;
    }
  | {
      id: string;
      type: Exclude<NextRoomType, "battle">;
      technologyId?: never;
    };

type GenerateNextRoomChoicesOptions = {
  currentRoomNumber: number;
  totalRooms: number;
  technologyIds: readonly TechnologyId[];
  random?: () => number;
  createId?: () => string;
};

export function generateNextRoomChoices({
  currentRoomNumber,
  totalRooms,
  technologyIds,
  random = Math.random,
  createId = () => crypto.randomUUID(),
}: GenerateNextRoomChoicesOptions): NextRoomChoice[] {
  if (currentRoomNumber >= totalRooms) {
    return [{ id: createId(), type: "final" }];
  }

  const doorCount =
    MIN_DOOR_COUNT + Math.floor(random() * (MAX_DOOR_COUNT - MIN_DOOR_COUNT + 1));
  const availableTechnologyIds = [...technologyIds];

  if (availableTechnologyIds.length === 0) {
    throw new Error("At least one technology is required to generate next room choices.");
  }

  return Array.from({ length: doorCount }, () => {
    if (availableTechnologyIds.length === 0) {
      availableTechnologyIds.push(...technologyIds);
    }

    const technologyIndex = Math.floor(random() * availableTechnologyIds.length);
    const [technologyId] = availableTechnologyIds.splice(technologyIndex, 1);

    return {
      id: createId(),
      type: "battle",
      technologyId,
    };
  });
}

export function selectRevealedRoomIds(
  choices: readonly NextRoomChoice[],
  revealCount: number,
  random = Math.random,
): Set<string> {
  const availableChoices = [...choices];
  const revealedIds = new Set<string>();
  const safeRevealCount = Math.min(Math.max(0, revealCount), choices.length);

  while (revealedIds.size < safeRevealCount) {
    const index = Math.floor(random() * availableChoices.length);
    const [choice] = availableChoices.splice(index, 1);

    revealedIds.add(choice.id);
  }

  return revealedIds;
}
