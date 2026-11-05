"use client";

import React from "react";
import { X, Printer, ShoppingBag } from "lucide-react";
import { INITIAL_STORE_CONFIG } from "@/data";
import { useLanguage } from "@/context/LanguageContext";
import { useStore } from "@/context/StoreContext";

export function OrderInvoiceModal() {
  const { locale, dictionary } = useLanguage();
  const { activeInvoiceOrder, setActiveInvoiceOrder, formatPrice } = useStore();

  if (!activeInvoiceOrder) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Modal Action Bar (Hidden on print) */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/40 print:hidden">
          <span className="font-mono text-xs font-bold text-muted-foreground">
            {activeInvoiceOrder.orderNumber}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{dictionary.orders.printInvoice}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveInvoiceOrder(null)}
              className="p-1.5 rounded-xl bg-card border border-border text-foreground cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Area */}
        <div
          id="printable-invoice"
          className="p-6 sm:p-8 overflow-y-auto space-y-6 bg-card text-foreground"
        >
          {/* Store Header */}
          <div className="flex items-start justify-between border-b border-border pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base">
                  {INITIAL_STORE_CONFIG.storeName}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {INITIAL_STORE_CONFIG.address[locale]}
                </p>
                <p className="text-xs text-muted-foreground">
                  {INITIAL_STORE_CONFIG.phone}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-sm text-primary">
                {activeInvoiceOrder.orderNumber}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {new Date(activeInvoiceOrder.createdAt).toLocaleDateString()}
              </div>
              <div className="text-[11px] font-mono font-semibold mt-1">
                {activeInvoiceOrder.trackingNumber}
              </div>
            </div>
          </div>

          {/* Recipient Info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-secondary/40 p-4 rounded-2xl border border-border/60">
            <div className="space-y-1">
              <span className="text-muted-foreground font-semibold block">
                {dictionary.orders.recipient}
              </span>
              <p className="font-bold text-foreground">
                {activeInvoiceOrder.customerName}
              </p>
              <p className="text-muted-foreground">
                {activeInvoiceOrder.customerPhone}
              </p>
              <p className="text-muted-foreground">
                {activeInvoiceOrder.shippingAddress}
              </p>
            </div>
            <div className="space-y-1 text-right">
              <span className="text-muted-foreground font-semibold block">
                {dictionary.orders.payment}
              </span>
              <p className="font-bold uppercase text-foreground">
                {activeInvoiceOrder.paymentMethod.replace("_", " ")}
              </p>
              <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase">
                {activeInvoiceOrder.status}
              </span>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
              {dictionary.orders.items}
            </div>
            {activeInvoiceOrder.items.map((item, idx) => (
              <div
                key={`${item.productId}-${idx}`}
                className="flex items-center justify-between text-xs py-1.5 border-b border-border/40"
              >
                <div>
                  <p className="font-bold text-foreground">
                    {item.name[locale]} × {item.quantity}
                  </p>
                  {item.selectedVariant && (
                    <span className="text-[11px] text-muted-foreground">
                      {item.selectedVariant} • {item.sku}
                    </span>
                  )}
                </div>
                <span className="font-bold text-foreground">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Summary Totals */}
          <div className="space-y-1.5 text-xs pt-2">
            <div className="flex justify-between text-muted-foreground">
              <span>{dictionary.cart.subtotal}</span>
              <span>{formatPrice(activeInvoiceOrder.subtotal)}</span>
            </div>
            {activeInvoiceOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>{dictionary.cart.discount}</span>
                <span>-{formatPrice(activeInvoiceOrder.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>{dictionary.cart.shipping}</span>
              <span>
                {activeInvoiceOrder.shippingFee === 0
                  ? dictionary.cart.free
                  : formatPrice(activeInvoiceOrder.shippingFee)}
              </span>
            </div>
            <div className="flex justify-between items-baseline text-sm font-extrabold text-foreground pt-2 border-t border-border">
              <span>{dictionary.orders.total}</span>
              <span className="text-lg text-primary">
                {formatPrice(activeInvoiceOrder.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

