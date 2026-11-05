"use client";

import React from "react";
import Link from "next/link";
import {
  TrendingUp,
  ShoppingBag,
  Truck,
  AlertTriangle,
  ArrowRight,
  FileText,
  Layers,
} from "lucide-react";
import { CATEGORIES } from "@/data";
import { useLanguage } from "@/context/LanguageContext";
import { useStore } from "@/context/StoreContext";

export function AdminDashboardView() {
  const { locale, dictionary } = useLanguage();
  const { products, orders, formatPrice, setActiveInvoiceOrder } = useStore();

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.status !== "delivered" && o.status !== "cancelled"
  ).length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  const categoryStats = CATEGORIES.filter((c) => c.id !== "all").map((cat) => {
    const count = products.filter((p) => p.category === cat.id).length;
    const pct =
      products.length > 0 ? Math.round((count / products.length) * 100) : 0;
    return {
      id: cat.id,
      name: cat.name[locale],
      count,
      pct,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
          {dictionary.admin.dashboardTitle}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {dictionary.admin.dashboardSubtitle}
        </p>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-5 rounded-3xl border border-border shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              {dictionary.admin.totalRevenue}
            </p>
            <p className="text-xl font-extrabold text-primary">
              {formatPrice(totalRevenue)}
            </p>
          </div>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-border shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              {dictionary.admin.totalOrdersCount}
            </p>
            <p className="text-2xl font-extrabold text-foreground">
              {orders.length}
            </p>
          </div>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-border shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              {dictionary.admin.pendingFulfillment}
            </p>
            <p className="text-2xl font-extrabold text-foreground">
              {pendingOrdersCount}
            </p>
          </div>
        </div>

        <div className="bg-card p-5 rounded-3xl border border-border shadow-2xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              {dictionary.admin.lowStockAlert}
            </p>
            <p className="text-2xl font-extrabold text-foreground">
              {lowStockCount} / {products.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-card rounded-3xl border border-border p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-base text-foreground">
              {dictionary.admin.recentOrders}
            </h2>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
            >
              <span>{dictionary.nav.adminOrders}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border text-muted-foreground font-bold">
                  <th className="py-3 px-3">{dictionary.orders.orderNumber}</th>
                  <th className="py-3 px-3">{dictionary.orders.recipient}</th>
                  <th className="py-3 px-3">{dictionary.orders.status}</th>
                  <th className="py-3 px-3">{dictionary.orders.total}</th>
                  <th className="py-3 px-3 text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {orders.slice(0, 6).map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-primary">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-bold text-foreground">
                        {order.customerName}
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {order.customerPhone}
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          order.status === "delivered"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                            : order.status === "shipped"
                            ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400"
                            : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-extrabold text-foreground">
                      {formatPrice(order.total)}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveInvoiceOrder(order)}
                        className="p-1.5 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Category Breakdown Card */}
        <div className="lg:col-span-4 bg-card rounded-3xl border border-border p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary" />
            <h2 className="font-extrabold text-base text-foreground">
              {dictionary.admin.categoryMix}
            </h2>
          </div>

          <div className="space-y-3.5 pt-1">
            {categoryStats.map((cat) => (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">
                    {cat.name}
                  </span>
                  <span className="text-muted-foreground font-mono">
                    {cat.count} ({cat.pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                    style={{ width: `${cat.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

