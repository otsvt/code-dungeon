import Image from "next/image";
import { Link } from "@/shared/i18n/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/features/language";
import { ROUTES } from "@/shared/routes";
import { ASSETS } from "@/shared/assets";

export default function HomePage() {
  const t = useTranslations("MainMenu");

  return (
    <main
      className="h-svh flex-center flex-col bg-center-default"
      style={{ backgroundImage: `url(${ASSETS.background.main})` }}
    >
      <Image src={ASSETS.logo.full} width={300} height={300} alt="" />
      <article className="max-w-3xl w-full py-8 px-12 space-y-4 border-4 border-double border-decore">
        <nav className="flex flex-col gap-y-4 text-2xl">
          <Link href={ROUTES.runSetup}>{t("newRun")}</Link>
          <Link href={ROUTES.dev.spikeTest}>{t("links.spike")}</Link>
          <Link href={ROUTES.dev.loader}>{t("links.loader")}</Link>
          <Link href={ROUTES.game}>{t("links.game")}</Link>
        </nav>
        <LanguageSwitcher />
      </article>
    </main>
  );
}
