import { type RunSettings } from "@/features/run-setup";

export type CurrentRun = {
  id: string;
  settings: RunSettings;
  status: "created" | "started";
};
