import clsx from "clsx";

interface DecoreRhombusProps {
  sizeClass?: string;
  type?: "border" | "bg";
}

export function DecoreRhombus({ type = "border", sizeClass = "h-2 w-2" }: DecoreRhombusProps) {
  return <div className={clsx("rotate-45", sizeClass, type === "border" ? "border border-decore" : "bg-decore")}></div>;
}
