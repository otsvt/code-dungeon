import clsx from "clsx";

interface SectorWrapperProps {
  children: React.ReactNode;
  classNames?: string;
}

export function SectorWrapper({ children, classNames }: SectorWrapperProps) {
  return <dl className={clsx("p-4 text-sm text-pale", classNames)}>{children}</dl>;
}
