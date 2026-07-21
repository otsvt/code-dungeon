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
    <SectorWrapper classNames="w-120 after:absolute after:bottom-2 after:h-px after:left-2 after:right-0 after:bg-sandy-low">
      <div className="h-full flex items-center gap-x-2 overflow-x-auto">
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
            <div className="rounded-full border-2 border-effect-buff-stroke bg-effect-buff-bg">
              <Image src={buff.iconPath} height={54} width={54} alt={t(buff.nameKey)} />
            </div>
          </Tooltip>
        ))}
      </div>
    </SectorWrapper>
  );
}
