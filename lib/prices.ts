export const priceSnapshot = {
  updatedAt: "2026-10-13",
  sourceLabel: "Monitor Paliw",
  sourceUrl: "https://monitorpaliw.pl/",
  prices: [
    {
      id: "pb95",
      name: "Benzyna 95",
      short: "Pb95",
      current: 7.06,
      exciseReduction: 0.29,
      icon: "95",
      tone: "blue",
    },
    {
      id: "pb98",
      name: "Benzyna 98",
      short: "Pb98",
      current: 7.95,
      exciseReduction: 0.29,
      icon: "98",
      tone: "violet",
    },
    {
      id: "diesel",
      name: "Olej napędowy",
      short: "ON",
      current: 8.02,
      exciseReduction: 0.28,
      icon: "ON",
      tone: "amber",
    },
  ],
} as const;

export function estimateWithoutRelief(
  currentGross: number,
  exciseReduction: number
) {
  return currentGross * (1.23 / 1.08) + exciseReduction * 1.23;
}

export function money(value: number) {
  return new Intl.NumberFormat("pl-PL", {
    style: "currency",
    currency: "PLN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
