# Ceny Paliwa Niżej (CPN)

Prosta aplikacja Next.js gotowa do wdrożenia na Vercel.

## Co zawiera
- Porównanie maksymalnych cen Pb95, Pb98 i ON z szacunkiem ceny bez obniżki VAT i akcyzy.
- Kalkulator tankowania z regulowaną liczbą litrów.
- Możliwość ręcznej edycji ceny w interfejsie.
- Responsywny wygląd na telefonie i komputerze.
- Link do źródła danych oraz wyjaśnienie metody obliczeń.

## Uruchomienie lokalnie
Wymagany Node.js 20.9+.

```bash
npm install
npm run dev
```

Otwórz http://localhost:3000.

## Wdrożenie na Vercel
1. Rozpakuj projekt.
2. Wgraj katalog do nowego repozytorium na GitHub.
3. W Vercel wybierz **Add New → Project** i zaimportuj repozytorium.
4. Pozostaw ustawienia wykryte dla Next.js i kliknij **Deploy**.

## Aktualizacja cen
Dane startowe są w `lib/prices.ts`, w obiekcie `priceSnapshot`.
Po publikacji nowego obwieszczenia zmień `updatedAt` i wartości `current`, a następnie wypchnij zmiany na GitHub — Vercel zbuduje nową wersję.

Wartości w pakiecie to ceny maksymalne obowiązujące od 10 października 2026 r. Nie są to średnie ceny wszystkich stacji. Automatyczne pobieranie aktualnych danych nie jest jeszcze skonfigurowane.

## Metoda szacowania
`cena bez obniżki ≈ cena obecna × (1,23 / 1,08) + obniżka akcyzy × 1,23`

Model zakłada niezmieniony koszt paliwa przed podatkami. Nie uwzględnia możliwej reakcji rynku, zmian marż ani zmian urzędowej ceny maksymalnej. Wynik jest szacunkiem informacyjnym, nie oficjalną ceną.
