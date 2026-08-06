import { type RunSettings } from "../domain/run/runSettings";
import { type ActiveEffect, type EffectId } from "./effect";
import { type NextRoomChoice } from "../rooms/nextRoomChoices";

export type RoomType = "start" | "battle" | "hr" | "final";

export type CurrentRoom = { type: "start" } | NextRoomChoice;

export type Impression = -1 | 0 | 1;

export type FinalRunResult = {
  correctAnswers: number;
  totalAnswers: number;
  accuracyPercent: number;
  requiredAccuracyPercent: number;
  passed: boolean;
};

export type CurrentRun = {
  id: string;
  settings: RunSettings;
  currentRoom: CurrentRoom;
  nextRoomChoices: NextRoomChoice[];
  roomNumber: number;
  totalRooms: number;
  stress: {
    current: number;
    max: number;
  };
  activeEffects: ActiveEffect<EffectId>[];
  resolvedRoomIds: string[];
  hrRoomOffered: boolean;
  startBuffGranted: boolean;
  impression: Impression;
  finalResult: FinalRunResult | null;
  status: "created" | "started" | "completed";
};
