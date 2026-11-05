"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { dictionaries, type Locale, type StoreDictionary } from "@/locales";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dictionary: StoreDictionary;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const LOCALE_KEY = "jgd_store_locale";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("lo");

  useEffect(() => {
    const saved = window.localStorage.getItem(LOCALE_KEY) as Locale | null;
    if (saved && (saved === "lo" || saved === "th" || saved === "en")) {
      setLocaleState(saved);
      document.documentElement.lang = saved;
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(LOCALE_KEY, next);
    document.documentElement.lang = next;
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

