import { useTranslations } from "next-intl";
import { InfoCard, SetupForm, SetupHeader } from "@/features/run-setup";
import { ASSETS } from "@/shared/assets";

export default function RunSetupPage() {
  const t = useTranslations("RunSetup");

  return (
    <main className="min-h-svh bg-background">
      <section className="pb-6 relative main-container flex flex-col">
        <div
          className="absolute top-0 inset-x-0 h-120 bg-center-default after:absolute after:inset-0 after:bg-[linear-gradient(to_right,rgb(248,242,236)_0%,rgba(248,242,236,0.7)_5%,transparent_10%,transparent_90%,rgba(248,242,236,0.7)_95%,rgb(248,242,236)_100%)]"
          style={{ backgroundImage: `url(${ASSETS.background.setup})` }}
        />
        <SetupHeader />
        <SetupForm />
        <footer className="relative shrink-0 flex-center gap-x-4">
          <InfoCard title={t("startBonus.title")} description={t("startBonus.description")} />
          <button className="py-4 px-8 border-2 border-decore bg-dark text-2xl font-medium uppercase text-accent">
            {t("actions.startRun")}
          </button>
          <InfoCard title={t("next.title")} description={t("next.description")} />
        </footer>
      </section>
    </main>
  );
}
