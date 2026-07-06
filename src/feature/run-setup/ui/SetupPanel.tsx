import { DecoreRhombus } from "@/shared/ui/decore";

interface SetupPanelProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export function SetupPanel({ title, description, children }: SetupPanelProps) {
  return (
    <section className="p-4 flex flex-col items-center rounded-xl border border-decore bg-light">
      <div className="flex items-center gap-x-2">
        <DecoreRhombus />
        <h3 className="text-xl font-medium uppercase">{title}</h3>
        <DecoreRhombus />
      </div>
      {description && <p className="text-pale">{description}</p>}
      {children}
    </section>
  );
}
