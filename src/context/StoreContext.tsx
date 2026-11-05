"use client";

import React, { createContext, useContext, useState, useSyncExternalStore } from "react";
import {
  type Product,
  type CartItem,
  type Order,
  type OrderStatus,
  type PaymentMethod,
  type StoreUser,
  type CurrencyCode,
} from "@/types/store";
import { INITIAL_STORE_CONFIG, PROMO_CODES } from "@/data";
import {
  subscribeStore,
  getClientSnapshot,
  getServerSnapshot,
  updateStoreState,
  resetStoreSandbox,
} from "@/lib/storage";
import { formatStorePrice } from "@/lib/formatters";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/context/ToastContext";

interface StoreContextValue {
  isMounted: boolean;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  user: StoreUser | null;
  currency: CurrencyCode;
  appliedPromoCode: string | null;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cartItemCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShippingFee: number;
  cartTotal: number;
  formatPrice: (amountInLak: number) => string;
  setCurrency: (currency: CurrencyCode) => void;
  login: (user: StoreUser) => void;
  logout: () => void;
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  updateCartQuantity: (productId: string, variant: string | undefined, quantity: number) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  placeOrder: (payload: {
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: PaymentMethod;
  }) => Order;
  advanceOrderStatus: (orderId: string) => void;
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  resetSandbox: () => void;
  // UI Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  activeInvoiceOrder: Order | null;
  setActiveInvoiceOrder: (order: Order | null) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const STATUS_SEQUENCE: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

function emptySubscribe() {
  return () => {};
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { locale, dictionary } = useLanguage();
  const { showToast } = useToast();

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const state = useSyncExternalStore(
    subscribeStore,
    getClientSnapshot,
    getServerSnapshot
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  const cartItemCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = state.cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const matchedPromo = state.appliedPromoCode
    ? PROMO_CODES.find((p) => p.code === state.appliedPromoCode)
    : undefined;

  const cartDiscount =
    matchedPromo && cartSubtotal >= matchedPromo.minSpend
      ? Math.round((cartSubtotal * matchedPromo.discountPercent) / 100)
      : 0;

  const netAfterDiscount = Math.max(0, cartSubtotal - cartDiscount);
  const cartShippingFee =
    state.cart.length === 0 || netAfterDiscount >= INITIAL_STORE_CONFIG.freeShippingThreshold
      ? 0
      : INITIAL_STORE_CONFIG.standardShippingFee;

  const cartTotal = netAfterDiscount + cartShippingFee;

  const formatPrice = (amountInLak: number) =>
    formatStorePrice(amountInLak, state.currency, INITIAL_STORE_CONFIG.exchangeRates);

  const setCurrency = (currency: CurrencyCode) => {
    updateStoreState((prev) => ({ ...prev, currency }));
    showToast({
      variant: "info",
      title:
        locale === "lo"
          ? `ປ່ຽນສະກຸນເງິນເປັນ ${currency}`
          : locale === "th"
          ? `เปลี่ยนสกุลเงินเป็น ${currency}`
          : `Switched currency to ${currency}`,
    });
  };

  const login = (user: StoreUser) => {
    updateStoreState((prev) => ({ ...prev, user }));
    showToast({
      variant: "success",
      title:
        locale === "lo"
          ? `ເຂົ້າສູ່ລະບົບສຳເລັດ (${user.name})`
          : locale === "th"
          ? `เข้าสู่ระบบสำเร็จ (${user.name})`
          : `Signed in as ${user.name}`,
      description: user.email,
    });
  };

  const logout = () => {
    updateStoreState((prev) => ({ ...prev, user: null }));
    showToast({
      variant: "info",
      title:
        locale === "lo"
          ? "ອອກຈາກລະບົບແລ້ວ"
          : locale === "th"
          ? "ออกจากระบบเรียบร้อยแล้ว"
          : "Signed out successfully",
    });
  };

  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    const chosenVariant = variant ?? product.variants?.[0];
    updateStoreState((prev) => {
      const existingIndex = prev.cart.findIndex(
        (item) =>
          item.product.id === product.id &&
          item.selectedVariant === chosenVariant
      );
      if (existingIndex > -1) {
        const updatedCart = [...prev.cart];
        const nextQty = Math.min(
          product.stock,
          updatedCart[existingIndex].quantity + quantity
        );
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: nextQty,
        };
        return { ...prev, cart: updatedCart };
      }
      return {
        ...prev,
        cart: [
          ...prev.cart,
          {
            product,
            quantity: Math.min(product.stock, quantity),
            selectedVariant: chosenVariant,
          },
        ],
      };
    });
    showToast({
      variant: "cart",
      title: `${dictionary.catalog.added}: ${product.name[locale]}`,
      description: `${quantity} × ${formatPrice(product.price)}${
        chosenVariant ? ` (${chosenVariant})` : ""
      }`,
    });
  };

