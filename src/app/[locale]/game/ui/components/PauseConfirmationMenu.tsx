import clsx from "clsx";
import { useTranslations } from "next-intl";
import { type PauseConfirmation } from "@/features/pause-game";
import { CurrentRun } from "@/game/types/run";
import { DefaultButton } from "@/shared/ui/button";
import { SpriteIcon } from "@/shared/ui/sprite-icon";

interface PauseConfirmationMenuProps {
  confirmation: PauseConfirmation;
  currentRun: CurrentRun;
  onCancel: () => void;
  onConfirm: () => void;
}

export function PauseConfirmationMenu({ confirmation, currentRun, onCancel, onConfirm }: PauseConfirmationMenuProps) {
  const t = useTranslations(`GameHud.pause.confirmations.${confirmation}`);
  const commonT = useTranslations("GameHud.pause.confirmations.common");

  return (
    <section className="relative my-auto h-162.5 w-full max-w-155 shrink-0 overflow-hidden rounded-xs border border-sandy bg-background/98 px-17.5 pt-7 pb-3.5 shadow-pause-menu max-md:h-auto max-md:max-w-xl max-md:px-6 max-md:pt-6">
      <div className="absolute inset-x-0 top-0 h-1.25 bg-danger" />
      <p className="h-5.5 text-center font-mono text-pause-serial font-semibold tracking-pause-serial text-danger">
        {t("serial", { run: currentRun.id })}
      </p>
      <div className="mx-auto mt-4 flex h-18 w-18 items-center justify-center rounded-full border-2 border-danger bg-deep">
        <div className="flex h-13 w-13 items-center justify-center rounded-full border border-danger-inner-border bg-danger-inner">
          <SpriteIcon id="triangle-alert" className="h-7 w-7 text-danger-icon" />
        </div>
      </div>
      <h1
        className={clsx(
          "mt-4 flex h-13.5 items-center justify-center text-center font-noto font-semibold tracking-confirm-title text-dark max-md:text-3xl",
          confirmation === "exit" ? "text-confirm-exit-title" : "text-confirm-restart-title",
        )}
      >
        {t("title")}
      </h1>
      <p className="flex h-14.5 items-center justify-center text-center font-sans text-confirm-description font-medium leading-save-policy text-pale">
        {t("description")}
      </p>
      <div className="mt-3 h-px w-full bg-decore/50" />
      <div className="mt-7.75 space-y-5">
        <DefaultButton onClick={onCancel}>{commonT("stay")}</DefaultButton>
        <DefaultButton variant="secondary" onClick={onConfirm}>
          {t("confirm")}
        </DefaultButton>
      </div>
      <div className="mt-6 flex h-23.5 items-center rounded-xs border border-danger-border bg-danger-surface px-4.5">
        <SpriteIcon
          id={confirmation === "exit" ? "rotate-ccw" : "refresh-cw"}
          className="h-6 w-6 shrink-0 text-danger"
        />
        <p className="ml-4 flex-1 font-sans text-xs font-medium leading-confirm-warning text-pale">{t("warning")}</p>
      </div>

      <p className="mt-7.5 h-4.5 text-center font-mono text-pause-hint font-medium tracking-pause-hint text-pale">
        {commonT("keyboardHint")}
      </p>
    </section>
  );
}
