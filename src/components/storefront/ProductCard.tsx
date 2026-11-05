"use client";

import React, { useState } from "react";
import { Star, ShoppingCart, Eye, Check } from "lucide-react";
import { type Product } from "@/types/store";
import { useLanguage } from "@/context/LanguageContext";
import { useStore } from "@/context/StoreContext";
import { ProductIcon } from "@/components/shared/ProductIcon";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { locale, dictionary } = useLanguage();
  const { formatPrice, addToCart, setQuickViewProduct } = useStore();
  const [justAdded, setJustAdded] = useState(false);

  const discountPercent =
    product.originalPrice && product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) * 100
        )
      : 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1, product.variants?.[0]);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  };

  const badgeLabel =
    product.badge === "hot"
      ? dictionary.catalog.badgeHot
      : product.badge === "new"
      ? dictionary.catalog.badgeNew
      : product.badge === "sale"
      ? dictionary.catalog.badgeSale
      : null;

  const badgeStyle =
    product.badge === "hot"
      ? "bg-rose-500 text-white"
      : product.badge === "new"
      ? "bg-emerald-500 text-white"
      : "bg-amber-500 text-white";

  return (
    <div
      onClick={() => setQuickViewProduct(product)}
      className="group bg-card rounded-2xl border border-border hover:border-primary/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Visual Header */}
      <div
        className={`relative h-48 bg-gradient-to-br ${product.imageGradient} flex items-center justify-center p-6 overflow-hidden`}
      >
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          {badgeLabel && (
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider shadow-xs ${badgeStyle}`}
            >
              {badgeLabel}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-white/90 text-slate-900 shadow-xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Quick View Floating Trigger */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="absolute top-3 right-3 p-2 rounded-xl bg-white/20 hover:bg-white text-white hover:text-slate-900 backdrop-blur-md transition-all z-10 cursor-pointer"
          title={dictionary.catalog.quickView}
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Center Icon Showcase */}
        <div className="w-20 h-20 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
          <ProductIcon name={product.iconName} className="w-10 h-10" />
        </div>

        {/* Bottom Specs Chips */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-1.5 overflow-hidden">
          {product.specs.slice(0, 2).map((spec) => (
            <span
              key={spec}
              className="px-2 py-0.5 rounded-md bg-black/35 backdrop-blur-xs text-white/90 text-[10px] font-medium truncate"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-mono text-[11px]">{product.sku}</span>
            <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {product.rating}
              <span className="text-muted-foreground font-normal">
                ({product.reviewsCount})
              </span>
            </span>
          </div>

          <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name[locale]}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {product.description[locale]}
          </p>
        </div>

        <div className="pt-2 border-t border-border/60 space-y-3">
          {/* Price & Stock Row */}
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <div className="text-lg font-extrabold text-primary">
                {formatPrice(product.price)}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <div className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
            </div>

            <div className="text-right">
              {product.stock > 5 ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  {dictionary.catalog.inStock} ({product.stock})
                </span>
              ) : product.stock > 0 ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  {dictionary.catalog.lowStock} ({product.stock})
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  {dictionary.catalog.outOfStock}
                </span>
              )}
            </div>
          </div>

          {/* Action Button */}
          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={handleAdd}
            className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
              justAdded
                ? "bg-emerald-600 text-white"
                : product.stock <= 0
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-indigo-500/20"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>{dictionary.catalog.added}</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                <span>{dictionary.catalog.addToCart}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

