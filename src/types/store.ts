export type Locale = "lo" | "th" | "en";

export type CurrencyCode = "LAK" | "THB" | "USD";

export type UserRole = "customer" | "manager";

export interface LocalizedText {
  lo: string;
  th: string;
  en: string;
}

export interface StoreUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  address?: string;
}

export type CategoryId =
  | "all"
  | "electronics"
  | "fashion"
  | "home"
  | "gadgets"
  | "lifestyle";

export interface CategoryItem {
  id: CategoryId;
  name: LocalizedText;
  iconName: string;
}

export interface Product {
  id: string;
  sku: string;
  name: LocalizedText;
  description: LocalizedText;
  category: Exclude<CategoryId, "all">;
  price: number; // Base price in LAK
  originalPrice?: number; // For discount badge in LAK
  stock: number;
  rating: number;
  reviewsCount: number;
  badge?: "hot" | "new" | "sale";
  imageGradient: string;
  iconName: string;
  specs: string[];
  variants?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export type PaymentMethod = "qr_onepay" | "credit_card" | "cod";

export interface OrderItem {
  productId: string;
  sku: string;
  name: LocalizedText;
  price: number;
  quantity: number;
  selectedVariant?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  promoCode?: string;
  trackingNumber: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  minSpend: number;
  description: LocalizedText;
}

export interface StoreConfig {
  storeName: string;
  tagline: LocalizedText;
  email: string;
  phone: string;
  address: LocalizedText;
  freeShippingThreshold: number; // LAK
  standardShippingFee: number; // LAK
  taxRate: number; // Percentage
  exchangeRates: Record<CurrencyCode, number>;
}

