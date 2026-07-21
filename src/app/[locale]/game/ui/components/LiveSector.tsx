import { SpriteIcon } from "@/shared/ui/sprite-icon";
import { SectorWrapper } from "./SectorWrapper";

interface LiveSectorProps {
  currentLives: number;
  maxLives: number;
}

export function LiveSector({ currentLives, maxLives }: LiveSectorProps) {
  return (
    <SectorWrapper classNames="font-mono flex items-center gap-x-2">
      <SpriteIcon id="heart" className="h-8 w-8 fill-red-500 stroke-red-500" />
      <span>
        {currentLives}/{maxLives}
      </span>
    </SectorWrapper>
  );
}
