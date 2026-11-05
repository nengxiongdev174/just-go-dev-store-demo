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

interface StoreContextValue {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  user: StoreUser | null;
  currency: CurrencyCode;
  appliedPromoCode: string | null;
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
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const STATUS_SEQUENCE: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(
    subscribeStore,
    getClientSnapshot,
    getServerSnapshot
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

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
  };

  const login = (user: StoreUser) => {
    updateStoreState((prev) => ({ ...prev, user }));
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    updateStoreState((prev) => ({ ...prev, user: null }));
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
    updateStoreState((prev) => ({
      ...prev,
      cart: prev.cart.filter(
        (item) =>
          !(item.product.id === productId && item.selectedVariant === variant)
      ),
    }));
  };

  const clearCart = () => {
    updateStoreState((prev) => ({
      ...prev,
      cart: [],
      appliedPromoCode: null,
    }));
  };

  const applyPromoCode = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    const promo = PROMO_CODES.find((p) => p.code === normalized);
    if (!promo || cartSubtotal < promo.minSpend) {
      return false;
    }
    updateStoreState((prev) => ({
      ...prev,
      appliedPromoCode: promo.code,
    }));
    return true;
  };

  const removePromoCode = () => {
    updateStoreState((prev) => ({
      ...prev,
      appliedPromoCode: null,
    }));
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

    return newOrder;
  };

  const advanceOrderStatus = (orderId: string) => {
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
  };

  const saveProduct = (product: Product) => {
    updateStoreState((prev) => {
      const exists = prev.products.some((p) => p.id === product.id);
      const nextProducts = exists
        ? prev.products.map((p) => (p.id === product.id ? product : p))
        : [product, ...prev.products];
      return { ...prev, products: nextProducts };
    });
  };

  const deleteProduct = (productId: string) => {
    updateStoreState((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.id !== productId),
      cart: prev.cart.filter((c) => c.product.id !== productId),
    }));
  };

  const resetSandbox = () => {
    resetStoreSandbox();
  };

  return (
    <StoreContext.Provider
      value={{
        products: state.products,
        cart: state.cart,
        orders: state.orders,
        user: state.user,
        currency: state.currency,
        appliedPromoCode: state.appliedPromoCode,
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
        isLoginModalOpen,
        setIsLoginModalOpen,
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

