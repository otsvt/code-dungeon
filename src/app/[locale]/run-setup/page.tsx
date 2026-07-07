import { SetupContent, SetupHeader } from "@/features/run-setup";
import { ASSETS } from "@/shared/assets";

export default function RunSetupPage() {
  return (
    <main className="min-h-svh bg-background">
      <section className="pb-6 relative main-container flex flex-col">
        <div
          className="absolute top-0 inset-x-0 h-120 bg-center-default after:absolute after:inset-0 after:bg-[linear-gradient(to_right,rgb(248,242,236)_0%,rgba(248,242,236,0.7)_5%,transparent_10%,transparent_90%,rgba(248,242,236,0.7)_95%,rgb(248,242,236)_100%)]"
          style={{ backgroundImage: `url(${ASSETS.background.setup})` }}
        />
        <SetupHeader />
        <SetupContent />
      </section>
    </main>
  );
}
