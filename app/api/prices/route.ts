
import { NextResponse } from "next/server";
import { priceSnapshot } from "@/lib/prices";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SOURCE_URL = "https://monitorpaliw.pl/";

const MONTHS: Record<string, string> = {
  stycznia: "01",
  lutego: "02",
  marca: "03",
  kwietnia: "04",
  maja: "05",
  czerwca: "06",
  lipca: "07",
  sierpnia: "08",
  września: "09",
  października: "10",
  listopada: "11",
  grudnia: "12",
};

function cleanHtml(html: string) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&oacute;/gi, "ó")
    .replace(/&ndash;|&#8211;/gi, "–")
    .replace(/\s+/g, " ")
    .trim();
}

function findPrice(text: string, pattern: RegExp) {
  const match = text.match(pattern);
  if (!match) return null;

  const price = Number(match[1].replace(",", "."));
  return Number.isFinite(price) && price >= 3 && price <= 15
    ? price
    : null;
}

function findDate(text: string) {
  const match = text.match(
    /Obowiązują dziś\s*[—–-]\s*[a-ząćęłńóśźż]+,?\s+(\d{1,2})\s+([a-ząćęłńóśźż]+)\s+(\d{4})/i
  );

  if (!match) return null;

  const month = MONTHS[match[2].toLowerCase()];
  if (!month) return null;

  return `${match[3]}-${month}-${match[1].padStart(2, "0")}`;
}

export async function GET() {
  try {
    const response = await fetch(SOURCE_URL, {
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
      headers: {
        "User-Agent": "Mozilla/5.0 CPNVS/1.0",
        Accept: "text/html",
      },
    });

    if (!response.ok) {
      throw new Error(`Źródło zwróciło HTTP ${response.status}`);
    }

    const text = cleanHtml(await response.text());
    const currentSection = text.split("Historia cen maksymalnych")[0] || text;

    const pb95 = findPrice(
      currentSection,
      /Benzyna\s*95[\s\S]{0,100}?(\d+[,.]\d{2})\s*zł\s*\/\s*l/i
    );
    const pb98 = findPrice(
      currentSection,
      /Benzyna\s*98[\s\S]{0,100}?(\d+[,.]\d{2})\s*zł\s*\/\s*l/i
    );
    const diesel = findPrice(
      currentSection,
      /Olej\s+napędowy[\s\S]{0,100}?(\d+[,.]\d{2})\s*zł\s*\/\s*l/i
    );

    const updatedAt = findDate(currentSection);

    if (pb95 === null || pb98 === null || diesel === null || !updatedAt) {
      throw new Error(
        "Nie rozpoznano cen lub daty w HTML źródła. Sprawdź logi."
      );
    }

    return NextResponse.json(
      {
        updatedAt,
        fetchedAt: new Date().toISOString(),
        fallback: false,
        source: SOURCE_URL,
        prices: [
          { id: "pb95", current: pb95 },
          { id: "pb98", current: pb98 },
          { id: "diesel", current: diesel },
        ],
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  } catch (error) {
    console.error("CPNVS price fetch failed:", error);

    return NextResponse.json(
      {
        updatedAt: priceSnapshot.updatedAt,
        fetchedAt: null,
        fallback: true,
        error:
          error instanceof Error ? error.message : "Nieznany błąd",
        source: SOURCE_URL,
        prices: priceSnapshot.prices.map(({ id, current }) => ({
          id,
          current,
        })),
      },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }
}
