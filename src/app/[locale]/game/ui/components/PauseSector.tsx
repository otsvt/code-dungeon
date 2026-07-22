import { useGameUiStore } from "@/game";
import { SpriteIcon } from "@/shared/ui/sprite-icon";

export function PauseSector() {
  const isPaused = useGameUiStore((state) => state.isPaused);
  const togglePause = useGameUiStore((state) => state.togglePause);

  return (
    <div className="relative top-1/2 -translate-y-1/2 -right-12 -ml-12 h-26 w-26 p-2 rounded-full border-2 border-sandy bg-deep">
      <button className="h-full w-full flex-center rounded-full border border-sandy/60" onClick={togglePause}>
        <SpriteIcon className="h-8 w-8 text-accent" id={isPaused ? "play" : "pause"} />
      </button>
    </div>
  );
}
