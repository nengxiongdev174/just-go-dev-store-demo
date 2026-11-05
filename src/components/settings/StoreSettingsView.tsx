"use client";

import React, { useState } from "react";
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
import { DEMO_USERS, INITIAL_STORE_CONFIG } from "@/data";
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
  const { locale, setLocale, dictionary } = useLanguage();
  const { theme, setTheme } = useTheme();
  const {
    currency,
    setCurrency,
    user,
    login,
    logout,
    resetSandbox,
  } = useStore();

  const [resetDone, setResetDone] = useState(false);

  const handleReset = () => {
    resetSandbox();
    setResetDone(true);
    setTimeout(() => setResetDone(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Language Selection */}
        <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">
                {dictionary.settings.languageTitle}
              </h3>
              <p className="text-xs text-muted-foreground">
                {dictionary.settings.languageDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {LANGUAGES.map((lang) => {
              const active = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLocale(lang.code)}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    active
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border bg-secondary/40 text-foreground hover:border-primary/40"
                  }`}
                >
                  <div className="text-sm font-bold">{lang.native}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {lang.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Theme Mode */}
        <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              {theme === "dark" ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">
                {dictionary.settings.themeTitle}
              </h3>
              <p className="text-xs text-muted-foreground">
                {dictionary.settings.themeDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                theme === "light"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/40 text-foreground"
              }`}
            >
              <Sun className="w-4 h-4" />
              <span>{dictionary.settings.lightMode}</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                theme === "dark"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-secondary/40 text-foreground"
              }`}
            >
              <Moon className="w-4 h-4" />
              <span>{dictionary.settings.darkMode}</span>
            </button>
          </div>
        </div>

        {/* Currency Switcher */}
        <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-foreground">
                {dictionary.settings.currencyTitle}
              </h3>
              <p className="text-xs text-muted-foreground">
                {dictionary.settings.currencyDesc}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {CURRENCIES.map((cur) => {
              const active = currency === cur.code;
              return (
                <button
                  key={cur.code}
                  type="button"
                  onClick={() => setCurrency(cur.code)}
                  className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    active
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border bg-secondary/40 text-foreground hover:border-primary/40"
                  }`}
                >
                  <div className="text-base font-extrabold">
                    {cur.symbol} {cur.code}
                  </div>
                  <div className="text-[10px] text-muted-foreground truncate">
                    {cur.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Demo Account Role Switcher */}
        <div className="bg-card rounded-3xl border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">
                  {dictionary.settings.accountTitle}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {dictionary.settings.switchRole}
                </p>
              </div>
            </div>
            {user && (
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-500 text-xs font-bold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{dictionary.nav.logout}</span>
              </button>
            )}
          </div>

          <div className="space-y-2">
            {DEMO_USERS.map((demoAcc) => {
              const isCurrent = user?.id === demoAcc.id;
              return (
                <button
                  key={demoAcc.id}
                  type="button"
                  onClick={() => login(demoAcc)}
                  className={`w-full p-3 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                    isCurrent
                      ? "border-primary bg-primary/10"
                      : "border-border bg-secondary/40 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      {demoAcc.avatar}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-foreground">
                        {demoAcc.name}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {demoAcc.email} •{" "}
                        {demoAcc.role === "manager"
                          ? dictionary.auth.managerRole
                          : dictionary.auth.customerRole}
                      </div>
                    </div>
                  </div>
                  {isCurrent && (
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Store Info & Sandbox Reset */}
      <div className="bg-card rounded-3xl border border-border p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0">
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
              : "bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-500/20"
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