  const updateCartQuantity = (
    productId: string,
    variant: string | undefined,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    updateStoreState((prev) => ({
      ...prev,
      cart: prev.cart.map((item) =>
        item.product.id === productId && item.selectedVariant === variant
          ? { ...item, quantity: Math.min(item.product.stock, quantity) }
          : item
      ),
    }));
  };

  const removeFromCart = (productId: string, variant?: string) => {
    const target = state.cart.find(
      (item) => item.product.id === productId && item.selectedVariant === variant
    );
    updateStoreState((prev) => ({
      ...prev,
      cart: prev.cart.filter(
        (item) =>
          !(item.product.id === productId && item.selectedVariant === variant)
      ),
    }));
    showToast({
      variant: "info",
      title:
        locale === "lo"
          ? "ລຶບສິນຄ້າອອກຈາກກະຕ່າແລ້ວ"
          : locale === "th"
          ? "ลบสินค้าออกจากตะกร้าแล้ว"
          : "Removed item from cart",
      description: target ? target.product.name[locale] : undefined,
    });
  };

  const clearCart = () => {
    updateStoreState((prev) => ({
      ...prev,
      cart: [],
      appliedPromoCode: null,
    }));
    showToast({
      variant: "info",
      title:
        locale === "lo"
          ? "ລ້າງກະຕ່າສິນຄ້າທັງໝົດແລ້ວ"
          : locale === "th"
          ? "ล้างตะกร้าสินค้าทั้งหมดแล้ว"
          : "Cart cleared",
    });
  };

