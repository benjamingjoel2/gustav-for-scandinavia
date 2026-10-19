"use client";

import { useSyncExternalStore } from "react";
import { currencyCodes, type Currency } from "@/config/currency";
import { formatPrice } from "@/lib/currency";

const KEY = "gustav-currency";
const listeners = new Set<() => void>();

function read(): Currency {
  try {
    const value = window.localStorage.getItem(KEY) as Currency | null;
    return value && currencyCodes.includes(value) ? value : "EUR";
  } catch {
    return "EUR";
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useCurrency(): [Currency, (c: Currency) => void] {
  const currency = useSyncExternalStore(subscribe, read, () => "EUR" as Currency);
  const set = (c: Currency) => {
    try {
      window.localStorage.setItem(KEY, c);
    } catch {
      // Storage unavailable; the choice lasts until reload.
    }
    listeners.forEach((l) => l());
  };
  return [currency, set];
}

/** "from €5,400" in the visitor's chosen currency. */
export function Price({ eur, prefix = "from", className = "" }: { eur: number; prefix?: string; className?: string }) {
  const [currency] = useCurrency();
  return (
    <span className={className}>
      {prefix} {formatPrice(eur, currency)}
      {currency !== "EUR" && <span className="sr-only"> (approximate, converted from {formatPrice(eur, "EUR")})</span>}
    </span>
  );
}

export function CurrencySwitcher({ className = "" }: { className?: string }) {
  const [currency, setCurrency] = useCurrency();
  return (
    <label className={`meta inline-flex items-center gap-2 ${className}`}>
      <span>Currency</span>
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className="cursor-pointer border border-current/40 bg-transparent px-2 py-1 font-mono text-xs uppercase"
      >
        {currencyCodes.map((c) => (
          <option key={c} value={c} className="text-ink">
            {c}
          </option>
        ))}
      </select>
    </label>
  );
}
