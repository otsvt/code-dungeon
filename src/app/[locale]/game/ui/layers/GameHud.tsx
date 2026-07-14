import { useState } from "react";
import { CurrentRun } from "@/game/types/run";
import { useTranslations } from "next-intl";
import { LiveSector } from "../components/LiveSector";
import { BuffsSector } from "../components/BuffsSector";

interface GameHudProps {
  currentRun: CurrentRun;
}

export function GameHud({ currentRun }: GameHudProps) {
  const t = useTranslations("GameHud");

  const impressionLabel =
    currentRun.impression === -1
      ? t("impressions.weak")
      : currentRun.impression === 1
        ? t("impressions.strong")
        : t("impressions.neutral");

  const [isOpen, setIsOpen] = useState(false);

  const toggleHud = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="absolute left-0 right-0 bottom-10 px-40 z-20 flex justify-center gap-x-3">
      <button onClick={toggleHud} className="absolute bottom-0 left-20 size-16 rounded-full border border-decore">
        <div className="flex-center text-2xl">👤</div>
      </button>
      {isOpen && (
        <div className="w-full p-4 rounded-xl border border-decore bg-background">
          <div className="flex items-center divide-x divide-accent gap-x-2">
            <LiveSector lives={currentRun.lives.current} />
            <BuffsSector buffs={currentRun.activeBuffs} />
            <dl className="p-4 w-120">
              <dt className="text-sm text-pale">{t("buffs")}</dt>
              <dd className="text-lg font-medium">{currentRun.activeBuffs.map((buff) => t(buff.nameKey))}</dd>
            </dl>
            <dl className="p-4 w-120">
              <dt className="text-sm text-pale">{t("debuffs")}</dt>
              <dd className="text-lg font-medium">{t("empty")}</dd>
            </dl>
            <dl className="p-4">
              <dt className="text-sm text-pale">{t("impression")}</dt>
              <dd className="text-lg font-medium">{impressionLabel}</dd>
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}
