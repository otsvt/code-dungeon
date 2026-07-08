import { type TechnologyId } from "@/entities/technology";

export type PoolMode = {
  id: "frontend" | "custom";
  iconName: string;
  technologyIds: TechnologyId[];
};

export type RunSettings = {
  poolModeId: PoolModeId;
  technologyIds: TechnologyId[];
};

export const POOL_MODES: PoolMode[] = [
  {
    id: "frontend",
    technologyIds: ["javascript", "typescript", "html", "css", "react", "vue", "git"],
    iconName: "lang-frontend",
  },
  {
    id: "custom",
    technologyIds: [],
    iconName: "lang-custom",
  },
];

export type PoolModeId = (typeof POOL_MODES)[number]["id"];
