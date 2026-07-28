import { type RunSettings } from "../domain/run/runSettings";
import { type ActiveEffect, type EffectId } from "./effect";
import { type NextRoomChoice } from "../rooms/nextRoomChoices";

export type RoomType = "start" | "battle" | "hr" | "final";

export type CurrentRoom = { type: "start" } | NextRoomChoice;

export type Impression = -1 | 0 | 1;

export type CurrentRun = {
  id: string;
  settings: RunSettings;
  currentRoom: CurrentRoom;
  nextRoomChoices: NextRoomChoice[];
  roomNumber: number;
  totalRooms: number;
  lives: {
    current: number;
    max: number;
  };
  activeEffects: ActiveEffect<EffectId>[];
  resolvedRoomIds: string[];
  hrRoomOffered: boolean;
  startBuffGranted: boolean;
  impression: Impression;
  status: "created" | "started";
};
