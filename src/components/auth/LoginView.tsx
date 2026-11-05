"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  Sun,
  Moon,
  ShoppingBag,
  ShieldCheck,
} from "lucide-react";
import { DEMO_USERS } from "@/data";
import { type StoreUser } from "@/types/store";
import { type Locale } from "@/locales";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";

interface LoginViewProps {
  onLogin: (user: StoreUser) => void;
}

const DEMO_CREDENTIALS = [
  {
    user: DEMO_USERS[0],
    pass: "cust123",
    icon: ShoppingBag,
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    user: DEMO_USERS[1],
    pass: "admin123",
    icon: ShieldCheck,
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];

const LOCALES: { code: Locale; label: string }[] = [
  { code: "lo", label: "ລາວ" },
  { code: "th", label: "ไทย" },
  { code: "en", label: "EN" },
];

export function LoginView({ onLogin }: LoginViewProps) {
  const { locale, setLocale, dictionary } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const [selectedId, setSelectedId] = useState(DEMO_USERS[0].id);
  const [email, setEmail] = useState(DEMO_USERS[0].email);
  const [password, setPassword] = useState("cust123");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSelectAccount = (item: (typeof DEMO_CREDENTIALS)[number]) => {
    setSelectedId(item.user.id);
    setEmail(item.user.email);
    setPassword(item.pass);
    setErrorMsg("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email.trim() || !password.trim()) {
      setErrorMsg(dictionary.auth.credentialsRequired);
      return;
    }

    const matched =
      DEMO_CREDENTIALS.find(
        (c) => c.user.email.toLowerCase() === email.trim().toLowerCase()
      )?.user ??
      DEMO_USERS.find((u) => u.id === selectedId) ??
      DEMO_USERS[0];

    onLogin(matched);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-secondary/40">
      <div className="w-full max-w-lg bg-card rounded-3xl border border-border shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Top Controls: Brand & Language/Theme Switchers */}
        <div className="flex items-center justify-between gap-2 pb-4 border-b border-border/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-10 relative flex items-center justify-center shrink-0">
              <Image
                src="/jgd-latets-logo-no-bg.png"
                alt="JustGoDev Logo"
                width={80}
                height={80}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-foreground block">
                {dictionary.brand.name}
              </span>
              <span className="text-[11px] text-primary font-semibold">
                {dictionary.brand.subtitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-secondary p-1 rounded-xl border border-border">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  type="button"
                  onClick={() => setLocale(loc.code)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    locale === loc.code
                      ? "bg-primary text-primary-foreground shadow-2xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {loc.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-1.5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
            {dictionary.auth.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {dictionary.auth.subtitle}
          </p>
        </div>

        {/* 1-Click Notice Banner */}
        <div className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-300 font-medium leading-relaxed flex items-start gap-2.5">
          <KeyRound className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
          <span>{dictionary.auth.demoNotice}</span>
        </div>

        {/* 1-Click Role Selector Cards */}
        <div className="space-y-2.5">
          <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
            {dictionary.auth.oneClickTitle}
          </label>

          <div className="grid grid-cols-1 gap-2.5">
            {DEMO_CREDENTIALS.map((item) => {
              const isSelected = selectedId === item.user.id;
              const RoleIcon = item.icon;
              const roleTitle =
                item.user.role === "manager"
                  ? dictionary.auth.managerRole
                  : dictionary.auth.customerRole;
              const roleDesc =
                item.user.role === "manager"
                  ? dictionary.auth.managerDesc
                  : dictionary.auth.customerDesc;

              return (
                <button
                  key={item.user.id}
                  type="button"
                  onClick={() => handleSelectAccount(item)}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all flex items-start justify-between gap-3 cursor-pointer ${
                    isSelected
                      ? "border-primary bg-primary/10 ring-1 ring-primary shadow-xs"
                      : "border-border bg-secondary/40 hover:bg-secondary/70"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : item.badgeColor
                      }`}
                    >
                      <RoleIcon className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-2">
                        <span>{roleTitle}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-snug">
                        {roleDesc}
                      </p>
                      <p className="text-[11px] font-mono text-primary font-semibold pt-0.5">
                        {item.user.email} • Pass: {item.pass}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {dictionary.auth.emailLabel}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-secondary/40 focus:bg-card text-xs sm:text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                {dictionary.auth.passwordLabel}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-border bg-secondary/40 focus:bg-card text-xs sm:text-sm focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <span>{dictionary.auth.signInBtn}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

