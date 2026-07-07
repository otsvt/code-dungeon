import { type TechnologyId } from "@/entities/technology";

export type PoolMode = {
  id: "frontend" | "custom";
  iconName: string;
  technologyIds: TechnologyId[];
};

export const POOL_MODES: PoolMode[] = [
  {
    id: "custom",
    technologyIds: [],
    iconName: "lang-custom",
  },
  {
    id: "frontend",
    technologyIds: ["javascript", "typescript", "html", "css", "react", "vue", "git"],
    iconName: "lang-frontend",
  },
] as const;

export type PoolModeId = (typeof POOL_MODES)[number]["id"];
