import { Buff } from "@/game";
import { SectorWrapper } from "./SectorWrapper";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface BuffsSectorProps {
  buffs: Buff[];
}

export function BuffsSector({ buffs }: BuffsSectorProps) {
  const t = useTranslations("GameHud");

  return (
    <SectorWrapper classNames="w-120">
      <dt className="text-sm text-pale">{t("buffs")}</dt>
      <dd className="flex gap-x-2">
        {buffs.map((buff) => (
          <Image key={buff.id} src={buff.iconPath} height={80} width={80} alt={t(buff.descriptionKey)} />
        ))}
      </dd>
    </SectorWrapper>
  );
}
