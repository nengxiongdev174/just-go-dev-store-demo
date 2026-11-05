"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { StorefrontView } from "@/components/storefront/StorefrontView";

export default function ShopPage() {
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useStore();

  return (
    <StorefrontView
      searchQuery={searchQuery}
      onClearSearch={() => setSearchQuery("")}
      onGoToOrders={() => router.push("/orders")}
    />
  );
}

