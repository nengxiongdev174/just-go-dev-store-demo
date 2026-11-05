"use client";

import React, { useState } from "react";
import { StoreNavbar, type StoreTab } from "@/components/shared/StoreNavbar";
import { StoreFooter } from "@/components/shared/StoreFooter";
import { StorefrontView } from "@/components/storefront/StorefrontView";
import { ProductQuickViewModal } from "@/components/storefront/ProductQuickViewModal";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CheckoutModal } from "@/components/checkout/CheckoutModal";
import { OrdersView } from "@/components/orders/OrdersView";
import { OrderInvoiceModal } from "@/components/orders/OrderInvoiceModal";
import { InventoryAdminView } from "@/components/admin/InventoryAdminView";
import { StoreSettingsView } from "@/components/settings/StoreSettingsView";
import { LoginModal } from "@/components/auth/LoginModal";

export default function StoreHomePage() {
  const [activeTab, setActiveTab] = useState<StoreTab>("shop");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <StoreNavbar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === "shop" && (
          <StorefrontView
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery("")}
            onGoToOrders={() => setActiveTab("orders")}
          />
        )}

        {activeTab === "orders" && <OrdersView />}

        {activeTab === "admin" && <InventoryAdminView />}

        {activeTab === "settings" && <StoreSettingsView />}
      </main>

      <StoreFooter />

      {/* Global Interactive Modals & Drawers */}
      <ProductQuickViewModal />
      <CartDrawer />
      <CheckoutModal onOrderCompleted={() => setActiveTab("orders")} />
      <OrderInvoiceModal />
      <LoginModal />
    </div>
  );
}
