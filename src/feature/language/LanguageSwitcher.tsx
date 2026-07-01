"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/shared/i18n/navigation";
import { SpriteIcon } from "@/shared/ui/sprite-icon";

export function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const changeLanguage = (nextLocale: "ru" | "en") => {
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <article className="inline-flex items-center justify-center gap-x-2">
      <button onClick={() => changeLanguage("ru")} className={locale === "ru" ? "" : "opacity-50"}>
        <SpriteIcon className="h-6 w-6" id="flag-ru" />
      </button>
      <span className="opacity-50">/</span>
      <button onClick={() => changeLanguage("en")} className={locale === "en" ? "" : "opacity-50"}>
        <SpriteIcon className="h-6 w-6" id="flag-en" />
      </button>
    </article>
  );
}
