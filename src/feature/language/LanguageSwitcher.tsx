"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/shared/i18n/navigation";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (nextLocale: "ru" | "en") => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <article className="flex items-center justify-center gap-x-2">
      <button
        type="button"
        onClick={() => changeLanguage("ru")}
        className={locale === "ru" ? "underline" : "opacity-50"}
      >
        RU
      </button>
      <span className="opacity-40">/</span>
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={locale === "en" ? "underline" : "opacity-50"}
      >
        EN
      </button>
    </article>
  );
}
