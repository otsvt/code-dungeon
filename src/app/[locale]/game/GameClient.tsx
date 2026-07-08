"use client";

import { useEffect } from "react";
import { useRunStore } from "@/game";
import { useRouter } from "@/shared/i18n/navigation";
import { ROUTES } from "@/shared/routes";

export function GameClient() {
  const router = useRouter();
  const currentRun = useRunStore((state) => state.currentRun);

  useEffect(() => {
    if (!currentRun) {
      router.replace(ROUTES.runSetup);
    }
  }, [currentRun, router]);

  if (!currentRun) {
    return null;
  }

  return (
    <div className="p-6 border border-decore bg-background/80">
      <h2 className="text-2xl mb-4">Game dev state</h2>

      <div className="space-y-2">
        <p>
          <strong>Run ID:</strong> {currentRun.id}
        </p>
        <p>
          <strong>Status:</strong> {currentRun.status}
        </p>
        <p>
          <strong>Pool mode:</strong> {currentRun.settings.poolModeId}
        </p>
        <div>
          <strong>Technologies:</strong>
          <ul className="list-disc pl-6">
            {currentRun.settings.technologyIds.map((technologyId) => (
              <li key={technologyId}>{technologyId}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
