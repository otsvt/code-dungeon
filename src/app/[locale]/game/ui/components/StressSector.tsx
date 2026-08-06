import { useTranslations } from "next-intl";
import { SpriteIcon } from "@/shared/ui/sprite-icon";
import { SectorWrapper } from "./SectorWrapper";

interface StressSectorProps {
  currentStress: number;
  maxStress: number;
}

export function StressSector({ currentStress, maxStress }: StressSectorProps) {
  const t = useTranslations("GameHud");

  return (
    <SectorWrapper classNames="font-mono flex items-center gap-x-2">
      <span>{t("stress")}</span>
      <span>
        {currentStress}/{maxStress}
      </span>
    </SectorWrapper>
  );
}
