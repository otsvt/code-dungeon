import { useTranslations } from "next-intl";
import { usePauseStore } from "@/features/pause-game";
import { CurrentRun } from "@/game/types/run";
import { DefaultButton } from "@/shared/ui/button";
import { SpriteIcon } from "@/shared/ui/sprite-icon";

interface PauseMenuProps {
  currentRun: CurrentRun;
}

export function PauseMenu({ currentRun }: PauseMenuProps) {
  const t = useTranslations("GameHud.pause");
  const resumeGame = usePauseStore((state) => state.resumeGame);
  const openConfirmation = usePauseStore((state) => state.openConfirmation);
  const roomNumber = currentRun.roomNumber + 1;

  return (
    <section className="relative my-auto h-162.5 w-full max-w-155 shrink-0 overflow-hidden rounded-xs border border-sandy bg-background/98 px-17.5 pt-7 pb-3.5 shadow-pause-menu max-md:h-auto max-md:max-w-xl max-md:px-6 max-md:pt-6">
      <div className="absolute inset-x-0 top-0 h-1.25 bg-sandy" />
      <p className="h-5.5 text-center font-mono text-pause-serial font-semibold tracking-pause-serial text-bronze">
        {t("serial", {
          run: currentRun.id,
          room: String(roomNumber).padStart(2, "0"),
        })}
      </p>
      <div className="mx-auto mt-4 flex h-18 w-18 items-center justify-center rounded-full border-2 border-sandy bg-deep">
        <div className="flex h-13 w-13 items-center justify-center rounded-full border border-decore/50 bg-accent/8">
          <SpriteIcon id="pause" className="h-7 w-7 text-accent" />
        </div>
      </div>
      <h1 className="mt-4 flex h-13.5 items-center justify-center font-noto text-pause-title font-semibold tracking-pause-title text-dark max-md:text-3xl">
        {t("title")}
      </h1>
      <p className="flex h-6.5 items-center justify-center text-center font-sans text-xs font-medium text-pale">
        {t("currentState", {
          room: roomNumber,
          totalRooms: "?",
          impression: t(`impressions.${currentRun.impression}`),
          currentStress: currentRun.stress.current,
          maxStress: currentRun.stress.max,
        })}
      </p>
      <div className="mt-4 h-px w-full bg-decore/50" />
      <div className="mt-6.75 space-y-4">
        <DefaultButton onClick={resumeGame}>{t("continue")}</DefaultButton>
        <DefaultButton variant="secondary" onClick={() => openConfirmation("restart")}>
          {t("restart")}
        </DefaultButton>
        <DefaultButton variant="secondary" onClick={() => openConfirmation("exit")}>
          {t("exitToMenu")}
        </DefaultButton>
      </div>
      <div className="mt-5.5 flex h-17 items-center rounded-xs border border-decore/40 bg-accent/10 px-4.5">
        <SpriteIcon id="save" className="h-6 w-6 shrink-0 text-bronze" />
        <p className="ml-4 flex-1 font-sans text-xs font-medium leading-save-policy text-pale">{t("savePolicy")}</p>
      </div>
      <p className="mt-3.5 h-4.5 text-center font-mono text-pause-hint font-medium tracking-pause-hint text-pale">
        {t("keyboardHint")}
      </p>
    </section>
  );
}
