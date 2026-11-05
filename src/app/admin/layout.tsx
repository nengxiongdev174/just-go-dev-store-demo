"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { AdminSidebar } from "@/components/shared/AdminSidebar";
import { OrderInvoiceModal } from "@/components/orders/OrderInvoiceModal";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, isMounted } = useStore();

  useEffect(() => {
    if (isMounted) {
      if (!user) {
        router.replace("/login");
      } else if (user.role !== "manager") {
        router.replace("/shop");
      }
    }
  }, [isMounted, user, router]);

  if (!isMounted || !user || user.role !== "manager") {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground transition-colors">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </div>
      <OrderInvoiceModal />
    </div>
  );
}

