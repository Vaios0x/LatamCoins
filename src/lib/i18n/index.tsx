"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import es from "./locales/es";
import en from "./locales/en";

export type SupportedLocale = "es" | "en";

type Dictionaries = Record<string, string>;

type I18nContextValue = {
  locale: SupportedLocale;
  t: (key: string) => string;
  setLocale: (next: SupportedLocale) => void;
};

const I18N_STORAGE_KEY = "latamcoins_locale";

const dictionaries: Record<SupportedLocale, Dictionaries> = {
  es,
  en,
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children, defaultLocale = "es" }: { children: React.ReactNode; defaultLocale?: SupportedLocale }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(defaultLocale);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(I18N_STORAGE_KEY) as SupportedLocale | null;
      if (saved && (saved === "es" || saved === "en")) {
        setLocaleState(saved);
      } else {
        // Inferir del navegador si no hay preferencia
        const nav = navigator.language.toLowerCase();
        const inferred: SupportedLocale = nav.startsWith("en") ? "en" : "es";
        setLocaleState(inferred);
        localStorage.setItem(I18N_STORAGE_KEY, inferred);
      }
    } catch {
      // Ignorar errores de almacenamiento
    }
  }, []);

  useEffect(() => {
    // Ajustar atributo lang del documento para accesibilidad/SEO
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", locale);
    }
  }, [locale]);

  const setLocale = (next: SupportedLocale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(I18N_STORAGE_KEY, next);
    } catch {
      // noop
    }
  };

  const t = useMemo(() => {
    const dict = dictionaries[locale] ?? dictionaries.es;
    return (key: string) => dict[key] ?? key;
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => ({ locale, t, setLocale }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}


