"use client";

import { SetupForm } from "./SetupForm";
import { SetupFooter } from "./SetupFooter";
import { useRunSetup } from "../hooks/useRunSetup";

export function SetupContent() {
  const { poolModeId, selectedTechnologyIds, canStartRun, changePoolModeId, toggleCustomTechnologyId } = useRunSetup();

  const startRun = () => {
    console.log({
      poolModeId,
      technologyIds: selectedTechnologyIds,
    });
  };

  return (
    <>
      <SetupForm
        poolModeId={poolModeId}
        selectedTechnologyIds={selectedTechnologyIds}
        changePoolModeId={changePoolModeId}
        toggleCustomTechnologyId={toggleCustomTechnologyId}
      />
      <SetupFooter canStartRun={canStartRun} startRun={startRun} />
    </>
  );
}
