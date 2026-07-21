import { type RunSettings } from "@/features/run-setup";
import { type Buff } from "./buff";

export type RoomType = "start" | "battle" | "hr" | "final";

export type CurrentRoom = {
  type: RoomType;
};

export type Impression = -1 | 0 | 1;

export type CurrentRun = {
  id: string;
  settings: RunSettings;
  currentRoom: CurrentRoom;
  roomNumber: number;
  lives: {
    current: number;
    max: number;
  };
  activeBuffs: Buff[];
  activeDebuffs: string[];
  startBuffGranted: boolean;
  impression: Impression;
  status: "created" | "started";
};
