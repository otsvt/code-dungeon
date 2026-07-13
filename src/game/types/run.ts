import { type RunSettings } from "@/features/run-setup";
import { type Buff } from "./buff";

export type RoomType = "start" | "battle" | "hr" | "final";

export type CurrentRoom = {
  type: RoomType;
};

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
  impression: -1 | 0 | 1;
  status: "created" | "started";
};
