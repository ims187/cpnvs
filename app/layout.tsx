import type { Metadata } from "next";
import "./globals.css";
import "./promotions.css";

export const metadata: Metadata = {
  title: "Ceny Paliwa Niżej — ile bez obniżki?",
  description:
    "Porównaj maksymalne ceny paliw z szacunkową ceną bez rządowego programu CPN. Sprawdź również promocje na stacjach paliw.",
  applicationName: "Ceny Paliwa Niżej",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
