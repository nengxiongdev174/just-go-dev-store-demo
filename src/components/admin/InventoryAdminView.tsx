"use client";

import React, { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Package,
  AlertTriangle,
  ShoppingBag,
  TrendingUp,
  X,
  Check,
} from "lucide-react";
import { type Product, type CategoryId } from "@/types/store";
import { CATEGORIES } from "@/data";
import { useLanguage } from "@/context/LanguageContext";
import { useStore } from "@/context/StoreContext";
import { ProductIcon } from "@/components/shared/ProductIcon";

export function InventoryAdminView() {
  const { locale, dictionary } = useLanguage();
  const {
    products,
    orders,
    formatPrice,
    saveProduct,
    deleteProduct,
  } = useStore();

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Strict Zero-Initial-Value Rule: string states initialized to "" for new items
  const [nameLo, setNameLo] = useState("");
  const [nameTh, setNameTh] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [sku, setSku] = useState("");
  const [category, setCategory] =
    useState<Exclude<CategoryId, "all">>("electronics");
  const [priceStr, setPriceStr] = useState<string>("");
  const [stockStr, setStockStr] = useState<string>("");

  const lowStockCount = products.filter((p) => p.stock <= 5).length;
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  const openCreateModal = () => {
    setEditingProduct(null);
    setNameLo("");
    setNameTh("");
    setNameEn("");
    setSku(`JGD-NEW-${Math.floor(100 + Math.random() * 900)}`);
    setCategory("electronics");
    setPriceStr("");
    setStockStr("");
    setIsCreating(true);
  };

  const openEditModal = (prod: Product) => {
    setIsCreating(false);
    setEditingProduct(prod);
    setNameLo(prod.name.lo);
    setNameTh(prod.name.th);
    setNameEn(prod.name.en);
    setSku(prod.sku);
    setCategory(prod.category);
    setPriceStr(String(prod.price));
    setStockStr(String(prod.stock));
  };

  const closeModal = () => {
    setEditingProduct(null);
    setIsCreating(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const numericPrice = Number(priceStr) || 0;
    const numericStock = Number(stockStr) || 0;

    const finalLo = nameLo.trim() || "ສິນຄ້າໃໝ່";
    const finalTh = nameTh.trim() || finalLo;
    const finalEn = nameEn.trim() || finalLo;

    if (editingProduct) {
      saveProduct({
        ...editingProduct,
        sku: sku.trim() || editingProduct.sku,
        category,
        price: numericPrice,
        stock: numericStock,
        name: { lo: finalLo, th: finalTh, en: finalEn },
      });
    } else {
      const newProduct: Product = {
        id: `prd-${Date.now()}`,
        sku: sku.trim() || "JGD-CUSTOM",
        name: { lo: finalLo, th: finalTh, en: finalEn },
        description: {
          lo: "ສິນຄ້າຄຸນນະພາບມາດຕະຖານ JustGoDev Store",
          th: "สินค้าคุณภาพมาตรฐาน JustGoDev Store",
          en: "Official quality product by JustGoDev Store",
        },
        category,
        price: numericPrice,
        stock: numericStock,
        rating: 5.0,
        reviewsCount: 1,
        badge: "new",
        imageGradient: "from-indigo-600 via-violet-600 to-purple-700",
        iconName: "Package",
        specs: ["Official Warranty", "Fast Dispatch"],
        variants: ["Standard"],
      };
      saveProduct(newProduct);
    }
    closeModal();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-foreground">
            {dictionary.admin.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {dictionary.admin.subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{dictionary.admin.addProduct}</span>
        </button>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-5 rounded-2xl border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              {dictionary.admin.totalCatalog}
            </p>
            <p className="text-2xl font-extrabold text-foreground">
              {products.length}
            </p>
          </div>
        </div>

        <div className="bg-card p-5 rounded-2xl border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium">
              {dictionary.admin.lowStockAlert}
            </p>
            <p className="text-2xl font-extrabold text-foreground">
              {lowStockCount}
            </p>
          </div>
        </div>

        <div className="bg-card p-5 rounded-2xl border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
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

        <div className="bg-card p-5 rounded-2xl border border-border flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
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
      </div>

      {/* Product Inventory Table */}
      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50 text-muted-foreground font-bold">
                <th className="py-3.5 px-4">{dictionary.catalog.sku}</th>
                <th className="py-3.5 px-4">{dictionary.catalog.allProducts}</th>
                <th className="py-3.5 px-4">{dictionary.admin.priceLak}</th>
                <th className="py-3.5 px-4">{dictionary.admin.stockCount}</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {products.map((prod) => (
                <tr
                  key={prod.id}
                  className="hover:bg-secondary/30 transition-colors"
                >
                  <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">
                    {prod.sku}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-br ${prod.imageGradient} flex items-center justify-center text-white shrink-0`}
                      >
                        <ProductIcon
                          name={prod.iconName}
                          className="w-4 h-4"
                        />
                      </div>
                      <span className="font-bold text-foreground">
                        {prod.name[locale]}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-primary">
                    {formatPrice(prod.price)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        prod.stock > 5
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      }`}
                    >
                      {prod.stock}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(prod)}
                        className="p-2 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground transition-colors cursor-pointer"
                        title={dictionary.admin.editProduct}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteProduct(prod.id)}
                        className="p-2 rounded-xl bg-secondary hover:bg-rose-500 hover:text-white text-rose-500 transition-colors cursor-pointer"
                        title={dictionary.admin.delete}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {(isCreating || editingProduct) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-3xl border border-border shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-extrabold text-base text-foreground">
                {editingProduct
                  ? dictionary.admin.editProduct
                  : dictionary.admin.addProduct}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="p-1.5 rounded-xl bg-secondary text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    {dictionary.admin.skuCode}
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="JGD-SKU-001"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-xs sm:text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    {dictionary.admin.category}
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(
                        e.target.value as Exclude<CategoryId, "all">
                      )
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-xs sm:text-sm focus:border-primary focus:outline-none"
                  >
                    {CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                      <option key={c.id} value={c.id} className="bg-card">
                        {c.name[locale]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    {dictionary.admin.productNameLo}
                  </label>
                  <input
                    type="text"
                    value={nameLo}
                    onChange={(e) => setNameLo(e.target.value)}
                    placeholder="ຊື່ສິນຄ້າພາສາລາວ..."
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-xs sm:text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    {dictionary.admin.productNameTh}
                  </label>
                  <input
                    type="text"
                    value={nameTh}
                    onChange={(e) => setNameTh(e.target.value)}
                    placeholder="ชื่อสินค้าภาษาไทย..."
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-xs sm:text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    {dictionary.admin.productNameEn}
                  </label>
                  <input
                    type="text"
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="Product Name in English..."
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-xs sm:text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              {/* Price & Stock with Strict Zero-Initial-Value Rule */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    {dictionary.admin.priceLak}
                  </label>
                  <input
                    type="number"
                    value={priceStr}
                    onChange={(e) => setPriceStr(e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-xs sm:text-sm focus:border-primary focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground">
                    {dictionary.admin.stockCount}
                  </label>
                  <input
                    type="number"
                    value={stockStr}
                    onChange={(e) => setStockStr(e.target.value)}
                    placeholder="0"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-secondary/40 text-xs sm:text-sm focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 rounded-xl bg-secondary text-foreground text-xs font-bold cursor-pointer"
                >
                  {dictionary.admin.cancel}
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{dictionary.admin.save}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

