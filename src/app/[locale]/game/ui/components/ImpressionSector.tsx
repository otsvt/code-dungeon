import { useTranslations } from "next-intl";
import { SectorWrapper } from "./SectorWrapper";
import { Impression } from "@/game";
import { ASSETS } from "@/shared/assets";
import { EffectIcon } from "@/entities/effect";

interface ImpressionSectorProps {
  impression: Impression;
}

export function ImpressionSector({ impression }: ImpressionSectorProps) {
  const t = useTranslations("GameHud");

  const impressionKey = impression === -1 ? "weak" : impression === 1 ? "strong" : "neutral";
  const impressionLabel = t(`impressions.${impressionKey}`);

  return (
    <SectorWrapper classNames="font-mono flex items-center gap-x-2 uppercase">
      <EffectIcon src={ASSETS.hud.impressions[impressionKey]} alt={impressionLabel} type="impression" />
      <div className="flex flex-col justify-center gap-y-2">
        <span className="text-base text-background">{t("impression")}</span>
        <span className="font-sans text-xs text-milk">{impressionLabel}</span>
      </div>
    </SectorWrapper>
  );
}
