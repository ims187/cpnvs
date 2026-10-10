import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ceny Paliwa Niżej — ile bez obniżki?",
  description: "Porównaj maksymalne ceny paliw z szacunkową ceną bez rządowego programu CPN.",
  applicationName: "Ceny Paliwa Niżej"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
