import { CurrentRun } from "@/game/types/run";
import { useTranslations } from "next-intl";
import { LiveSector } from "../components/LiveSector";
import { BuffsSector } from "../components/BuffsSector";
import { SectorDecore } from "../components/SectorDecore";
import { UserSector } from "../components/UserSector";
import { ImpressionSector } from "../components/ImpressionSector";
import { PauseSector } from "../components/PauseSector";

interface GameHudProps {
  currentRun: CurrentRun;
  exitToMenu: () => void;
}

export function GameHud({ currentRun, exitToMenu }: GameHudProps) {
  const t = useTranslations("GameHud");

  return (
    <div className="absolute z-20 top-6 left-1/2 -translate-x-1/2 h-25 flex border-2 border-sandy bg-deep text-lg text-background shadow-2xl shadow-deep">
      <UserSector />
      <LiveSector currentLives={currentRun.lives.current} maxLives={currentRun.lives.max} />
      <SectorDecore />
      <BuffsSector buffs={currentRun.activeBuffs} />
      <SectorDecore />
      <ImpressionSector impression={currentRun.impression} />
      <PauseSector />
    </div>
  );
}
