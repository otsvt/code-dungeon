import { type RunSettings } from "../../domain/run/runSettings";
import { type ChallengeResult } from "../challenge/types";
import { addEffectStacks, consumeEffectStacks, type EffectId } from "../../types/effect";
import { isBuffId, START_BUFFS, type Buff } from "../../types/buff";
import {
  generateNextRoomChoices,
  type NextRoomChoice,
} from "../../rooms/nextRoomChoices";
import { type CurrentRun } from "../../types/run";

const MIN_RUN_ROOMS = 5;
const MAX_RUN_ROOMS = 9;

type RunRandomDependencies = {
  random?: () => number;
  createId?: () => string;
};

export function createRun(
  settings: RunSettings,
  {
    random = Math.random,
    createId = () => crypto.randomUUID(),
  }: RunRandomDependencies = {},
): CurrentRun {
  const totalRooms =
    Math.floor(random() * (MAX_RUN_ROOMS - MIN_RUN_ROOMS + 1)) +
    MIN_RUN_ROOMS;

  return {
    id: createId(),
    settings,
    currentRoom: { type: "start" },
    nextRoomChoices: generateNextRoomChoices({
      currentRoomNumber: 0,
      totalRooms,
      technologyIds: settings.technologyIds,
      random,
      createId,
    }),
    roomNumber: 0,
    totalRooms,
    lives: {
      current: 1,
      max: 1,
    },
    activeBuffs: [],
    activeDebuffs: [],
    resolvedRoomIds: [],
    startBuffGranted: false,
    impression: 0,
    status: "created",
  };
}

export function selectStartBuff(random: () => number = Math.random): Buff {
  const randomIndex = Math.floor(random() * START_BUFFS.length);

  return START_BUFFS[randomIndex] ?? START_BUFFS[0];
}

export function grantStartBuff(
  currentRun: CurrentRun,
  buff: Buff,
): CurrentRun | null {
  if (currentRun.startBuffGranted) {
    return null;
  }

  return {
    ...currentRun,
    activeBuffs: addEffectStacks(currentRun.activeBuffs, buff.id),
    startBuffGranted: true,
  };
}

export function advanceRunToRoom(
  currentRun: CurrentRun,
  choice: NextRoomChoice,
  {
    random = Math.random,
    createId = () => crypto.randomUUID(),
  }: RunRandomDependencies = {},
): CurrentRun | null {
  if (
    !currentRun.nextRoomChoices.some(
      (nextRoomChoice) => nextRoomChoice.id === choice.id,
    )
  ) {
    return null;
  }

  const roomNumber = currentRun.roomNumber + 1;

  return {
    ...currentRun,
    currentRoom: choice,
    nextRoomChoices:
      choice.type === "final"
        ? []
        : generateNextRoomChoices({
            currentRoomNumber: roomNumber,
            totalRooms: currentRun.totalRooms,
            technologyIds: currentRun.settings.technologyIds,
            allowHrRoom: choice.type !== "hr",
            random,
            createId,
          }),
    roomNumber,
    status: "started",
  };
}

export function applyChallengeResult(
  currentRun: CurrentRun,
  result: ChallengeResult,
): CurrentRun | null {
  const currentRoom = currentRun.currentRoom;

  if (
    currentRoom.type !== result.kind ||
    currentRoom.id !== result.roomId ||
    currentRun.resolvedRoomIds.includes(result.roomId)
  ) {
    return null;
  }

  let activeBuffs = currentRun.activeBuffs;
  let activeDebuffs = currentRun.activeDebuffs;

  if (result.reward.kind === "buff") {
    activeBuffs = addEffectStacks(activeBuffs, result.reward.effectId);
  } else if (result.reward.kind === "debuff") {
    activeDebuffs = addEffectStacks(activeDebuffs, result.reward.effectId);
  }

  return {
    ...currentRun,
    activeBuffs,
    activeDebuffs,
    impression:
      result.kind === "battle"
        ? result.outcome === "strong"
          ? 1
          : result.outcome === "weak"
            ? -1
            : 0
        : currentRun.impression,
    resolvedRoomIds: [...currentRun.resolvedRoomIds, result.roomId],
  };
}

export function addRunEffect(
  currentRun: CurrentRun,
  effectId: EffectId,
  stacks = 1,
): CurrentRun {
  if (isBuffId(effectId)) {
    return {
      ...currentRun,
      activeBuffs: addEffectStacks(
        currentRun.activeBuffs,
        effectId,
        stacks,
      ),
    };
  }

  return {
    ...currentRun,
    activeDebuffs: addEffectStacks(
      currentRun.activeDebuffs,
      effectId,
      stacks,
    ),
  };
}

export function consumeRunEffect(
  currentRun: CurrentRun,
  effectId: EffectId,
  stacks = 1,
): CurrentRun {
  if (isBuffId(effectId)) {
    return {
      ...currentRun,
      activeBuffs: consumeEffectStacks(
        currentRun.activeBuffs,
        effectId,
        stacks,
      ),
    };
  }

  return {
    ...currentRun,
    activeDebuffs: consumeEffectStacks(
      currentRun.activeDebuffs,
      effectId,
      stacks,
    ),
  };
}
