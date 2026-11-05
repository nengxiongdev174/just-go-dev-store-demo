"use client";

import React, { useState } from "react";
import {
  X,
  ShoppingBag,
  Trash2,
  Minus,
  Plus,
  Tag,
  ArrowRight,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { INITIAL_STORE_CONFIG } from "@/data";
import { useLanguage } from "@/context/LanguageContext";
import { useStore } from "@/context/StoreContext";
import { ProductIcon } from "@/components/shared/ProductIcon";

export function CartDrawer() {
  const { locale, dictionary } = useLanguage();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    formatPrice,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    appliedPromoCode,
    applyPromoCode,
    removePromoCode,
    cartSubtotal,
    cartDiscount,
    cartShippingFee,
    cartTotal,
  } = useStore();

  const [promoInput, setPromoInput] = useState("");
  const [promoError, setPromoError] = useState(false);

  if (!isCartOpen) return null;

  const remainingForFreeShipping = Math.max(
    0,
    INITIAL_STORE_CONFIG.freeShippingThreshold - (cartSubtotal - cartDiscount)
  );
  const freeShippingProgressPct = Math.min(
    100,
    Math.round(
      ((cartSubtotal - cartDiscount) /
        INITIAL_STORE_CONFIG.freeShippingThreshold) *
        100
    )
  );

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const ok = applyPromoCode(promoInput);
    if (ok) {
      setPromoError(false);
      setPromoInput("");
    } else {
      setPromoError(true);
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md h-full border-l border-border shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-foreground">
                {dictionary.cart.title}
              </h2>
              <p className="text-xs text-muted-foreground">
                {cart.length} {dictionary.orders.items}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-xs text-rose-500 hover:underline px-2 py-1 cursor-pointer"
              >
                {dictionary.cart.clearCart}
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Bar */}
        {cart.length > 0 && (
          <div className="px-5 py-3 bg-indigo-500/5 border-b border-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Truck className="w-4 h-4 text-primary shrink-0" />
              {remainingForFreeShipping > 0 ? (
                <span>
                  {dictionary.cart.freeShippingProgress}{" "}
                  <strong className="text-primary">
                    {formatPrice(remainingForFreeShipping)}
                  </strong>
                </span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {dictionary.cart.freeShippingUnlocked}
                </span>
              )}
            </div>
            <div className="w-full h-1.5 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${freeShippingProgressPct}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-xs">
                <h3 className="font-bold text-base text-foreground">
                  {dictionary.cart.emptyTitle}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {dictionary.cart.emptyDesc}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold cursor-pointer"
              >
                {dictionary.cart.continueShopping}
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedVariant ?? "default"}`}
                className="p-3.5 rounded-2xl border border-border bg-secondary/30 flex items-center gap-3.5"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.product.imageGradient} flex items-center justify-center text-white shrink-0`}
                >
                  <ProductIcon
                    name={item.product.iconName}
                    className="w-7 h-7"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h4 className="font-bold text-xs sm:text-sm text-foreground truncate">
                    {item.product.name[locale]}
                  </h4>
                  {item.selectedVariant && (
                    <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
                      {item.selectedVariant}
                    </span>
                  )}
                  <div className="font-extrabold text-xs sm:text-sm text-primary">
                    {formatPrice(item.product.price * item.quantity)}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      removeFromCart(item.product.id, item.selectedVariant)
                    }
                    className="text-muted-foreground hover:text-rose-500 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center border border-border rounded-lg bg-card">
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(
                          item.product.id,
                          item.selectedVariant,
                          item.quantity - 1
                        )
                      }
                      className="p-1.5 hover:bg-secondary rounded-l-lg cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs font-bold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateCartQuantity(
                          item.product.id,
                          item.selectedVariant,
                          item.quantity + 1
                        )
                      }
                      className="p-1.5 hover:bg-secondary rounded-r-lg cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Totals & Promo */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-border bg-secondary/20 space-y-4">
            {/* Promo Code Form */}
            {appliedPromoCode ? (
              <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                  <Tag className="w-3.5 h-3.5" />
                  <span>{appliedPromoCode}</span>
                  <span className="font-normal">
                    ({dictionary.cart.promoApplied})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removePromoCode}
                  className="text-rose-500 hover:underline font-semibold cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="space-y-1.5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value);
                      setPromoError(false);
                    }}
                    placeholder={dictionary.cart.promoPlaceholder}
                    className="flex-1 px-3.5 py-2 rounded-xl border border-border bg-card text-xs focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs border border-border cursor-pointer"
                  >
                    {dictionary.cart.applyPromo}
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {dictionary.cart.invalidPromo}
                  </p>
                )}
              </form>
            )}

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>{dictionary.cart.subtotal}</span>
                <span className="font-semibold text-foreground">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>{dictionary.cart.discount}</span>
                  <span className="font-bold">-{formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>{dictionary.cart.shipping}</span>
                <span className="font-semibold text-foreground">
                  {cartShippingFee === 0
                    ? dictionary.cart.free
                    : formatPrice(cartShippingFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-border flex justify-between items-baseline text-sm font-extrabold text-foreground">
                <span>{dictionary.cart.total}</span>
                <span className="text-lg text-primary">
                  {formatPrice(cartTotal)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <span>{dictionary.cart.checkoutBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

