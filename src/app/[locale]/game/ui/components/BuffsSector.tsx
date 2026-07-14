import { Buff } from "@/game";
import { Tooltip } from "@/shared/ui/tooltip";
import { SectorWrapper } from "./SectorWrapper";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface BuffsSectorProps {
  buffs: Buff[];
}

export function BuffsSector({ buffs }: BuffsSectorProps) {
  const t = useTranslations("GameHud");

  return (
    <SectorWrapper>
      <dt className="text-sm text-pale">{t("buffs")}</dt>
      <dd className="flex gap-x-2">
        {buffs.map((buff) => (
          <Tooltip
            key={buff.id}
            triggerClassName="cursor-help"
            content={
              <span className="flex flex-col gap-y-1">
                <span className="font-semibold text-decore">{t(buff.nameKey)}</span>
                <span>{t(buff.descriptionKey)}</span>
              </span>
            }
          >
            <Image src={buff.iconPath} height={80} width={80} alt={t(buff.nameKey)} />
          </Tooltip>
        ))}
      </dd>
    </SectorWrapper>
  );
}
