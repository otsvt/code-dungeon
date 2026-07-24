import { Buff } from "@/game";
import { Tooltip } from "@/shared/ui/tooltip";
import { SectorWrapper } from "./SectorWrapper";
import { useTranslations } from "next-intl";
import { EffectIcon } from "@/entities/effect";

interface BuffsSectorProps {
  buffs: Buff[];
}

export function BuffsSector({ buffs }: BuffsSectorProps) {
  const t = useTranslations("GameHud");

  return (
    <SectorWrapper classNames="w-120 after:absolute after:bottom-2 after:h-px after:left-2 after:right-0 after:bg-sandy-low">
      <div className="h-full flex items-center gap-x-2 overflow-visible">
        {buffs.map((buff) => (
          <Tooltip
            key={buff.id}
            triggerClassName="buff-icon-arrival cursor-help"
            content={
              <span className="flex flex-col gap-y-1">
                <span className="font-semibold text-decore">{t(buff.nameKey)}</span>
                <span>{t(buff.descriptionKey)}</span>
              </span>
            }
          >
            <EffectIcon src={buff.iconPath} alt={t(buff.nameKey)} type="buff" />
          </Tooltip>
        ))}
        <span data-buff-flight-target aria-hidden="true" className="pointer-events-none h-14.5 w-14.5 shrink-0" />
      </div>
    </SectorWrapper>
  );
}
