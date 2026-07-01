import Image from "next/image";

export default function LoaderPage() {
  return (
    <main className="h-svh flex-center bg-[url('/assets/background/main-bg.png')] bg-center bg-no-repeat bg-cover">
      <div className="p-20 rounded-full border-2 border-decore/50">
        <Image src="/assets/logo/logo-full.png" width={500} height={500} alt="" />
      </div>
    </main>
  );
}
