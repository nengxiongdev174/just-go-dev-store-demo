"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
  Info,
  ShoppingBag,
  X,
} from "lucide-react";

export type ToastVariant = "success" | "error" | "info" | "cart";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (payload: {
    title: string;
    description?: string;
    variant?: ToastVariant;
  }) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      title,
      description,
      variant = "success",
    }: {
      title: string;
      description?: string;
      variant?: ToastVariant;
    }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, description, variant }]);
      setTimeout(() => {
        removeToast(id);
      }, 3200);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toast Stack (Top-Right below Navbar) */}
      <div
        aria-live="polite"
        className="fixed top-20 right-4 sm:right-6 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0 print:hidden"
      >
        {toasts.map((t) => {
          const Icon =
            t.variant === "error"
              ? AlertCircle
              : t.variant === "cart"
              ? ShoppingBag
              : t.variant === "info"
              ? Info
              : CheckCircle2;

          const iconWrapStyle =
            t.variant === "error"
              ? "bg-rose-500 text-white shadow-rose-500/30"
              : t.variant === "cart"
              ? "bg-indigo-600 text-white shadow-indigo-500/30"
              : t.variant === "info"
              ? "bg-sky-500 text-white shadow-sky-500/30"
              : "bg-emerald-500 text-white shadow-emerald-500/30";

          const borderAccent =
            t.variant === "error"
              ? "border-rose-500/40"
              : t.variant === "cart"
              ? "border-indigo-500/40"
              : t.variant === "info"
              ? "border-sky-500/40"
              : "border-emerald-500/40";

          return (
            <div
              key={t.id}
              className={`toast-enter pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl bg-card/95 backdrop-blur-xl border-2 ${borderAccent} shadow-2xl`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${iconWrapStyle}`}
              >
                <Icon className="w-4 h-4" />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <p className="font-bold text-xs sm:text-sm text-foreground leading-snug">
                  {t.title}
                </p>
                {t.description && (
                  <p className="text-xs text-muted-foreground truncate mt-0.5 font-medium">
                    {t.description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

