import { CurrentRun } from "@/game/types/run";
import { StressSector } from "../components/StressSector";
import { EffectSector } from "../components/EffectSector";
import { SectorDecore } from "../components/SectorDecore";
import { UserSector } from "../components/UserSector";
import { ImpressionSector } from "../components/ImpressionSector";
import { PauseSector } from "../components/PauseSector";

interface GameHudProps {
  currentRun: CurrentRun;
}

export function GameHud({ currentRun }: GameHudProps) {
  return (
    <div className="absolute z-40 top-6 left-1/2 -translate-x-1/2 h-25 flex border-2 border-sandy bg-deep text-lg text-background shadow-xl shadow-deep">
      <UserSector />
      <StressSector
        currentStress={currentRun.stress.current}
        maxStress={currentRun.stress.max}
      />
      <SectorDecore />
      <EffectSector effects={currentRun.activeEffects} />
      <SectorDecore />
      <ImpressionSector impression={currentRun.impression} />
      <SectorDecore />
      <PauseSector />
    </div>
  );
}
