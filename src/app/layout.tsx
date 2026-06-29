import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  fallback: ["sans-serif", "system-ui"],
});

export const metadata: Metadata = {
  title: "Code Dungeon",
  description: "Browser programming roguelike game.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} font-sans bg-background text-foreground`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
