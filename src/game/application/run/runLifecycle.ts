import { type RunSettings } from "../../domain/run/runSettings";
import { type ChallengeResult } from "../challenge/types";
import {
  addUniqueEffect,
  removeEffect,
  type EffectId,
} from "../../types/effect";
import { START_BUFFS, type Buff } from "../../types/buff";
import {
  generateNextRoomChoices,
  type NextRoomChoice,
} from "../../rooms/nextRoomChoices";
import { type CurrentRun, type Impression } from "../../types/run";

const MIN_RUN_ROOMS = 5;
const MAX_RUN_ROOMS = 9;

type RunRandomDependencies = {
  random?: () => number;
  createId?: () => string;
};

function resolveNextImpression(
  currentRun: CurrentRun,
  result: ChallengeResult,
): Impression {
  if (result.kind !== "battle") {
    return currentRun.impression;
  }

  let nextImpression: Impression =
    result.outcome === "strong"
      ? 1
      : result.outcome === "weak"
        ? -1
        : 0;

  const activeEffectIds = new Set(
    currentRun.activeEffects.map((effect) => effect.id),
  );

  if (activeEffectIds.has("glassCeiling") && nextImpression === 1) {
    nextImpression = 0;
  }

  if (
    activeEffectIds.has("unlowerableReputation") &&
    nextImpression < currentRun.impression
  ) {
    return currentRun.impression;
  }

  return nextImpression;
}

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
  const nextRoomChoices = generateNextRoomChoices({
    currentRoomNumber: 0,
    totalRooms,
    technologyIds: settings.technologyIds,
    random,
    createId,
  });

  return {
    id: createId(),
    settings,
    currentRoom: { type: "start" },
    nextRoomChoices,
    roomNumber: 0,
    totalRooms,
    stress: {
      current: 0,
      max: 3,
    },
    activeEffects: [],
    resolvedRoomIds: [],
    hrRoomOffered: nextRoomChoices.some((choice) => choice.type === "hr"),
    startBuffGranted: false,
    impression: 0,
    finalResult: null,
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
    activeEffects: addUniqueEffect(currentRun.activeEffects, buff.id),
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
  const hrRoomAlreadyOffered =
    currentRun.hrRoomOffered ||
    currentRun.nextRoomChoices.some(
      (nextRoomChoice) => nextRoomChoice.type === "hr",
    );
  const nextRoomChoices =
    choice.type === "final"
      ? []
      : generateNextRoomChoices({
          currentRoomNumber: roomNumber,
          totalRooms: currentRun.totalRooms,
          technologyIds: currentRun.settings.technologyIds,
          allowHrRoom: !hrRoomAlreadyOffered && choice.type !== "hr",
          random,
          createId,
        });

  return {
    ...currentRun,
    currentRoom: choice,
    nextRoomChoices,
    hrRoomOffered:
      hrRoomAlreadyOffered ||
      choice.type === "hr" ||
      nextRoomChoices.some((nextRoomChoice) => nextRoomChoice.type === "hr"),
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

  const rewardEffectId =
    result.reward.kind === "none" ? null : result.reward.effectId;
  const isNewEffect =
    rewardEffectId !== null &&
    !currentRun.activeEffects.some((effect) => effect.id === rewardEffectId);
  let nextActiveEffects = isNewEffect
    ? addUniqueEffect(currentRun.activeEffects, rewardEffectId)
    : currentRun.activeEffects;
  let nextStress = currentRun.stress;

  if (result.kind === "battle" && result.outcome === "strong") {
    nextStress = {
      ...currentRun.stress,
      current: Math.max(0, currentRun.stress.current - 1),
    };
  }

  if (result.kind === "battle" && result.outcome === "weak") {
    const stressCurrent = currentRun.stress.current + 1;

    if (stressCurrent >= currentRun.stress.max) {
      nextStress = { ...currentRun.stress, current: 0 };
      nextActiveEffects = addUniqueEffect(
        nextActiveEffects,
        "highExpectations",
      );
    } else {
      nextStress = { ...currentRun.stress, current: stressCurrent };
    }
  }

  return {
    ...currentRun,
    activeEffects: nextActiveEffects,
    stress: nextStress,
    impression: resolveNextImpression(currentRun, result),
    finalResult:
      result.kind === "final" ? result.finalResult : currentRun.finalResult,
    resolvedRoomIds: [...currentRun.resolvedRoomIds, result.roomId],
    status: result.kind === "final" ? "completed" : currentRun.status,
  };
}

export function addRunEffect(
  currentRun: CurrentRun,
  effectId: EffectId,
): CurrentRun {
  if (currentRun.activeEffects.some((effect) => effect.id === effectId)) {
    return currentRun;
  }

  return {
    ...currentRun,
    activeEffects: addUniqueEffect(currentRun.activeEffects, effectId),
  };
}

export function consumeRunEffect(
  currentRun: CurrentRun,
  effectId: EffectId,
): CurrentRun {
  return {
    ...currentRun,
    activeEffects: removeEffect(currentRun.activeEffects, effectId),
  };
}
