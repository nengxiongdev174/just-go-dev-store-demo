import { type CurrencyCode } from "@/types/store";
import { INITIAL_STORE_CONFIG } from "@/data/store.mock";

export function formatStorePrice(
  amountInLak: number,
  currency: CurrencyCode,
  rates: Record<CurrencyCode, number> = INITIAL_STORE_CONFIG.exchangeRates
): string {
  const rate = rates[currency] ?? 1;
  const converted = amountInLak * rate;

  if (currency === "LAK") {
    return `₭ ${Math.round(converted).toLocaleString("en-US")}`;
  }
  if (currency === "THB") {
    return `฿ ${Math.round(converted).toLocaleString("en-US")}`;
  }
  return `$ ${converted.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

