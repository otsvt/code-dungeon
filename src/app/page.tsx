import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="h-svh flex-center flex-col bg-[url('/assets/background/main-bg.png')] bg-center bg-no-repeat bg-cover">
      <Image className="" src="/assets/logo/logo-full.png" width={300} height={300} alt="" />
      <article className="max-w-3xl w-full py-8 px-12 border-4 border-double border-decore">
        <nav className="flex flex-col gap-y-4 text-2xl">
          <Link href="/dev/phaser-spike">Phaser spike</Link>
          <Link href="/dev/loader">Loader</Link>
          <Link href="/game">Game page</Link>
        </nav>
      </article>
    </main>
  );
}
