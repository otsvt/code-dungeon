import { CurrentRun } from "@/game/types/run";
import { useTranslations } from "next-intl";
import { LiveSector } from "../components/LiveSector";
import { BuffsSector } from "../components/BuffsSector";

interface GameHudProps {
  currentRun: CurrentRun;
  exitToMenu: () => void;
}

export function GameHud({ currentRun, exitToMenu }: GameHudProps) {
  const t = useTranslations("GameHud");

  const impressionLabel =
    currentRun.impression === -1
      ? t("impressions.weak")
      : currentRun.impression === 1
        ? t("impressions.strong")
        : t("impressions.neutral");

  return (
    <div className="absolute z-20 left-0 right-0 top-6 px-20 flex items-center gap-x-3">
      <button onClick={exitToMenu} className="default-button">
        {t("menu")}
      </button>
      <div className="flex items-center gap-x-2">
        <LiveSector lives={currentRun.lives.current} />
        <BuffsSector buffs={currentRun.activeBuffs} />
        <dl className="p-4">
          <dt className="text-sm text-pale">{t("debuffs")}</dt>
          <dd className="text-lg font-medium">{t("empty")}</dd>
        </dl>
        <dl className="p-4">
          <dt className="text-sm text-pale">{t("impression")}</dt>
          <dd className="text-lg font-medium">{impressionLabel}</dd>
        </dl>
      </div>
    </div>
  );
}
