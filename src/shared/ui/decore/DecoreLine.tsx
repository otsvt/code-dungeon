import clsx from "clsx";

interface DecoreLineProps {
  direction?: "left" | "right";
}

export function DecoreLine({ direction = "left" }: DecoreLineProps) {
  return (
    <div className={clsx("flex items-center", direction === "right" && "flex-row-reverse")}>
      <div className="h-3 w-3 bg-decore rotate-45"></div>
      <div className="h-0.5 w-20 bg-decore/50"></div>
      <div className="h-2 w-2 border border-decore rotate-45"></div>
    </div>
  );
}
