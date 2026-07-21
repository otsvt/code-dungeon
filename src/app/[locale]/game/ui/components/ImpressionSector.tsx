import { useTranslations } from "next-intl";
import { SectorWrapper } from "./SectorWrapper";
import { Impression } from "@/game";

interface ImpressionSectorProps {
  impression: Impression;
}

export function ImpressionSector({ impression }: ImpressionSectorProps) {
  const t = useTranslations("GameHud");

  const impressionLabel =
    impression === -1 ? t("impressions.weak") : impression === 1 ? t("impressions.strong") : t("impressions.neutral");

  return (
    <SectorWrapper classNames="font-mono flex items-center gap-x-2 uppercase">
      <div className="h-14 w-14 border rounded-full border-sandy"></div>
      <div className="flex flex-col justify-center gap-y-2">
        <span className="text-base text-background">{t("impression")}</span>
        <span className="font-sans text-xs text-milk">{impressionLabel}</span>
      </div>
    </SectorWrapper>
  );
}
