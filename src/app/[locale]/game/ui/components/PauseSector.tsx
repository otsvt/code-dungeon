import { usePauseStore } from "@/features/pause-game";
import { SpriteIcon } from "@/shared/ui/sprite-icon";
import { useTranslations } from "next-intl";

export function PauseSector() {
  const t = useTranslations("GameHud.pause");
  const isPaused = usePauseStore((state) => state.isPaused);
  const togglePause = usePauseStore((state) => state.togglePause);

  return (
    <div className="relative top-1/2 -translate-y-1/2 -right-12 -ml-12 h-26 w-26 p-2 rounded-full border-2 border-sandy bg-deep">
      <button
        className="h-full w-full flex-center rounded-full bg-deep border border-sandy/60 group"
        onClick={togglePause}
        aria-label={t(isPaused ? "resumeGame" : "pauseGame")}
      >
        <SpriteIcon
          className="h-8 w-8 text-accent transition-opacity group-hover:text-accent/80"
          id={isPaused ? "play" : "pause"}
        />
      </button>
    </div>
  );
}
