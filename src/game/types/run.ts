import { type RunSettings } from "@/features/run-setup";

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
  activeBuffIds: string[];
  activeDebuffIds: string[];
  impression: -1 | 0 | 1;
  status: "created" | "started";
};
