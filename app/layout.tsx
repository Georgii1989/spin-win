import type { Metadata } from "next";
import "./globals.css";

import { Ready } from "@/components/Ready";  // предполагаем, что путь правильный

// Root Layout
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground">
        <Ready />  {/* Клиентский ready hook */}
        {children}
      </body>
    </html>
  );
}

// Динамический metadata (включая fc:miniapp) — единственный источник метаданных
export async function generateMetadata(): Promise<Metadata> {
  const miniAppConfig = {
    version: 'next',  // актуальная версия для Farcaster/Base Mini Apps
    imageUrl: 'https://mqnkgatqwc4pmcvo.public.blob.vercel-storage.com/hero.png',
    button: {
      title: 'Play Now',
      action: {
        type: 'launch_miniapp',
        name: 'Spin and Win on Base',
        url: 'https://spin-win-swart.vercel.app',
        splashImageUrl: 'https://mqnkgatqwc4pmcvo.public.blob.vercel-storage.com/splash.png',
        splashBackgroundColor: '#ffffff',
      },
    },
  };

  return {
    title: "Spin Win Casino",
    description: "Exciting slot-style game on Base. Spin to win crypto rewards!",
    other: {
      'fc:miniapp': JSON.stringify(miniAppConfig),
    },
  };
}