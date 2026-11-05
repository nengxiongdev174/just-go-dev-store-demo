"use client";

import React, { useMemo, useRef, useState } from "react";
import { ArrowUpDown, RotateCcw, SearchX } from "lucide-react";
import { CATEGORIES } from "@/data";
import { type CategoryId } from "@/types/store";
import { useLanguage } from "@/context/LanguageContext";
import { useStore } from "@/context/StoreContext";
import { ProductIcon } from "@/components/shared/ProductIcon";
import { HeroBanner } from "./HeroBanner";
import { ProductCard } from "./ProductCard";

type SortOption = "featured" | "price_asc" | "price_desc" | "rating";

interface StorefrontViewProps {
  searchQuery: string;
  onClearSearch: () => void;
  onGoToOrders: () => void;
}

export function StorefrontView({
  searchQuery,
  onClearSearch,
  onGoToOrders,
}: StorefrontViewProps) {
  const { locale, dictionary } = useLanguage();
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>("all");
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const catalogRef = useRef<HTMLDivElement>(null);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = products.filter((item) => {
      const matchCategory =
        selectedCategory === "all" || item.category === selectedCategory;
      if (!matchCategory) return false;
      if (!q) return true;
      return (
        item.name.lo.toLowerCase().includes(q) ||
        item.name.th.toLowerCase().includes(q) ||
        item.name.en.toLowerCase().includes(q) ||
        item.sku.toLowerCase().includes(q)
      );
    });

    if (sortBy === "price_asc") {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price_desc") {
      return [...list].sort((a, b) => b.price - a.price);
    }
    if (sortBy === "rating") {
      return [...list].sort((a, b) => b.rating - a.rating);
    }
    return list;
  }, [products, selectedCategory, searchQuery, sortBy]);

  const scrollToCatalog = () => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const resetAllFilters = () => {
    setSelectedCategory("all");
    setSortBy("featured");
    onClearSearch();
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <HeroBanner
        onExploreClick={scrollToCatalog}
        onTrackOrdersClick={onGoToOrders}
      />

      {/* Category Filter Bar & Sort Controls */}
      <div ref={catalogRef} className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md shadow-indigo-500/20"
                      : "bg-card hover:bg-secondary text-foreground border border-border"
                  }`}
                >
                  <ProductIcon name={cat.iconName} className="w-4 h-4" />
                  <span>{cat.name[locale]}</span>
                </button>
              );
            })}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2.5 ml-auto">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {dictionary.catalog.showingCount}{" "}
              <strong className="text-foreground">
                {filteredProducts.length}
              </strong>
            </span>

            <div className="relative flex items-center bg-card border border-border rounded-xl px-3 py-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground mr-2" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-xs sm:text-sm font-semibold text-foreground focus:outline-none cursor-pointer"
              >
                <option value="featured" className="bg-card text-foreground">
                  {dictionary.catalog.sortFeatured}
                </option>
                <option value="price_asc" className="bg-card text-foreground">
                  {dictionary.catalog.sortPriceAsc}
                </option>
                <option value="price_desc" className="bg-card text-foreground">
                  {dictionary.catalog.sortPriceDesc}
                </option>
                <option value="rating" className="bg-card text-foreground">
                  {dictionary.catalog.sortRating}
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-3xl border border-border p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
              <SearchX className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-foreground">
                {dictionary.catalog.noProductsFound}
              </h3>
              {searchQuery && (
                <p className="text-xs text-muted-foreground">
                  &ldquo;{searchQuery}&rdquo;
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={resetAllFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{dictionary.catalog.clearFilters}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

