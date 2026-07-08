import { ASSETS } from "@/shared/assets";
import Image from "next/image";

export default function Loading() {
  return (
    <main className="h-svh flex-center bg-center-default" style={{ backgroundImage: `url(${ASSETS.background.main})` }}>
      <div className="p-20 rounded-full border-2 border-decore/50">
        <Image src={ASSETS.logo.full} width={500} height={500} alt="" />
      </div>
    </main>
  );
}
