import { ASSETS } from "@/shared/assets";
import Image from "next/image";

export function UserSector() {
  return (
    <div className="relative top-1/2 -translate-y-1/2 -left-14 -mr-14 h-28 w-28 p-2 rounded-full border-2 border-sandy bg-deep">
      <div className="h-full w-full flex-center rounded-full bg-deep border border-sandy/60">
        <Image src={ASSETS.hud.avatar} height={100} width={100} alt="" />
      </div>
    </div>
  );
}
