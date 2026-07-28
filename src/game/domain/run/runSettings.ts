import { type TechnologyId } from "@/entities/technology";

export type PoolModeId = "frontend" | "custom";

export type RunSettings = {
  poolModeId: PoolModeId;
  technologyIds: TechnologyId[];
};
