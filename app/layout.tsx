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
  const appUrl = 'https://spin-win-swart.vercel.app';
  const logoUrl = `${appUrl}/casino-logo.svg`;
  const miniAppConfig = {
    version: 'next',  // актуальная версия для Farcaster/Base Mini Apps
    imageUrl: logoUrl,
    button: {
      title: 'Play Now',
      action: {
        type: 'launch_miniapp',
        name: 'Spin and Win on Base',
        url: appUrl,
        splashImageUrl: logoUrl,
        splashBackgroundColor: '#05040d',
      },
    },
  };

  return {
    title: "Spin Win Casino",
    description: "Exciting slot-style game on Base. Spin to win crypto rewards!",
    other: {
      'fc:miniapp': JSON.stringify(miniAppConfig),
      'base:app_id': '697e305ec6a03f3fe39cb607',
    },
  };
}