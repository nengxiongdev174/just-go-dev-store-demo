"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Truck,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  PackageSearch,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface HeroBannerProps {
  onExploreClick: () => void;
  onTrackOrdersClick: () => void;
}

export function HeroBanner({
  onExploreClick,
  onTrackOrdersClick,
}: HeroBannerProps) {
  const { dictionary } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyPromo = () => {
    navigator.clipboard?.writeText("JUSTGODEV10");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-indigo-500/20">
      {/* Decorative Background Glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-medium text-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{dictionary.hero.badge}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            {dictionary.hero.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            {dictionary.hero.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-indigo-50 font-bold text-sm shadow-lg transition-all cursor-pointer"
            >
              <span>{dictionary.hero.ctaShop}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onTrackOrdersClick}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-all cursor-pointer"
            >
              <PackageSearch className="w-4 h-4" />
              <span>{dictionary.hero.ctaOrders}</span>
            </button>

            {/* Interactive Promo Pill */}
            <button
              type="button"
              onClick={handleCopyPromo}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-400/30 text-indigo-100 text-xs font-semibold transition-all cursor-pointer"
            >
              <span className="font-mono font-bold text-amber-300">
                JUSTGODEV10
              </span>
              <span className="text-white/60">|</span>
              {copied ? (
                <span className="inline-flex items-center gap-1 text-emerald-300">
                  <Check className="w-3.5 h-3.5" />
                  {dictionary.hero.copied}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" />
                  {dictionary.hero.copyCode}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Highlights Cards */}
        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center text-indigo-200 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-indigo-200 font-medium">12+ Premium</p>
              <p className="text-sm font-bold">{dictionary.hero.statsProducts}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center text-emerald-200 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-emerald-200 font-medium">HAL & Anousith</p>
              <p className="text-sm font-bold">{dictionary.hero.statsDelivery}</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
            <div className="w-10 h-10 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-200 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-amber-200 font-medium">Official Store</p>
              <p className="text-sm font-bold">{dictionary.hero.statsWarranty}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

