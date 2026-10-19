
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { estimateWithoutRelief, money, priceSnapshot } from "@/lib/prices";

type FuelId = "pb95" | "pb98" | "diesel";

type ApiResponse = {
  updatedAt: string;
  fallback: boolean;
  error?: string;
  prices: { id: FuelId; current: number }[];
};

export default function Home() {
  const [litres, setLitres] = useState("50");
  const [prices, setPrices] = useState<Record<string, string>>(
    Object.fromEntries(
      priceSnapshot.prices.map((p) => [p.id, p.current.toFixed(2)])
    )
  );
  const [updatedAt, setUpdatedAt] = useState(priceSnapshot.updatedAt);
  const [loading, setLoading] = useState(true);
  const [sourceError, setSourceError] = useState("");

  const refreshPrices = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/prices", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`API zwróciło HTTP ${response.status}`);
      }

      const data = (await response.json()) as ApiResponse;

      if (!Array.isArray(data.prices)) {
        throw new Error("Nieprawidłowa odpowiedź API.");
      }

      const requiredIds: FuelId[] = ["pb95", "pb98", "diesel"];
      const newPrices: Record<string, string> = {};

      for (const id of requiredIds) {
        const item = data.prices.find((p) => p.id === id);

        if (
          !item ||
          !Number.isFinite(item.current) ||
          item.current < 3 ||
          item.current > 15
        ) {
          throw new Error(`Brak prawidłowej ceny dla ${id}.`);
        }

        newPrices[id] = item.current.toFixed(2);
      }

      if (data.fallback) {
        setSourceError(
          `Źródło nie zwróciło świeżych danych. ${data.error ?? "Pokazano ceny awaryjne."}`
        );
      } else {
        setSourceError("");
      }

      setPrices((old) => ({ ...old, ...newPrices }));
      setUpdatedAt(data.updatedAt);
    } catch (error) {
      setSourceError(
        error instanceof Error
          ? error.message
          : "Nie udało się pobrać cen."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshPrices();

    const timer = window.setInterval(() => {
      void refreshPrices();
    }, 15 * 60 * 1000);

    return () => window.clearInterval(timer);
  }, [refreshPrices]);

  const results = useMemo(
    () =>
      priceSnapshot.prices.map((fuel) => {
        const current = Math.max(0, Number(prices[fuel.id]) || 0);
        const without = estimateWithoutRelief(
          current,
          fuel.exciseReduction
        );
        const saving = Math.max(0, without - current);
        const amount = Math.max(0, Number(litres) || 0);

        return {
          ...fuel,
          current,
          without,
          saving,
          tankSaving: saving * amount,
          tankCurrent: current * amount,
          tankWithout: without * amount,
        };
      }),
    [litres, prices]
  );

  const totalSaving = results.reduce(
    (sum, item) => sum + item.tankSaving,
    0
  );

  const formattedDate = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${updatedAt}T12:00:00Z`));

  return (
    <main className="page-shell">
      <nav className="topbar">
        <a className="brand" href="#" aria-label="Ceny Paliwa Niżej — strona główna">
          <span className="brand-mark">CPN</span>
          <span>CENY PALIWA <b>NIŻEJ</b></span>
        </a>
        <span className="status"><span className="status-dot" /> PROGRAM CPN</span>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> POLICZ RÓŻNICĘ</p>
          <h1>Ile płacisz za paliwo,<br /><span>a ile bez obniżki?</span></h1>
          <p className="hero-description">
            Zobacz aktualne ceny maksymalne i porównaj je z szacunkiem ceny,
            która mogłaby obowiązywać bez obniżonego VAT-u i akcyzy.
          </p>

          <div className="updated">
            <span className="calendar-icon">↻</span>
            Dane cenowe: {formattedDate}
            <button
              type="button"
              onClick={() => void refreshPrices()}
              disabled={loading}
              style={{
                marginLeft: 12,
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid currentColor",
                background: "transparent",
                color: "inherit",
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Odświeżam..." : "Odśwież ceny"}
            </button>
          </div>

          {sourceError && (
            <p role="alert" style={{ color: "#c2410c", fontSize: 13 }}>
              {sourceError}
            </p>
          )}
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="fuel-drop"><div className="drop-shine" /></div>
          <div className="art-label"><span>CPN</span><strong>− VAT</strong><strong>− AKCYZA</strong></div>
        </div>
      </section>

      <section className="section-heading">
        <div>
          <p className="eyebrow">PORÓWNANIE CEN</p>
          <h2>Wybierz swoje paliwo</h2>
        </div>
        <span className="unit-note">Wszystkie ceny za 1 litr</span>
      </section>

      <section className="fuel-grid">
        {results.map((fuel) => (
          <article className={`fuel-card ${fuel.tone}`} key={fuel.id}>
            <div className="card-top">
              <div className="fuel-icon">{fuel.icon}</div>
              <span className="fuel-type">{fuel.short}</span>
            </div>
            <h3>{fuel.name}</h3>
            <p className="muted-label">Cena maksymalna z programem</p>
            <div className="price-current">{money(fuel.current)}<small>/l</small></div>
            <div className="price-divider" />
            <p className="muted-label">Szacunek bez obniżki</p>
            <div className="price-estimate">{money(fuel.without)}<small>/l</small></div>
            <div className="saving-pill"><span>↓</span> Oszczędzasz {money(fuel.saving)}/l</div>
            <label className="edit-price">
              <span>Edytuj cenę aktualną</span>
              <div className="input-wrap">
                <input
                  aria-label={`Aktualna cena ${fuel.name}`}
                  type="number"
                  min="0"
                  step="0.01"
                  value={prices[fuel.id]}
                  onChange={(event) =>
                    setPrices((old) => ({ ...old, [fuel.id]: event.target.value }))
                  }
                />
                <span>zł/l</span>
              </div>
            </label>
          </article>
        ))}
      </section>

      <section className="calculator">
        <div className="calculator-heading">
          <div className="calc-icon">↗</div>
          <div><p className="eyebrow">KALKULATOR TANKOWANIA</p><h2>Ile zostaje w kieszeni?</h2></div>
        </div>
        <div className="calculator-body">
          <label className="litres-input">
            <span>Ile litrów tankujesz?</span>
            <div className="input-wrap big-input">
              <input
                aria-label="Liczba litrów"
                type="number"
                min="0"
                max="5000"
                step="1"
                value={litres}
                onChange={(event) => setLitres(event.target.value)}
              />
              <span>litrów</span>
            </div>
          </label>
          <div className="calc-result">
            <span>Szacowana różnica przy tankowaniu</span>
            <strong>{money(totalSaving)}</strong>
            <small>dla {Math.max(0, Number(litres) || 0)} litrów wybranego zestawu paliw</small>
          </div>
        </div>
        <div className="tank-breakdown">
          {results.map((fuel) => (
            <div className="tank-row" key={fuel.id}>
              <span className={`mini-dot ${fuel.tone}`} />
              <span className="tank-name">{fuel.name}</span>
              <span className="tank-price">{money(fuel.tankCurrent)}</span>
              <span className="tank-arrow">→</span>
              <span className="tank-price alt">{money(fuel.tankWithout)}</span>
              <span className="tank-diff">+{money(fuel.tankSaving)}</span>
            </div>
          ))}
          <div className="tank-legend"><span>Teraz</span><span>Bez obniżki — szacunek</span><span>Różnica</span></div>
        </div>
      </section>

      <section className="method">
        <div className="method-icon">i</div>
        <div>
          <h3>Jak obliczamy cenę bez obniżki?</h3>
          <p>
            Szacunek przywraca VAT z 8% do 23% oraz dolicza obniżoną akcyzę
            (29 gr/l dla benzyny, 28 gr/l dla diesla). Zakładamy, że cena paliwa
            przed podatkami pozostaje bez zmian.
          </p>
          <p className="disclaimer">
            To wyliczenie orientacyjne, a nie oficjalna cena kontrfaktyczna.
            Rzeczywista cena bez programu mogłaby się różnić m.in. przez zmianę
            cen hurtowych, marż i mechanizmu ceny maksymalnej.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="brand footer-brand"><span className="brand-mark">CPN</span><span>CENY PALIWA <b>NIŻEJ</b></span></div>
        <div className="footer-meta">
          <span>Projekt informacyjny, niezależny od administracji publicznej.</span>
          <a href={priceSnapshot.sourceUrl} target="_blank" rel="noreferrer">Źródło danych ↗</a>
        </div>
      </footer>
    </main>
  );
}
