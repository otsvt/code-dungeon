import { type TechnologyId } from "@/entities/technology";
import { type PoolModeId } from "@/game/domain/run/runSettings";

export {
  type PoolModeId,
  type RunSettings,
} from "@/game/domain/run/runSettings";

export type PoolMode = {
  id: PoolModeId;
  iconName: string;
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
