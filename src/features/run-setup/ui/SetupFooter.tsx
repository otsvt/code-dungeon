import { useTranslations } from "next-intl";
import { InfoCard } from "./components/InfoCard";
import { TermTooltip } from "@/entities/glossary";

interface SetupFooterProps {
  canStartRun: boolean;
  startRun: () => void;
}

export function SetupFooter({ canStartRun, startRun }: SetupFooterProps) {
  const t = useTranslations("RunSetup");

  return (
    <footer className="relative shrink-0 flex-center gap-x-4">
      <InfoCard
        title={t("startBonus.title")}
        description={t.rich("startBonus.description", {
          gift: (chunks) => <TermTooltip term="gift">{chunks}</TermTooltip>,
        })}
      />
      <button
        disabled={!canStartRun}
        className="py-4 px-8 border-2 border-decore bg-dark text-2xl font-medium uppercase text-accent disabled:opacity-30"
        onClick={startRun}
      >
        {t("actions.startRun")}
      </button>
      <InfoCard title={t("next.title")} description={t("next.description")} />
    </footer>
  );
}
