import { useState } from "react";
import { type TechnologyId } from "@/entities/technology";
import { POOL_MODES } from "../types/runSetupOptions";
import type { RunSettings, PoolModeId } from "../types/runSetupOptions";

const MIN_TECHNOLOGY_NUMBER = 3;

export const useRunSetup = () => {
  const [poolModeId, setPoolModeId] = useState<PoolModeId>("frontend");
  const [customTechnologyIds, setCustomTechnologyIds] = useState<TechnologyId[]>([]);

  const isCustomMode = poolModeId === "custom";

  const selectedPoolMode = POOL_MODES.find((mode) => mode.id === poolModeId);
  const selectedTechnologyIds = isCustomMode ? customTechnologyIds : (selectedPoolMode?.technologyIds ?? []);

  const canStartRun = isCustomMode ? customTechnologyIds.length >= MIN_TECHNOLOGY_NUMBER : true;

  const changePoolModeId = (modeId: PoolModeId) => {
    setPoolModeId(modeId);

    if (modeId === "custom") {
      setCustomTechnologyIds([]);
    }
  };

  const toggleCustomTechnologyId = (technologyId: TechnologyId) => {
    if (!isCustomMode) {
      return;
    }

    setCustomTechnologyIds((currentIds) => {
      if (currentIds.includes(technologyId)) {
        return currentIds.filter((id) => id !== technologyId);
      }

      return [...currentIds, technologyId];
    });
  };

  const getRunSettings = (): RunSettings => {
    return {
      poolModeId,
      technologyIds: selectedTechnologyIds,
    };
  };

  return {
    poolModeId,
    selectedPoolMode,
    selectedTechnologyIds,
    canStartRun,
    changePoolModeId,
    toggleCustomTechnologyId,
    getRunSettings,
  };
};
