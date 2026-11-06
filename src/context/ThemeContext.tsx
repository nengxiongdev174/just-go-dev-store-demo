"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "@/context/ToastContext";

type Theme = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const THEME_KEY = "jgd_store_theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = window.localStorage.getItem(THEME_KEY) as Theme | null;
        if (saved === "dark" || saved === "light") {
          return saved;
        }
      } catch {
        // Fallback
      }
    }
    return "light";
  });
  const { showToast } = useToast();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    window.localStorage.setItem(THEME_KEY, next);
    document.documentElement.classList.toggle("dark", next === "dark");
    const lang = document.documentElement.lang || "lo";
    showToast({
      variant: "info",
      title:
        next === "dark"
          ? lang === "lo"
            ? "ປ່ຽນເປັນໂໝດມືດ (Dark Mode)"
            : lang === "th"
            ? "เปลี่ยนเป็นโหมดมืด (Dark Mode)"
            : "Switched to Dark Mode"
          : lang === "lo"
          ? "ປ່ຽນເປັນໂໝດແຈ້ງ (Light Mode)"
          : lang === "th"
          ? "เปลี่ยนเป็นโหมดสว่าง (Light Mode)"
          : "Switched to Light Mode",
    });
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return ctx;
}

