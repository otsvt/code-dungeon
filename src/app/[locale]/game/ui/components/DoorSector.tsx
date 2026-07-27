import { SectorWrapper } from "./SectorWrapper";
import { SpriteIcon } from "@/shared/ui/sprite-icon";

interface DoorSectorProps {
  currentRoomNumber: number;
  totalRooms: number;
}

export function DoorSector({ currentRoomNumber }: DoorSectorProps) {
  const displayRoomNumber = currentRoomNumber + 1;

  return (
    <SectorWrapper classNames="font-mono flex items-center gap-x-2">
      <SpriteIcon id="door" className="h-8 w-8 text-accent" />
      <span>{displayRoomNumber}/?</span>
    </SectorWrapper>
  );
}
