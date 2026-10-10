
"use client";

import { useMemo, useState } from "react";
import { estimateWithoutRelief, money, priceSnapshot } from "@/lib/prices";

export default function Home() {
  const [showGreeting, setShowGreeting] = useState(true);
  const [litres, setLitres] = useState("50");
  const [prices, setPrices] = useState<Record<string, string>>(
    Object.fromEntries(
      priceSnapshot.prices.map((p) => [p.id, p.current.toFixed(2)])
    )
  );

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
  }).format(new Date(`${priceSnapshot.updatedAt}T12:00:00`));

  return (
    <main className="page-shell">
      {showGreeting && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="greeting-title"
          className="greeting-overlay"
        >
          <div className="greeting-modal">
            <div className="greeting-icon">♥</div>
            <p className="greeting-eyebrow">SPECJALNA WIADOMOŚĆ</p>
            <h2 id="greeting-title">
              Pozdrowienia dla imsfixgodcs2 od motyl3k29
            </h2>
            <button
              className="greeting-button"
              onClick={() => setShowGreeting(false)}
              autoFocus
            >
              Dzięki
            </button>
          </div>
        </div>
      )}

      <nav className="topbar">
        <a className="brand" href="#" aria-label="Ceny Paliwa Niżej">
          <span className="brand-mark">CPN</span>
          <span>
            CENY PALIWA <b>NIŻEJ</b>
          </span>
        </a>
        <span className="status">
          <span className="status-dot" /> PROGRAM CPN
        </span>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" /> POLICZ RÓŻNICĘ
          </p>
          <h1>
            Ile płacisz za paliwo,
            <br />
            <span>a ile bez obniżki?</span>
          </h1>
          <p className="hero-description">
            Zobacz aktualne ceny maksymalne i porównaj je z szacunkiem ceny,
            która mogłaby obowiązywać bez obniżonego VAT-u i akcyzy.
          </p>
          <div className="updated">
            <span className="calendar-icon">↻</span>
            Dane cenowe: {formattedDate}
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="art-orbit orbit-one" />
          <div className="art-orbit orbit-two" />
          <div className="fuel-drop">
            <div className="drop-shine" />
          </div>
          <div className="art-label">
            <span>CPN</span>
            <strong>− VAT</strong>
            <strong>− AKCYZA</strong>
          </div>
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
            <div className="price-current">
              {money(fuel.current)}
              <small>/l</small>
            </div>
            <div className="price-divider" />
            <p className="muted-label">Szacunek bez obniżki</p>
            <div className="price-estimate">
              {money(fuel.without)}
              <small>/l</small>
            </div>
            <div className="saving-pill">
              <span>↓</span> Oszczędzasz {money(fuel.saving)}/l
            </div>
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
                    setPrices((old) => ({
                      ...old,
                      [fuel.id]: event.target.value,
                    }))
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
          <div>
            <p className="eyebrow">KALKULATOR TANKOWANIA</p>
            <h2>Ile zostaje w kieszeni?</h2>
          </div>
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
            <small>
              dla {Math.max(0, Number(litres) || 0)} litrów wybranego zestawu
              paliw
            </small>
          </div>
        </div>
        <div className="tank-breakdown">
          {results.map((fuel) => (
            <div className="tank-row" key={fuel.id}>
              <span className={`mini-dot ${fuel.tone}`} />
              <span className="tank-name">{fuel.name}</span>
              <span className="tank-price">{money(fuel.tankCurrent)}</span>
              <span className="tank-arrow">→</span>
              <span className="tank-price alt">
                {money(fuel.tankWithout)}
              </span>
              <span className="tank-diff">+{money(fuel.tankSaving)}</span>
            </div>
          ))}
          <div className="tank-legend">
            <span>Teraz</span>
            <span>Bez obniżki — szacunek</span>
            <span>Różnica</span>
          </div>
        </div>
      </section>

      <section className="method">
        <div className="method-icon">i</div>
        <div>
          <h3>Jak obliczamy cenę bez obniżki?</h3>
          <p>
            Szacunek przywraca VAT z 8% do 23% oraz dolicza obniżoną akcyzę
            (29 gr/l dla benzyny, 28 gr/l dla diesla). Zakładamy, że cena
            paliwa przed podatkami pozostaje bez zmian.
          </p>
          <p className="disclaimer">
            To wyliczenie orientacyjne, a nie oficjalna cena kontrfaktyczna.
            Rzeczywista cena bez programu mogłaby się różnić m.in. przez zmianę
            cen hurtowych, marż i mechanizmu ceny maksymalnej.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="brand footer-brand">
          <span className="brand-mark">CPN</span>
          <span>
            CENY PALIWA <b>NIŻEJ</b>
          </span>
        </div>
        <div className="footer-meta">
          <span>
            Projekt informacyjny, niezależny od administracji publicznej.
          </span>
          <a
            href={priceSnapshot.sourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            Źródło danych ↗
          </a>
        </div>
      </footer>

      <style jsx>{`
        .greeting-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(10, 25, 17, 0.72);
          backdrop-filter: blur(7px);
        }

        .greeting-modal {
          width: 100%;
          max-width: 430px;
          padding: 36px 28px 28px;
          text-align: center;
          color: #17231f;
          background: #ffffff;
          border: 1px solid #e4eae6;
          border-radius: 24px;
          box-shadow: 0 25px 90px rgba(0, 0, 0, 0.25);
          animation: greeting-in 0.25s ease-out;
        }

        .greeting-icon {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          margin: 0 auto 18px;
          color: #176c4a;
          background: #e4f2e9;
          border-radius: 18px;
          font-size: 30px;
        }

        .greeting-eyebrow {
          margin: 0 0 12px;
          color: #176c4a;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 2px;
        }

        .greeting-modal h2 {
          margin: 0 0 26px;
          font-size: 25px;
          font-weight: 800;
          line-height: 1.35;
          letter-spacing: -0.8px;
          overflow-wrap: anywhere;
        }

        .greeting-button {
          width: 100%;
          padding: 14px 20px;
          color: #ffffff;
          background: #176c4a;
          border: 0;
          border-radius: 12px;
          font: inherit;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.2s, transform 0.2s;
        }

        .greeting-button:hover {
          background: #0e4d35;
          transform: translateY(-1px);
        }

        .greeting-button:focus-visible {
          outline: 3px solid #82cba1;
          outline-offset: 3px;
        }

        @keyframes greeting-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 480px) {
          .greeting-modal {
            padding: 30px 22px 22px;
            border-radius: 20px;
          }

          .greeting-modal h2 {
            font-size: 22px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .greeting-modal {
            animation: none;
          }

          .greeting-button {
            transition: none;
          }
        }
      `}</style>
    </main>
  );
}
