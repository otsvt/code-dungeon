import { useTranslations } from "next-intl";
import { ASSETS } from "@/shared/assets";
import { DecoreLine } from "@/shared/ui/decore";

export default function RunSetupPage() {
  const t = useTranslations("RunSetup");

  return (
    <main className="h-svh bg-background">
      <section className="h-full py-6 flex flex-col main-container">
        <header className="flex items-center gap-x-4">
          <DecoreLine />
          <h1 className="text-3xl uppercase text-decore">Code dangeon</h1>
          <DecoreLine direction="right" />
        </header>
      </section>
    </main>
  );
}
