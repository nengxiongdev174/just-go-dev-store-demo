"use client";

import React from "react";
import {
  ShoppingBag,
  Search,
  PackageCheck,
  SlidersHorizontal,
  Boxes,
  Sun,
  Moon,
  UserCheck,
  LogIn,
  X,
  Sparkles,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useStore } from "@/context/StoreContext";
import { type Locale } from "@/locales";
import { type CurrencyCode } from "@/types/store";

export type StoreTab = "shop" | "orders" | "admin" | "settings";

interface StoreNavbarProps {
  activeTab: StoreTab;
  onSelectTab: (tab: StoreTab) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const LOCALES: { code: Locale; label: string }[] = [
  { code: "lo", label: "ລາວ" },
  { code: "th", label: "ไทย" },
  { code: "en", label: "EN" },
];

const CURRENCIES: CurrencyCode[] = ["LAK", "THB", "USD"];

export function StoreNavbar({
  activeTab,
  onSelectTab,
  searchQuery,
  onSearchChange,
}: StoreNavbarProps) {
  const { locale, setLocale, dictionary } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const {
    cartItemCount,
    orders,
    user,
    currency,
    setCurrency,
    setIsCartOpen,
    setIsLoginModalOpen,
  } = useStore();

  const handleSearchInput = (val: string) => {
    onSearchChange(val);
    if (activeTab !== "shop") {
      onSelectTab("shop");
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-card/90 backdrop-blur-xl border-b border-border transition-colors">
      {/* Top Promo Strip */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span>{dictionary.hero.promoBanner}</span>
            <span className="hidden md:inline text-white/75">•</span>
            <span className="hidden md:inline text-indigo-100">
              {dictionary.hero.freeShippingNote}
            </span>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Currency Switcher */}
            <div className="flex items-center bg-white/15 rounded-lg p-0.5">
              {CURRENCIES.map((cur) => (
                <button
                  key={cur}
                  type="button"
                  onClick={() => setCurrency(cur)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    currency === cur
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-white/85 hover:text-white"
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-white/15 rounded-lg p-0.5">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  type="button"
                  onClick={() => setLocale(loc.code)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                    locale === loc.code
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-white/85 hover:text-white"
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          type="button"
          onClick={() => onSelectTab("shop")}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-foreground">
                {dictionary.brand.name}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                {dictionary.brand.badge}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {dictionary.brand.subtitle}
            </p>
          </div>
        </button>

        {/* Live Search Bar */}
        <div className="relative flex-1 max-w-md min-w-[220px] order-3 lg:order-2 w-full lg:w-auto">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchInput(e.target.value)}
            placeholder={dictionary.nav.searchPlaceholder}
            className="w-full pl-10 pr-9 py-2 text-sm bg-secondary/70 hover:bg-secondary focus:bg-card rounded-xl border border-border focus:border-primary focus:outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchInput("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Navigation Links & Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2 order-2 lg:order-3">
          <nav className="flex items-center bg-secondary/60 p-1 rounded-xl border border-border/60">
            <button
              type="button"
              onClick={() => onSelectTab("shop")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === "shop"
                  ? "bg-card text-primary shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">{dictionary.nav.shop}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("orders")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-card text-primary shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              <span className="hidden sm:inline">{dictionary.nav.orders}</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold">
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("admin")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === "admin"
                  ? "bg-card text-primary shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Boxes className="w-4 h-4" />
              <span className="hidden md:inline">{dictionary.nav.admin}</span>
            </button>

            <button
              type="button"
              onClick={() => onSelectTab("settings")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                activeTab === "settings"
                  ? "bg-card text-primary shadow-xs font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden xl:inline">{dictionary.nav.settings}</span>
            </button>
          </nav>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary text-foreground transition-colors cursor-pointer"
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* User Account / 1-Click Login Trigger */}
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border border-border bg-card hover:bg-secondary text-xs sm:text-sm font-medium transition-colors cursor-pointer"
          >
            {user ? (
              <>
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-[11px] font-bold flex items-center justify-center">
                  {user.avatar}
                </span>
                <span className="hidden xl:inline max-w-[110px] truncate font-medium">
                  {user.name.split(" ")[0]}
                </span>
                <UserCheck className="w-3.5 h-3.5 text-emerald-500 hidden sm:inline" />
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">{dictionary.nav.login}</span>
              </>
            )}
          </button>

          {/* Cart Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm shadow-md shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">{dictionary.nav.cart}</span>
            <span className="px-1.5 py-0.5 text-[11px] rounded-full bg-white text-indigo-700 font-bold leading-none">
              {cartItemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

