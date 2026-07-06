import { useTranslations } from "next-intl";
import { InfoCard, SetupPanel } from "@/feature/run-setup";
import { ASSETS } from "@/shared/assets";
import { DecoreLine } from "@/shared/ui/decore";
import { Link } from "@/shared/i18n/navigation";
import { ROUTES } from "@/shared/routes";

export default function RunSetupPage() {
  const t = useTranslations("RunSetup");

  return (
    <main className="min-h-svh bg-background">
      <section className="relative main-container flex flex-col">
        <div
          className="absolute top-0 inset-x-0 h-120 bg-center-default after:absolute after:inset-0 after:bg-[linear-gradient(to_right,rgb(248,242,236)_0%,rgba(248,242,236,0.7)_5%,transparent_10%,transparent_90%,rgba(248,242,236,0.7)_95%,rgb(248,242,236)_100%)]"
          style={{ backgroundImage: `url(${ASSETS.background.setup})` }}
        />
        <header className="relative pt-6 pb-40 flex flex-col gap-8 items-center">
          <Link
            href={ROUTES.home}
            className="absolute left-0 top-6 px-4 py-2 rounded-lg border border-decore bg-pure text-lg font-medium uppercase"
          >
            {t("actions.toMenu")}
          </Link>
          <div className="flex items-center gap-x-4">
            <DecoreLine />
            <span className="text-2xl uppercase text-decore">Code dangeon</span>
            <DecoreLine direction="right" />
          </div>
          <h1 className="text-5xl uppercase font-medium">{t("title")}</h1>
          <h2 className="text-2xl text-pale">{t("subtitle")}</h2>
          <div className="h-px w-1/3 bg-decore"></div>
        </header>
        <article className="relative mb-6 p-2 grid grid-cols-3 gap-x-4 rounded-xl border border-decore bg-pure">
          <SetupPanel title={t("poolMode.title")} description={t("poolMode.description")} />
          <SetupPanel title={t("technologies.title")} description={t("technologies.description")} />
          <SetupPanel title={t("difficulty.title")} />
        </article>
        <footer className="relative shrink-0 flex-center gap-x-4">
          <InfoCard title={t("startBonus.title")} description={t("startBonus.description")} />
          <button className="border-2 border-decore bg-dark px-8 py-4 text-2xl font-medium uppercase text-accent">
            {t("actions.startRun")}
          </button>
          <InfoCard title={t("next.title")} description={t("next.description")} />
        </footer>
      </section>
    </main>
  );
}
