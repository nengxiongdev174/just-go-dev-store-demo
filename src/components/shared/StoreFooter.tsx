"use client";

import React from "react";
import { ShoppingBag, MapPin, Phone, Mail } from "lucide-react";
import { INITIAL_STORE_CONFIG } from "@/data";
import { useLanguage } from "@/context/LanguageContext";

export function StoreFooter() {
  const { locale, dictionary } = useLanguage();

  return (
    <footer className="border-t border-border bg-card/60 mt-16 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-1 md:grid-cols-12 gap-8 text-xs sm:text-sm">
        <div className="md:col-span-6 space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base text-foreground">
              {dictionary.brand.name}
            </span>
          </div>
          <p className="text-muted-foreground max-w-md leading-relaxed">
            {INITIAL_STORE_CONFIG.tagline[locale]}
          </p>
        </div>

        <div className="md:col-span-6 flex flex-col sm:flex-row sm:justify-end gap-6 text-muted-foreground">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span>{INITIAL_STORE_CONFIG.address[locale]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <span>{INITIAL_STORE_CONFIG.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <span>{INITIAL_STORE_CONFIG.email}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

