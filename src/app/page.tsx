import Link from "next/link";

export default function HomePage() {
  return (
    <main className="h-svh flex-center">
      <section className="space-y-10">
        <h1 className="text-5xl font-bold">Code Dungeon</h1>
        <nav className="flex gap-x-4">
          <Link href="/dev/phaser-spike">Phaser spike</Link>
          <Link href="/game">Game page</Link>
        </nav>
      </section>
    </main>
  );
}
