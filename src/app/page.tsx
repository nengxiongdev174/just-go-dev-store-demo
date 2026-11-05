"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useStore } from "@/context/StoreContext";

export default function RootPage() {
  const router = useRouter();
  const { user, isMounted } = useStore();

  useEffect(() => {
    if (isMounted) {
      if (user) {
        if (user.role === "manager") {
          router.replace("/admin/dashboard");
        } else {
          router.replace("/shop");
        }
      } else {
        router.replace("/login");
      }
    }
  }, [isMounted, user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-2.5">
        <div className="w-10 h-10 relative flex items-center justify-center animate-pulse">
          <Image
            src="/jgd-latets-logo-no-bg.png"
            alt="Logo"
            width={40}
            height={40}
            className="w-full h-full object-contain"
          />
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          Loading JustGoDev Store...
        </span>
      </div>
    </div>
  );
}
