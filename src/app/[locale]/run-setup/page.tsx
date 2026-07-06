import { useTranslations } from "next-intl";
import { ASSETS } from "@/shared/assets";
import { DecoreLine, DecoreRhombus } from "@/shared/ui/decore";

export default function RunSetupPage() {
  const t = useTranslations("RunSetup");

  return (
    <main className="min-h-svh bg-background">
      <section className="main-container py-6 flex flex-col gap-y-6">
        <header className="flex flex-col gap-8 items-center">
          <div className="flex items-center gap-x-4">
            <DecoreLine />
            <span className="text-2xl uppercase text-decore">Code dangeon</span>
            <DecoreLine direction="right" />
          </div>
          <h1 className="text-5xl uppercase font-medium">{t("title")}</h1>
          <h2 className="text-2xl text-pale">{t("subtitle")}</h2>
          <div className="h-px w-1/3 bg-decore"></div>
        </header>
        <article className="p-2 grid grid-cols-3 gap-x-4 rounded-xl border border-decore bg-pure">
          <section className="p-4 flex flex-col items-center rounded-xl border border-decore bg-light ">
            <div className="flex items-center gap-x-2">
              <DecoreRhombus />
              <h3 className="text-xl font-medium uppercase">{t("poolMode.title")}</h3>
              <DecoreRhombus />
            </div>
            <p className="text-pale">{t("poolMode.description")}</p>
          </section>
          <section className="p-4 flex flex-col items-center rounded-xl border border-decore bg-light ">
            <div className="flex items-center gap-x-2">
              <DecoreRhombus />
              <h3 className="text-xl font-medium uppercase">{t("technologies.title")}</h3>
              <DecoreRhombus />
            </div>
            <p className="text-pale">{t("technologies.description")}</p>
          </section>
          <section className="p-4 flex flex-col items-center rounded-xl border border-decore bg-light ">
            <div className="flex items-center gap-x-2">
              <DecoreRhombus />
              <h3 className="text-xl font-medium uppercase">{t("difficulty.title")}</h3>
              <DecoreRhombus />
            </div>
          </section>
        </article>
        <footer className="shrink-0 flex-center gap-x-4">
          <article className="w-sm p-4 space-y-2 rounded-xl border border-decore">
            <h3 className="uppercase font-medium">{t("startBonus.title")}</h3>
            <p className="text-pale">{t("startBonus.description")}</p>
          </article>
          <button className="px-8 py-4 border-2 border-decore bg-dark text-2xl font-medium uppercase text-accent">
            {t("actions.startRun")}
          </button>
          <article className="w-sm p-4 space-y-2 rounded-xl border border-decore">
            <h3 className="uppercase font-medium">{t("next.title")}</h3>
            <p className="text-pale">{t("next.description")}</p>
          </article>
        </footer>
      </section>
    </main>
  );
}
