"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/context/StoreContext";
import { LoginView } from "@/components/auth/LoginView";

export default function LoginPage() {
  const { user, login, isMounted } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (isMounted && user) {
      if (user.role === "manager") {
        router.replace("/admin/dashboard");
      } else {
        router.replace("/shop");
      }
    }
  }, [isMounted, user, router]);

  if (!isMounted) {
    return null;
  }

  return <LoginView onLogin={login} />;
}

