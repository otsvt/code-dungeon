import { Link } from "@/shared/i18n/navigation";
import { ROUTES } from "@/shared/routes";
import { DecoreLine } from "@/shared/ui/decore";
import { useTranslations } from "next-intl";

export function SetupHeader() {
  const t = useTranslations("RunSetup");

  return (
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
  );
}
