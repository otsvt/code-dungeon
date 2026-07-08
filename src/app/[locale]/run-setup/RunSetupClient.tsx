"use client";

import { useRunStore } from "@/game";
import { SetupContent, type RunSettings } from "@/features/run-setup";
import { useRouter } from "@/shared/i18n/navigation";
import { ROUTES } from "@/shared/routes";

export function RunSetupClient() {
  const router = useRouter();
  const startRun = useRunStore((state) => state.startRun);

  const handleRunStart = (settings: RunSettings) => {
    startRun(settings);
    router.push(ROUTES.game);
  };

  return <SetupContent onRunStart={handleRunStart} />;
}
