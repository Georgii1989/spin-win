import type { Metadata } from "next";
import "./globals.css";

import { Ready } from "@/components/Ready";  // Проверь путь!

// Статический metadata (SEO базовый)
export const metadata: Metadata = {
  title: "Spin Win Casino",
  description: "Exciting slot-style game on Base. Spin to win crypto rewards!",
};

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

// Динамический metadata с fc:miniapp
export async function generateMetadata(): Promise<Metadata> {
  // Выносим объект для читаемости и чтобы легче отлаживать
  const miniAppConfig = {
    version: 'next',  // ← Рекомендую 'next' вместо '1'
    imageUrl: 'https://mqnkgatqwc4pmcvo.public.blob.vercel-storage.com/hero.png', // ← Желательно 3:2 ratio
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
    // Можно расширять другими полями, если нужно
    other: {
      'fc:miniapp': JSON.stringify(miniAppConfig),
    },
  };
}