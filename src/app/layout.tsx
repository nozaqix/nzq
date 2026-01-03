import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NZQ - Architecting and creating beautiful things",
  description: "Portfolio site for composer and designer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}

