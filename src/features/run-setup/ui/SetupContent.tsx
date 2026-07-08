import { SetupHeader } from "./SetupHeader";
import { SetupForm } from "./SetupForm";
import { SetupFooter } from "./SetupFooter";
import { useRunSetup } from "../hooks/useRunSetup";
import { type RunSettings } from "../types/runSetupOptions";

interface SetupContentProps {
  onRunStart: (settings: RunSettings) => void;
}

export function SetupContent({ onRunStart }: SetupContentProps) {
  const { poolModeId, selectedTechnologyIds, canStartRun, changePoolModeId, toggleCustomTechnologyId, getRunSettings } =
    useRunSetup();

  const startRun = () => {
    onRunStart(getRunSettings());
  };

  return (
    <>
      <SetupHeader />
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
