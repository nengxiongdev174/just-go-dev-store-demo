"use client";

import React, { useState } from "react";
import {
  X,
  Star,
  ShoppingCart,
  Check,
  Minus,
  Plus,
  Cpu,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useStore } from "@/context/StoreContext";
import { ProductIcon } from "@/components/shared/ProductIcon";

export function ProductQuickViewModal() {
  const { locale, dictionary } = useLanguage();
  const {
    quickViewProduct,
    setQuickViewProduct,
    formatPrice,
    addToCart,
    setIsCartOpen,
  } = useStore();

  const [selectedVariant, setSelectedVariant] = useState<string | undefined>(
    undefined
  );
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const activeVariant =
    selectedVariant ?? quickViewProduct.variants?.[0] ?? undefined;

  const handleClose = () => {
    setSelectedVariant(undefined);
    setQuantity(1);
    setQuickViewProduct(null);
  };

  const handleAddAndOpenCart = () => {
    if (quickViewProduct.stock <= 0) return;
    addToCart(quickViewProduct, quantity, activeVariant);
    handleClose();
    setIsCartOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-3xl rounded-3xl border border-border shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 relative">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white md:text-foreground md:bg-secondary md:hover:bg-secondary/80 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Left Artwork Panel */}
        <div
          className={`md:col-span-5 bg-gradient-to-br ${quickViewProduct.imageGradient} p-8 flex flex-col items-center justify-center text-white relative min-h-[240px]`}
        >
          <div className="w-28 h-28 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center shadow-2xl mb-6">
            <ProductIcon
              name={quickViewProduct.iconName}
              className="w-14 h-14 text-white"
            />
          </div>
          <span className="font-mono text-xs px-3 py-1 rounded-full bg-black/30 backdrop-blur-xs">
            {quickViewProduct.sku}
          </span>
        </div>

        {/* Right Info Panel */}
        <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-5 max-h-[85vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {quickViewProduct.rating} ({quickViewProduct.reviewsCount}{" "}
                {dictionary.catalog.reviews})
              </span>
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                {dictionary.hero.statsWarranty}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
              {quickViewProduct.name[locale]}
            </h2>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {quickViewProduct.description[locale]}
            </p>

            {/* Price Display */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-2xl font-extrabold text-primary">
                {formatPrice(quickViewProduct.price)}
              </span>
              {quickViewProduct.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(quickViewProduct.originalPrice)}
                </span>
              )}
            </div>

            {/* Variants Selection */}
            {quickViewProduct.variants && quickViewProduct.variants.length > 0 && (
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {dictionary.catalog.selectOption}
                </label>
                <div className="flex flex-wrap gap-2">
                  {quickViewProduct.variants.map((variant) => {
                    const isSelected = activeVariant === variant;
                    return (
                      <button
                        key={variant}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border bg-secondary/50 text-foreground hover:border-primary/40"
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                        <span>{variant}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Key Specs */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-primary" />
                {dictionary.catalog.specifications}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {quickViewProduct.specs.map((spec) => (
                  <div
                    key={spec}
                    className="px-3 py-2 rounded-xl bg-secondary/70 border border-border/60 text-xs font-medium text-foreground"
                  >
                    • {spec}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity & Add to Cart Footer */}
          <div className="pt-4 border-t border-border flex flex-wrap items-center gap-3">
            <div className="flex items-center border border-border rounded-xl bg-secondary/50 p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-2 rounded-lg hover:bg-card text-foreground transition-colors cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-10 text-center font-bold text-sm">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((q) => Math.min(quickViewProduct.stock, q + 1))
                }
                className="p-2 rounded-lg hover:bg-card text-foreground transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              disabled={quickViewProduct.stock <= 0}
              onClick={handleAddAndOpenCart}
              className="flex-1 py-3 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>
                {dictionary.catalog.addToCart} •{" "}
                {formatPrice(quickViewProduct.price * quantity)}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

