import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif } from "next/font/google";
import "@/app/globals.css";

const notoSerif = Noto_Serif({
  variable: "--font-noto-serif",
  subsets: ["latin", "cyrillic"],
  fallback: ["sans-serif", "system-ui"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  fallback: ["sans-serif", "system-ui"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
  fallback: ["sans-serif", "system-ui"],
});

export const metadata: Metadata = {
  title: "Code Dungeon",
  description: "Browser programming roguelike game.",
  icons: "/assets/logo/logo-icon.png",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${notoSerif.variable} ${geistMono.variable} ${geistSans.variable} font-noto bg-background text-foreground`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
