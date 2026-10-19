# CPNVS — sekcja promocji

W paczce są:
- `components/Promotions.tsx` — komponent z filtrowaniem sieci.
- `app/promotions.css` — style sekcji.
- `INSTRUKCJA.md` — integracja z istniejącym projektem.

## Integracja

1. Skopiuj `components/Promotions.tsx` do folderu `components/` w projekcie.
   Jeśli folderu nie ma, utwórz go w katalogu głównym.
2. Skopiuj `app/promotions.css` do folderu `app/`.
3. W `app/layout.tsx` dodaj import na górze pliku:

   `import "./promotions.css";`

4. W `app/page.tsx` dodaj import:

   `import Promotions from "@/components/Promotions";`

5. W JSX strony umieść `<Promotions />` w miejscu, gdzie ma pojawić się sekcja.
   Rekomendacja: po sekcji kalkulatora i metodologii, przed stopką.
6. Zapisz zmiany i zrób commit na GitHubie. Poczekaj na deployment Vercel.

## Uwaga o ofertach

Wszystkie kwoty opisane jako „Przykład” są wyłącznie demonstracyjne i nie oznaczają aktualnych rabatów.
Przed publikacją rzeczywistych ofert należy zweryfikować ich wysokość, daty, limity i regulaminy na stronach sieci.
Linki prowadzą do oficjalnych stron głównych, a nie do potwierdzonych regulaminów konkretnej promocji.
