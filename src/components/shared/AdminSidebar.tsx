"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  PackageCheck,
  Boxes,
  Settings,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useStore } from "@/context/StoreContext";

export function AdminSidebar() {
  const pathname = usePathname();
  const { dictionary } = useLanguage();
  const { user, orders, isMounted } = useStore();

  const navItems = [
    {
      href: "/admin/dashboard",
      label: dictionary.nav.adminDashboard,
      icon: BarChart3,
      color: "text-indigo-600 dark:text-indigo-400",
    },
    {
      href: "/admin/orders",
      label: dictionary.nav.adminOrders,
      icon: PackageCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      badge: orders.filter((o) => o.status !== "delivered").length,
    },
    {
      href: "/admin/inventory",
      label: dictionary.nav.adminInventory,
      icon: Boxes,
      color: "text-violet-600 dark:text-violet-400",
    },
    {
      href: "/admin/settings",
      label: dictionary.nav.settings,
      icon: Settings,
      color: "text-sky-600 dark:text-sky-400",
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside className="w-64 bg-card border-r border-border shrink-0 flex flex-col justify-between hidden md:flex h-screen sticky top-0 shadow-xs z-30 print:hidden">
        <div className="p-5 flex flex-col h-full">
          {/* Brand Header */}
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3.5 pb-5 border-b border-border/80"
          >
            <div className="w-14 relative flex items-center justify-center shrink-0">
              <Image
                src="/jgd-latets-logo-no-bg.png"
                alt="JustGoDev Logo"
                width={90}
                height={90}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm tracking-tight text-foreground block">
                JustGoDev
              </span>
              <p className="text-[11px] text-muted-foreground font-medium truncate mt-0.5">
                {dictionary.brand.adminSubtitle}
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? "text-primary-foreground" : item.color
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                        isActive
                          ? "bg-white text-primary"
                          : "bg-primary/15 text-primary"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Bottom User Profile Card */}
          <div className="mt-auto pt-4 border-t border-border/80">
            {isMounted && user ? (
              <Link
                href="/admin/settings"
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/60 transition-colors"
              >
                <div className="h-8 w-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  {user.avatar}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-xs truncate text-foreground leading-none">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-primary font-medium mt-1 leading-none truncate">
                    {dictionary.auth.managerRole}
                  </p>
                </div>
              </Link>
            ) : (
              <div className="h-12 w-full rounded-xl bg-secondary/20 border border-border/30" />
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden sticky top-0 z-40 bg-card border-b border-border p-3 flex items-center justify-between print:hidden">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg bg-primary text-white flex items-center justify-center font-bold text-xs">
            JG
          </div>
          <div>
            <span className="font-bold text-xs block">JustGoDev Store</span>
            <span className="text-[10px] text-muted-foreground block">
              {dictionary.brand.adminSubtitle}
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`p-2 rounded-lg text-xs transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary"
                }`}
                title={item.label}
              >
                <Icon className="w-4 h-4" />
              </Link>
            );
          })}
        </div>
      </header>
    </>
  );
}

