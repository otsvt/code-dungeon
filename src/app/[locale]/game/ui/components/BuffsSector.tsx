import {
  type ActiveEffect,
  type BuffId,
  type DebuffId,
  getBuffById,
  getDebuffById,
} from "@/game";
import { Tooltip } from "@/shared/ui/tooltip";
import { SectorWrapper } from "./SectorWrapper";
import { useTranslations } from "next-intl";
import { EffectIcon } from "@/entities/effect";

interface BuffsSectorProps {
  buffs: ActiveEffect<BuffId>[];
  debuffs: ActiveEffect<DebuffId>[];
}

export function BuffsSector({ buffs, debuffs }: BuffsSectorProps) {
  const t = useTranslations("GameHud");

  return (
    <SectorWrapper classNames="w-120 after:absolute after:bottom-2 after:h-px after:left-2 after:right-0 after:bg-sandy-low">
      <div className="h-full flex items-center gap-x-2 overflow-visible">
        {buffs.map((activeBuff) => {
          const buff = getBuffById(activeBuff.id);

          if (!buff) {
            return null;
          }

          return (
            <Tooltip
              key={buff.id}
              triggerClassName="buff-icon-arrival relative cursor-help"
              content={
                <span className="flex flex-col gap-y-1">
                  <span className="font-semibold text-decore">{t(buff.nameKey)}</span>
                  <span>{t(buff.descriptionKey)}</span>
                  {activeBuff.stacks > 1 && <span>×{activeBuff.stacks}</span>}
                </span>
              }
            >
              <EffectIcon src={buff.iconPath} alt={t(buff.nameKey)} type="buff" />
              {activeBuff.stacks > 1 && (
                <span className="absolute -right-1 -bottom-1 min-w-5 rounded-full bg-deep px-1 text-center text-xs text-decore">
                  {activeBuff.stacks}
                </span>
              )}
            </Tooltip>
          );
        })}
        {debuffs.map((activeDebuff) => {
          const debuff = getDebuffById(activeDebuff.id);

          if (!debuff) {
            return null;
          }

          return (
            <Tooltip
              key={debuff.id}
              triggerClassName="buff-icon-arrival relative cursor-help"
              content={
                <span className="flex flex-col gap-y-1">
                  <span className="font-semibold text-danger-icon">{t(debuff.nameKey)}</span>
                  <span>{t(debuff.descriptionKey)}</span>
                  {activeDebuff.stacks > 1 && <span>×{activeDebuff.stacks}</span>}
                </span>
              }
            >
              <EffectIcon src={debuff.iconPath} alt={t(debuff.nameKey)} type="debuff" />
              {activeDebuff.stacks > 1 && (
                <span className="absolute -right-1 -bottom-1 min-w-5 rounded-full bg-deep px-1 text-center text-xs text-danger-icon">
                  {activeDebuff.stacks}
                </span>
              )}
            </Tooltip>
          );
        })}
        <span data-effect-flight-target aria-hidden="true" className="pointer-events-none h-14.5 w-14.5 shrink-0" />
      </div>
    </SectorWrapper>
  );
}
