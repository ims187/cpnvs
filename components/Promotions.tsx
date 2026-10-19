"use client";

import { useMemo, useState } from "react";

type Promotion = {
  id: string;
  network: string;
  title: string;
  discount: string;
  fuel: string;
  conditions: string[];
  tone: string;
  status: "example";
  description: string;
  url: string;
};

const promotions: Promotion[] = [
  {
    id: "orlen",
    network: "ORLEN",
    title: "Rabat z aplikacją ORLEN VITAY",
    discount: "Przykład: −30 gr/l",
    fuel: "Wybrane paliwa",
    conditions: ["Wymagana aplikacja VITAY", "Możliwy limit litrów", "Sprawdź warunki w regulaminie"],
    tone: "orlen",
    status: "example",
    description: "To karta demonstracyjna — nie potwierdza aktywnej promocji.",
    url: "https://www.orlen.pl/",
  },
  {
    id: "bp",
    network: "bp",
    title: "Rabat w aplikacji bp",
    discount: "Przykład: −25 gr/l",
    fuel: "Wybrane paliwa",
    conditions: ["Wymagana aplikacja lub konto", "Oferta może mieć limit", "Sprawdź datę i regulamin"],
    tone: "bp",
    status: "example",
    description: "To karta demonstracyjna — nie potwierdza aktywnej promocji.",
    url: "https://www.bp.com/pl_pl/poland/home.html",
  },
  {
    id: "shell",
    network: "Shell",
    title: "Oferta dla użytkowników Shell ClubSmart",
    discount: "Przykład: −25 gr/l",
    fuel: "Wybrane paliwa",
    conditions: ["Sprawdź dostępność w aplikacji", "Mogą obowiązywać limity", "Szczegóły w regulaminie"],
    tone: "shell",
    status: "example",
    description: "To karta demonstracyjna — nie potwierdza aktywnej promocji.",
    url: "https://www.shell.pl/",
  },
  {
    id: "circle-k",
    network: "Circle K",
    title: "Oferta w programie EXTRA",
    discount: "Przykład: −30 gr/l",
    fuel: "Wybrane paliwa",
    conditions: ["Wymagane konto lub aplikacja", "Oferta może być czasowa", "Sprawdź regulamin"],
    tone: "circle",
    status: "example",
    description: "To karta demonstracyjna — nie potwierdza aktywnej promocji.",
    url: "https://www.circlek.pl/",
  },
  {
    id: "mol",
    network: "MOL",
    title: "Oferty dla uczestników programu lojalnościowego",
    discount: "Sprawdź aktualną ofertę",
    fuel: "Zależnie od promocji",
    conditions: ["Sprawdź aplikację lub stronę", "Zwróć uwagę na limit", "Potwierdź termin obowiązywania"],
    tone: "mol",
    status: "example",
    description: "Karta informacyjna — brak potwierdzonego rabatu.",
    url: "https://molpolska.pl/",
  },
  {
    id: "moya",
    network: "MOYA",
    title: "Promocje i program lojalnościowy",
    discount: "Sprawdź aktualną ofertę",
    fuel: "Zależnie od promocji",
    conditions: ["Sprawdź dostępne oferty", "Warunki mogą różnić się między stacjami", "Potwierdź regulamin"],
    tone: "moya",
    status: "example",
    description: "Karta informacyjna — brak potwierdzonego rabatu.",
    url: "https://moyastacja.pl/",
  },
];

const filters = ["Wszystkie", "ORLEN", "bp", "Shell", "Circle K", "MOL", "MOYA"];

export default function Promotions() {
  const [activeFilter, setActiveFilter] = useState("Wszystkie");

  const visiblePromotions = useMemo(
    () =>
      activeFilter === "Wszystkie"
        ? promotions
        : promotions.filter((p) => p.network.toLowerCase() === activeFilter.toLowerCase()),
    [activeFilter]
  );

  return (
    <section className="cpn-promotions" id="promocje">
      <div className="cpn-promotions__heading">
        <div>
          <p className="cpn-promotions__eyebrow">✳ PROMOCJE NA STACJACH</p>
          <h2>Promocje i rabaty</h2>
          <p className="cpn-promotions__intro">
            Sprawdź, gdzie szukać rabatów na paliwo. Oferty poniżej są przykładami układu,
            a nie potwierdzonymi aktualnymi promocjami.
          </p>
        </div>
        <a className="cpn-promotions__all" href="#promocje">
          Przeglądaj sieci <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="cpn-promotions__filters" aria-label="Filtruj promocje według sieci">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            className={activeFilter === filter ? "is-active" : ""}
            aria-pressed={activeFilter === filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="cpn-promotions__grid">
        {visiblePromotions.map((promotion) => (
          <article
            className={`cpn-promo-card cpn-promo-card--${promotion.tone}`}
            key={promotion.id}
          >
            <div className="cpn-promo-card__top">
              <span className="cpn-promo-card__network">{promotion.network}</span>
              <span className="cpn-promo-card__badge">Przykład / do weryfikacji</span>
            </div>
            <h3>{promotion.title}</h3>
            <p className="cpn-promo-card__discount">{promotion.discount}</p>
            <p className="cpn-promo-card__fuel">{promotion.fuel}</p>
            <ul>
              {promotion.conditions.map((condition) => (
                <li key={condition}>{condition}</li>
              ))}
            </ul>
            <p className="cpn-promo-card__notice">{promotion.description}</p>
            <a href={promotion.url} target="_blank" rel="noreferrer">
              Sprawdź u źródła <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>

      <div className="cpn-promotions__note">
        <span className="cpn-promotions__note-icon" aria-hidden="true">✓</span>
        <div>
          <strong>Jak korzystać z promocji?</strong>
          <p>
            Przed tankowaniem sprawdź datę ważności, wymagane aktywowanie kuponu,
            limit litrów, rodzaj paliwa i regulamin na oficjalnej stronie sieci.
            Rabaty nie są automatycznie doliczane do cen w kalkulatorze CPNVS.
          </p>
        </div>
      </div>
    </section>
  );
}
