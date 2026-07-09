import { type RunSettings } from "@/features/run-setup";

export type RoomType = "start" | "battle" | "hr" | "final";

export type CurrentRoom = {
  type: RoomType;
};

export type CurrentRun = {
  id: string;
  settings: RunSettings;
  currentRoom: CurrentRoom;
  status: "created" | "started";
};
