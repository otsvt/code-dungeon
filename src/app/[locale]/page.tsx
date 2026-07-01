import Image from "next/image";
import { Link } from "@/shared/i18n/navigation";
import { useTranslations } from "next-intl";
import { LanguageSwitcher } from "@/feature/language";

export default function HomePage() {
  const t = useTranslations("MainMenu");

  return (
    <main className="h-svh flex-center flex-col bg-[url('/assets/background/main-bg.png')] bg-center bg-no-repeat bg-cover">
      <Image src="/assets/logo/logo-full.png" width={300} height={300} alt="" />
      <article className="max-w-3xl w-full py-8 px-12 space-y-4 border-4 border-double border-decore">
        <nav className="flex flex-col gap-y-4 text-2xl">
          <Link href="/dev/phaser-spike">{t("links.spike")}</Link>
          <Link href="/dev/loader">{t("links.loader")}</Link>
          <Link href="/game">{t("links.game")}</Link>
        </nav>
        <LanguageSwitcher />
      </article>
    </main>
  );
}
