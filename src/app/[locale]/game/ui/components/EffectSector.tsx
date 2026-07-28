import { EffectIcon } from "@/entities/effect";
import {
  getBuffById,
  getDebuffById,
  isBuffId,
  isDebuffId,
  type ActiveEffect,
  type EffectId,
} from "@/game";
import { Tooltip } from "@/shared/ui/tooltip";
import { useTranslations } from "next-intl";
import { SectorWrapper } from "./SectorWrapper";

interface EffectSectorProps {
  effects: ActiveEffect<EffectId>[];
}

function getEffectPresentation(effectId: EffectId) {
  if (isBuffId(effectId)) {
    return {
      effect: getBuffById(effectId),
      type: "buff" as const,
      accentClassName: "text-decore",
    };
  }

  if (isDebuffId(effectId)) {
    return {
      effect: getDebuffById(effectId),
      type: "debuff" as const,
      accentClassName: "text-danger-icon",
    };
  }

  return null;
}

export function EffectSector({ effects }: EffectSectorProps) {
  const t = useTranslations("GameHud");

  return (
    <SectorWrapper classNames="w-160 after:absolute after:bottom-2 after:h-px after:left-2 after:right-0 after:bg-sandy-low">
      <div className="scrollbar-primary h-full overflow-x-auto overflow-y-hidden">
        <div className="flex h-full min-w-full w-max items-center gap-x-2 pr-2">
          {effects.map((activeEffect) => {
            const presentation = getEffectPresentation(activeEffect.id);
            const effect = presentation?.effect;

            if (!presentation || !effect) {
              return null;
            }

            return (
              <span key={effect.id} className="shrink-0">
                <Tooltip
                  triggerClassName="buff-icon-arrival relative cursor-help"
                  content={
                    <span className="flex flex-col gap-y-1">
                      <span
                        className={`font-semibold ${presentation.accentClassName}`}
                      >
                        {t(effect.nameKey)}
                      </span>
                      <span>{t(effect.descriptionKey)}</span>
                    </span>
                  }
                >
                  <EffectIcon
                    src={effect.iconPath}
                    alt={t(effect.nameKey)}
                    type={presentation.type}
                  />
                </Tooltip>
              </span>
            );
          })}
          <span
            data-effect-flight-target
            aria-hidden="true"
            className="pointer-events-none h-14.5 w-14.5 shrink-0"
          />
        </div>
      </div>
    </SectorWrapper>
  );
}
