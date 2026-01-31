import type { Metadata } from "next";
import "./globals.css";

import { Ready } from "@/components/Ready";  // Или правильный путь, если файл в другом месте

export const metadata: Metadata = {
  title: "Spin Win Casino",
  description: "Крути и выигрывай!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground">
        <Ready />  {/* Это вызовет ready() на клиенте */}
        {children}
      </body>
    </html>
  );
}