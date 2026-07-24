import clsx from "clsx";
import Image from "next/image";

interface EffectIconProps {
  src: string;
  alt: string;
  type: "buff" | "debuff" | "impression";
}

export function EffectIcon({ src, alt, type }: EffectIconProps) {
  const borderClass = {
    buff: "border-effect-buff-stroke",
    debuff: "border-effect-debuff-stroke",
    impression: "border-light",
  }[type];

  return (
    <div className={clsx("rounded-full border-2 bg-effect-buff-bg", borderClass)}>
      <Image src={src} height={58} width={58} alt={alt} />
    </div>
  );
}