  const applyPromoCode = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    const promo = PROMO_CODES.find((p) => p.code === normalized);
    if (!promo || cartSubtotal < promo.minSpend) {
      showToast({
        variant: "error",
        title: dictionary.cart.invalidPromo,
      });
      return false;
    }
    updateStoreState((prev) => ({
      ...prev,
      appliedPromoCode: promo.code,
    }));
    showToast({
      variant: "success",
      title: `${dictionary.cart.promoApplied} (${promo.code})`,
      description: `-${promo.discountPercent}%`,
    });
    return true;
  };

  const removePromoCode = () => {
    updateStoreState((prev) => ({
      ...prev,
      appliedPromoCode: null,
    }));
    showToast({
      variant: "info",
      title:
        locale === "lo"
          ? "ຍົກເລີກລະຫັດສ່ວນຫຼຸດແລ້ວ"
          : locale === "th"
          ? "ยกเลิกรหัสส่วนลดแล้ว"
          : "Promo code removed",
    });
  };

  const placeOrder = (payload: {
    customerName: string;
    customerPhone: string;
    shippingAddress: string;
    paymentMethod: PaymentMethod;
  }): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const trackingRandom = Math.floor(1000000 + Math.random() * 9000000);
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `JGD-ORD-${randomNum}`,
      createdAt: new Date().toISOString(),
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      shippingAddress: payload.shippingAddress,
      items: state.cart.map((c) => ({
        productId: c.product.id,
        sku: c.product.sku,
        name: c.product.name,
        price: c.product.price,
        quantity: c.quantity,
        selectedVariant: c.selectedVariant,
      })),
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shippingFee: cartShippingFee,
      total: cartTotal,
      paymentMethod: payload.paymentMethod,
      status: payload.paymentMethod === "cod" ? "processing" : "shipped",
      promoCode: state.appliedPromoCode ?? undefined,
      trackingNumber: `HAL-${trackingRandom}-LA`,
    };

    updateStoreState((prev) => {
      const updatedProducts = prev.products.map((prod) => {
        const boughtQty = prev.cart
          .filter((c) => c.product.id === prod.id)
          .reduce((s, c) => s + c.quantity, 0);
        if (boughtQty > 0) {
          return { ...prod, stock: Math.max(0, prod.stock - boughtQty) };
        }
        return prod;
      });

      return {
        ...prev,
        products: updatedProducts,
        orders: [newOrder, ...prev.orders],
        cart: [],
        appliedPromoCode: null,
      };
    });

    showToast({
      variant: "success",
      title: dictionary.checkout.orderSuccessTitle,
      description: `${newOrder.orderNumber} • ${formatPrice(newOrder.total)}`,
    });

    return newOrder;
  };

  const advanceOrderStatus = (orderId: string) => {
    const targetOrder = state.orders.find((o) => o.id === orderId);
    updateStoreState((prev) => ({
      ...prev,
      orders: prev.orders.map((order) => {
        if (order.id !== orderId) return order;
        const currentIndex = STATUS_SEQUENCE.indexOf(order.status);
        if (currentIndex === -1 || currentIndex >= STATUS_SEQUENCE.length - 1) {
          return order;
        }
        return { ...order, status: STATUS_SEQUENCE[currentIndex + 1] };
      }),
    }));
    if (targetOrder) {
      showToast({
        variant: "success",
        title:
          locale === "lo"
            ? `ອັບເດດສະຖານະ ${targetOrder.orderNumber} ສຳເລັດ`
            : locale === "th"
            ? `อัปเดตสถานะ ${targetOrder.orderNumber} สำเร็จ`
            : `Updated status for ${targetOrder.orderNumber}`,
      });
    }
  };

  const saveProduct = (product: Product) => {
    const exists = state.products.some((p) => p.id === product.id);
    updateStoreState((prev) => {
      const nextProducts = exists
        ? prev.products.map((p) => (p.id === product.id ? product : p))
        : [product, ...prev.products];
      return { ...prev, products: nextProducts };
    });
    showToast({
      variant: "success",
      title: exists
        ? locale === "lo"
          ? "ອັບເດດຂໍ້ມູນສິນຄ້າສຳເລັດ"
          : locale === "th"
          ? "อัปเดตข้อมูลสินค้าสำเร็จ"
          : "Product updated successfully"
        : locale === "lo"
        ? "ເພີ່ມສິນຄ້າໃໝ່ສຳເລັດ"
        : locale === "th"
        ? "เพิ่มสินค้าใหม่สำเร็จ"
        : "New product added",
      description: `${product.name[locale]} (${product.sku})`,
    });
  };

  const deleteProduct = (productId: string) => {
    const target = state.products.find((p) => p.id === productId);
    updateStoreState((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
      cart: prev.cart.filter((c) => c.product.id !== productId),
    }));
    showToast({
      variant: "info",
      title:
        locale === "lo"
          ? "ລຶບສິນຄ້າອອກຈາກຄັງແລ້ວ"
          : locale === "th"
          ? "ลบสินค้าออกจากคลังแล้ว"
          : "Product deleted from inventory",
      description: target ? target.name[locale] : undefined,
    });
  };

  const resetSandbox = () => {
    resetStoreSandbox();
    showToast({
      variant: "success",
      title: dictionary.settings.resetConfirm,
    });
  };

  return (
    <StoreContext.Provider
      value={{
        isMounted,
        products: state.products,
        cart: state.cart,
        orders: state.orders,
        user: state.user,
        currency: state.currency,
        appliedPromoCode: state.appliedPromoCode,
        searchQuery,
        setSearchQuery,
        cartItemCount,
        cartSubtotal,
        cartDiscount,
        cartShippingFee,
        cartTotal,
        formatPrice,
        setCurrency,
        login,
        logout,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        applyPromoCode,
        removePromoCode,
        placeOrder,
        advanceOrderStatus,
        saveProduct,
        deleteProduct,
        resetSandbox,
        isCartOpen,
        setIsCartOpen,
        quickViewProduct,
        setQuickViewProduct,
        isCheckoutOpen,
        setIsCheckoutOpen,
        activeInvoiceOrder,
        setActiveInvoiceOrder,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return ctx;
}
