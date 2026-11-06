"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { dictionaries, type Locale, type StoreDictionary } from "@/locales";
import { useToast } from "@/context/ToastContext";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dictionary: StoreDictionary;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const LOCALE_KEY = "jgd_store_locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem(LOCALE_KEY) as Locale | null;
        if (saved && (saved === "lo" || saved === "th" || saved === "en")) {
          return saved;
        }
      } catch {
        // Fallback
      }
    }
    return "lo";
  });
  const { showToast } = useToast();

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(LOCALE_KEY, next);
    document.documentElement.lang = next;
    showToast({
      variant: "info",
      title:
        next === "lo"
          ? "ປ່ຽນພາສາເປັນ ພາສາລາວ (LO)"
          : next === "th"
          ? "เปลี่ยนภาษาเป็น ภาษาไทย (TH)"
          : "Language switched to English (EN)",
    });
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        dictionary: dictionaries[locale],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return ctx;
}

