"use client";

import React, { useState } from "react";
import {
  X,
  ShoppingBag,
  KeyRound,
  CheckCircle2,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { DEMO_USERS } from "@/data";
import { useLanguage } from "@/context/LanguageContext";
import { useStore } from "@/context/StoreContext";

export function LoginModal() {
  const { dictionary } = useLanguage();
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    user,
    login,
    logout,
  } = useStore();

  const [selectedId, setSelectedId] = useState(
    user?.id ?? DEMO_USERS[0].id
  );

  if (!isLoginModalOpen) return null;

  const chosenAccount =
    DEMO_USERS.find((u) => u.id === selectedId) ?? DEMO_USERS[0];

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    login(chosenAccount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-3xl border border-border shadow-2xl overflow-hidden p-6 sm:p-7 space-y-5 relative">
        <button
          type="button"
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-extrabold text-lg text-foreground">
              {dictionary.auth.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              {dictionary.auth.subtitle}
            </p>
          </div>
        </div>

        {/* 1-Click Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-300 font-medium leading-relaxed flex items-start gap-2.5">
          <KeyRound className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
          <span>{dictionary.auth.demoNotice}</span>
        </div>

        {/* 1-Click Account Cards */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            {dictionary.auth.oneClickTitle}
          </label>

          {DEMO_USERS.map((acc) => {
            const active = selectedId === acc.id;
            return (
              <button
                key={acc.id}
                type="button"
                onClick={() => {
                  setSelectedId(acc.id);
                  login(acc);
                }}
                className={`w-full p-3.5 rounded-2xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  active
                    ? "border-primary bg-primary/10 shadow-xs"
                    : "border-border bg-secondary/40 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                    {acc.avatar}
                  </span>
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-foreground">
                      {acc.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {acc.email} •{" "}
                      <span className="font-semibold text-primary">
                        {acc.role === "manager"
                          ? dictionary.auth.managerRole
                          : dictionary.auth.customerRole}
                      </span>
                    </div>
                  </div>
                </div>
                {active && (
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSignIn} className="pt-2 space-y-3">
          <button
            type="submit"
            className="w-full py-3 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
          >
            <span>{dictionary.auth.signInBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {user && (
            <button
              type="button"
              onClick={() => {
                logout();
                setIsLoginModalOpen(false);
              }}
              className="w-full py-2.5 px-5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{dictionary.nav.logout}</span>
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

