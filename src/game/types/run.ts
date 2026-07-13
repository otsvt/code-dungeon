import { type RunSettings } from "@/features/run-setup";
import { type StartBuffId } from "./buff";

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
  activeBuffIds: StartBuffId[];
  activeDebuffIds: string[];
  startBuffGranted: boolean;
  impression: -1 | 0 | 1;
  status: "created" | "started";
};
