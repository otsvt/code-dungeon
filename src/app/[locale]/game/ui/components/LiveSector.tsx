import { useTranslations } from "next-intl";
import { SectorWrapper } from "./SectorWrapper";
import { SpriteIcon } from "@/shared/ui/sprite-icon";

interface LiveSectorProps {
  lives: number;
}

export function LiveSector({ lives }: LiveSectorProps) {
  const t = useTranslations("GameHud");

  return (
    <SectorWrapper>
      <dt>{t("life")}</dt>
      {lives ? (
        <SpriteIcon id="heart" className="h-8 w-8 fill-red-500 stroke-red-500" />
      ) : (
        <SpriteIcon id="heart" className="h-8 w-8 fill-transparent stroke-red-300" />
      )}
    </SectorWrapper>
  );
}
