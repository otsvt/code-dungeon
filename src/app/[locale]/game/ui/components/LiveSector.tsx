import { SectorWrapper } from "./SectorWrapper";
import { SpriteIcon } from "@/shared/ui/sprite-icon";

interface LiveSectorProps {
  lives: number;
}

export function LiveSector({ lives }: LiveSectorProps) {
  return (
    <SectorWrapper>
      {lives ? (
        <SpriteIcon id="heart" className="h-8 w-8 fill-red-500 stroke-red-500" />
      ) : (
        <SpriteIcon id="heart" className="h-8 w-8 fill-transparent stroke-red-300" />
      )}
    </SectorWrapper>
  );
}
