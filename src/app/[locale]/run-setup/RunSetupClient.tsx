"use client";

import { useRunStore } from "@/game";
import { SetupContent } from "@/features/run-setup";

export function RunSetupClient() {
  const startRun = useRunStore((state) => state.startRun);

  return <SetupContent onRunStart={startRun} />;
}
