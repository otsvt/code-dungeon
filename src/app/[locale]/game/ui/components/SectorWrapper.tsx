import clsx from "clsx";

interface SectorWrapperProps {
  children: React.ReactNode;
  classNames?: string;
}

export function SectorWrapper({ children, classNames }: SectorWrapperProps) {
  return (
    <section
      className={clsx(
        "relative p-2",
        classNames,
        "before:absolute before:top-2 before:h-px before:left-2 before:right-0 before:bg-sandy-low",
      )}
    >
      {children}
    </section>
  );
}
