import {
  type Product,
  type CartItem,
  type Order,
  type StoreUser,
  type CurrencyCode,
} from "@/types/store";
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
} from "@/data";

const STORAGE_KEY = "jgd_store_sandbox_v1";
const SESSION_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours Silent TTL Auto-Reset

export interface StoreSandboxState {
  timestamp: number;
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  user: StoreUser | null;
  currency: CurrencyCode;
  appliedPromoCode: string | null;
}

export const SERVER_SNAPSHOT: StoreSandboxState = {
  timestamp: 0,
  products: INITIAL_PRODUCTS,
  cart: [
    {
      product: INITIAL_PRODUCTS[0],
      quantity: 1,
      selectedVariant: INITIAL_PRODUCTS[0].variants?.[0],
    },
  ],
  orders: INITIAL_ORDERS,
  user: null,
  currency: "LAK",
  appliedPromoCode: null,
};

let cachedClientState: StoreSandboxState | null = null;
const listeners = new Set<() => void>();

function notifyListeners() {
  for (const listener of listeners) {
    listener();
  }
}

export function subscribeStore(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getServerSnapshot(): StoreSandboxState {
  return SERVER_SNAPSHOT;
}

export function getClientSnapshot(): StoreSandboxState {
  if (typeof window === "undefined") {
    return SERVER_SNAPSHOT;
  }

  if (cachedClientState) {
    return cachedClientState;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoreSandboxState;
      const now = Date.now();
      if (parsed.timestamp && now - parsed.timestamp < SESSION_TTL_MS) {
        cachedClientState = parsed;
        return cachedClientState;
      }
    }
  } catch {
    // Fallback to initial state if storage fails or is corrupted
  }

  const freshState: StoreSandboxState = {
    ...SERVER_SNAPSHOT,
    timestamp: Date.now(),
  };
  cachedClientState = freshState;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(freshState));
  } catch {
    // Ignore quota errors
  }
  return cachedClientState;
}

export function updateStoreState(
  updater: (prev: StoreSandboxState) => StoreSandboxState
) {
  const current = getClientSnapshot();
  const next: StoreSandboxState = {
    ...updater(current),
    timestamp: Date.now(),
  };
  cachedClientState = next;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Ignore quota errors
    }
  }
  notifyListeners();
}

export function resetStoreSandbox() {
  const current = getClientSnapshot();
  const freshState: StoreSandboxState = {
    ...SERVER_SNAPSHOT,
    user: current.user,
    timestamp: Date.now(),
  };
  cachedClientState = freshState;
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(freshState));
    } catch {
      // Ignore quota errors
    }
  }
  notifyListeners();
}

