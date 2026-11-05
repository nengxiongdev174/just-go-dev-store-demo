"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Globe,
  Sun,
  Moon,
  Coins,
  RotateCcw,
  CheckCircle2,
  UserCheck,
  Store,
  LogOut,
} from "lucide-react";
import { INITIAL_STORE_CONFIG } from "@/data";
import { type Locale } from "@/locales";
import { type CurrencyCode } from "@/types/store";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useStore } from "@/context/StoreContext";

const LANGUAGES: { code: Locale; title: string; native: string }[] = [
  { code: "lo", title: "Lao (Default)", native: "ພາສາລາວ" },
  { code: "th", title: "Thai", native: "ภาษาไทย" },
  { code: "en", title: "English", native: "English" },
];

const CURRENCIES: { code: CurrencyCode; symbol: string; name: string }[] = [
  { code: "LAK", symbol: "₭", name: "Lao Kip (LAK)" },
  { code: "THB", symbol: "฿", name: "Thai Baht (THB)" },
  { code: "USD", symbol: "$", name: "US Dollar (USD)" },
];

export function StoreSettingsView() {
  const router = useRouter();
  const { locale, setLocale, dictionary } = useLanguage();
  const { theme, setTheme } = useTheme();
  const { currency, setCurrency, user, logout, resetSandbox } = useStore();

  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    resetSandbox();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Currency Selection */}
        <div className="bg-card rounded-3xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                {dictionary.settings.currencyTitle}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {dictionary.settings.currencyDesc}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {CURRENCIES.map((cur) => {
              const active = currency === cur.code;
              return (
                <button
                  key={cur.code}
                  type="button"
                  onClick={() => setCurrency(cur.code)}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    active
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border bg-secondary/40 text-foreground hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${
                        active
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {cur.symbol}
                    </span>
                    <span className="text-xs font-bold">{cur.name}</span>
                  </div>
                  {active && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Language Selection */}
        <div className="bg-card rounded-3xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                {dictionary.settings.languageTitle}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {dictionary.settings.languageDesc}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            {LANGUAGES.map((lang) => {
              const active = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLocale(lang.code)}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    active
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border bg-secondary/40 text-foreground hover:border-primary/40"
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold">{lang.native}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {lang.title}
                    </div>
                  </div>
                  {active && <CheckCircle2 className="w-4 h-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Appearance Mode */}
        <div className="bg-card rounded-3xl border border-border p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
              {theme === "dark" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">
                {dictionary.settings.themeTitle}
              </h3>
              <p className="text-[11px] text-muted-foreground">
                {dictionary.settings.themeDesc}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                theme === "light"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/40 text-foreground"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Sun className="w-4 h-4" />
                {dictionary.settings.lightMode}
              </span>
              {theme === "light" && (
                <CheckCircle2 className="w-4 h-4 text-primary" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all cursor-pointer ${
                theme === "dark"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/40 text-foreground"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Moon className="w-4 h-4" />
                {dictionary.settings.darkMode}
              </span>
              {theme === "dark" && (
                <CheckCircle2 className="w-4 h-4 text-primary" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Session Account & Logout Card */}
      <div className="bg-card rounded-3xl border border-border p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-md shadow-indigo-500/20">
            {user?.avatar ?? "JG"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-foreground">
                {user?.name ?? dictionary.settings.accountTitle}
              </h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/10 text-primary">
                <UserCheck className="w-3 h-3" />
                {user?.role === "manager"
                  ? dictionary.auth.managerRole
                  : dictionary.auth.customerRole}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {user?.email} • {dictionary.settings.logoutDesc}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-rose-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>{dictionary.nav.logout}</span>
        </button>
      </div>

      {/* Sandbox Data Reset Card */}
      <div className="bg-card rounded-3xl border border-border p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-foreground">
              {dictionary.settings.sandboxTitle}
            </h3>
            <p className="text-xs text-muted-foreground">
              {dictionary.settings.sandboxDesc} (
              {INITIAL_STORE_CONFIG.storeName})
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer ${
            resetDone
              ? "bg-emerald-600 text-white"
              : "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
          }`}
        >
          {resetDone ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>{dictionary.settings.resetConfirm}</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              <span>{dictionary.settings.resetBtn}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
