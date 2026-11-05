"use client";

import React, { useMemo, useState } from "react";
import {
  PackageCheck,
  Truck,
  Clock,
  CheckCircle2,
  FileText,
  FastForward,
  MapPin,
  Box,
} from "lucide-react";
import { type OrderStatus } from "@/types/store";
import { useLanguage } from "@/context/LanguageContext";
import { useStore } from "@/context/StoreContext";

const STEPS: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

export function AdminOrdersView() {
  const { locale, dictionary } = useLanguage();
  const {
    orders,
    formatPrice,
    advanceOrderStatus,
    setActiveInvoiceOrder,
  } = useStore();

  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
      case "pending":
        return dictionary.orders.statusPending;
      case "processing":
        return dictionary.orders.statusProcessing;
      case "shipped":
        return dictionary.orders.statusShipped;
      case "delivered":
        return dictionary.orders.statusDelivered;
      default:
        return dictionary.orders.statusCancelled;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
            {dictionary.orders.adminTitle}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {dictionary.orders.adminSubtitle}
          </p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-card p-1.5 rounded-2xl border border-border">
          {(
            [
              { id: "all" as const, label: dictionary.orders.statusAll },
              {
                id: "pending" as const,
                label: dictionary.orders.statusPending,
              },
              {
                id: "processing" as const,
                label: dictionary.orders.statusProcessing,
              },
              {
                id: "shipped" as const,
                label: dictionary.orders.statusShipped,
              },
              {
                id: "delivered" as const,
                label: dictionary.orders.statusDelivered,
              },
            ] as const
          ).map((tab) => {
            const active = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-primary text-primary-foreground shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-card rounded-3xl border border-border p-12 text-center space-y-3">
          <PackageCheck className="w-10 h-10 text-muted-foreground mx-auto" />
          <p className="font-bold text-foreground">
            {dictionary.orders.emptyOrders}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const currentStepIdx = STEPS.indexOf(order.status);
            return (
              <div
                key={order.id}
                className="bg-card rounded-3xl border border-border p-5 sm:p-6 shadow-xs space-y-5"
              >
                {/* Top Order Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-extrabold text-sm sm:text-base text-primary">
                      {order.orderNumber}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-secondary font-mono text-xs font-semibold text-foreground">
                      {dictionary.orders.trackingNo}: {order.trackingNumber}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.status !== "delivered" && (
                      <button
                        type="button"
                        onClick={() => advanceOrderStatus(order.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-xs transition-all cursor-pointer"
                      >
                        <FastForward className="w-3.5 h-3.5" />
                        <span>{dictionary.orders.advanceStatus}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setActiveInvoiceOrder(order)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground border border-border text-xs font-bold transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{dictionary.orders.viewInvoice}</span>
                    </button>
                  </div>
                </div>

                {/* Live Parcel Status Stepper */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {STEPS.map((step, idx) => {
                    const isDone = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    const Icon =
                      step === "pending"
                        ? Clock
                        : step === "processing"
                        ? Box
                        : step === "shipped"
                        ? Truck
                        : CheckCircle2;

                    return (
                      <div
                        key={step}
                        className={`p-3 rounded-2xl border flex items-center gap-2.5 transition-all ${
                          isCurrent
                            ? "border-primary bg-primary/10 text-primary font-bold"
                            : isDone
                            ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 font-semibold"
                            : "border-border bg-secondary/30 text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span className="text-xs truncate">
                          {getStatusLabel(step)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Items & Delivery Summary */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-1 items-center">
                  <div className="md:col-span-7 space-y-1.5">
                    {order.items.map((item, idx) => (
                      <div
                        key={`${item.productId}-${idx}`}
                        className="text-xs sm:text-sm flex items-center justify-between bg-secondary/40 px-3.5 py-2 rounded-xl"
                      >
                        <span className="font-semibold text-foreground">
                          {item.name[locale]}{" "}
                          <span className="text-muted-foreground">
                            × {item.quantity}
                          </span>
                        </span>
                        <span className="font-bold text-foreground">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col justify-between gap-2 p-3.5 rounded-2xl bg-secondary/30 border border-border/60 text-xs">
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground block">
                          {order.customerName} ({order.customerPhone})
                        </strong>
                        <span>{order.shippingAddress}</span>
                      </div>
                    </div>
                    <div className="flex items-baseline justify-between pt-2 border-t border-border/60">
                      <span className="text-muted-foreground font-semibold">
                        {dictionary.orders.total}
                      </span>
                      <span className="text-base font-extrabold text-primary">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

