"use client";

import React, { useState } from "react";
import {
  X,
  QrCode,
  CreditCard,
  Banknote,
  CheckCircle2,
  MapPin,
  Phone,
  User,
  FileText,
  AlertCircle,
} from "lucide-react";
import { type Order, type PaymentMethod } from "@/types/store";
import { useLanguage } from "@/context/LanguageContext";
import { useStore } from "@/context/StoreContext";

interface CheckoutModalProps {
  onOrderCompleted: () => void;
}

export function CheckoutModal({ onOrderCompleted }: CheckoutModalProps) {
  const { dictionary } = useLanguage();
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    user,
    cartTotal,
    formatPrice,
    placeOrder,
    setActiveInvoiceOrder,
  } = useStore();

  const [customerName, setCustomerName] = useState(
    user?.name ?? "Somsack Phommavong"
  );
  const [customerPhone, setCustomerPhone] = useState(
    user?.phone ?? "020 5899 1234"
  );
  const [shippingAddress, setShippingAddress] = useState(
    user?.address ?? "ບ້ານໂພນສະຫວັນ, ເມືອງສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ"
  );
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("qr_onepay");
  const [errorMsg, setErrorMsg] = useState("");
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const handleClose = () => {
    setCompletedOrder(null);
    setErrorMsg("");
    setIsCheckoutOpen(false);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !customerName.trim() ||
      !customerPhone.trim() ||
      !shippingAddress.trim()
    ) {
      setErrorMsg(dictionary.checkout.requiredWarning);
      return;
    }
    const created = placeOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      shippingAddress: shippingAddress.trim(),
      paymentMethod,
    });
    setCompletedOrder(created);
  };

  const handleViewOrderAndInvoice = () => {
    if (completedOrder) {
      setActiveInvoiceOrder(completedOrder);
    }
    handleClose();
    onOrderCompleted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-xl rounded-3xl border border-border shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-extrabold text-lg text-foreground">
              {completedOrder
                ? dictionary.checkout.orderSuccessTitle
                : dictionary.checkout.title}
            </h2>
            <p className="text-xs text-muted-foreground">
              {completedOrder
                ? completedOrder.orderNumber
                : dictionary.checkout.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-foreground cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {completedOrder ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-20 h-20 rounded-3xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="font-mono text-xs font-bold px-3 py-1 rounded-full bg-secondary text-foreground">
                {completedOrder.orderNumber} • {completedOrder.trackingNumber}
              </span>
              <h3 className="text-xl font-extrabold text-foreground pt-1">
                {dictionary.checkout.orderSuccessTitle}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                {dictionary.checkout.orderSuccessDesc}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-secondary/50 border border-border text-sm flex items-center justify-between">
              <span className="text-muted-foreground font-medium">
                {dictionary.orders.total}
              </span>
              <span className="text-lg font-extrabold text-primary">
                {formatPrice(completedOrder.total)}
              </span>
            </div>

            <button
              type="button"
              onClick={handleViewOrderAndInvoice}
              className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span>{dictionary.checkout.viewOrderBtn}</span>
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmitOrder}
            className="p-6 overflow-y-auto space-y-5"
          >
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Shipping Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-primary" />
                  {dictionary.checkout.recipientName}
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder={dictionary.checkout.recipientNamePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/40 focus:bg-card text-xs sm:text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  {dictionary.checkout.phoneNumber}
                </label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder={dictionary.checkout.phonePlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/40 focus:bg-card text-xs sm:text-sm focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                {dictionary.checkout.shippingAddress}
              </label>
              <textarea
                rows={2}
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                placeholder={dictionary.checkout.addressPlaceholder}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-secondary/40 focus:bg-card text-xs sm:text-sm focus:border-primary focus:outline-none resize-none"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-foreground block">
                {dictionary.checkout.paymentMethod}
              </label>

              <div className="space-y-2">
                {(
                  [
                    {
                      id: "qr_onepay" as const,
                      title: dictionary.checkout.qrOnePay,
                      desc: dictionary.checkout.qrOnePayDesc,
                      icon: QrCode,
                    },
                    {
                      id: "credit_card" as const,
                      title: dictionary.checkout.creditCard,
                      desc: dictionary.checkout.creditCardDesc,
                      icon: CreditCard,
                    },
                    {
                      id: "cod" as const,
                      title: dictionary.checkout.cod,
                      desc: dictionary.checkout.codDesc,
                      icon: Banknote,
                    },
                  ] as const
                ).map((method) => {
                  const Icon = method.icon;
                  const active = paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`w-full p-3.5 rounded-2xl border text-left flex items-center gap-3.5 transition-all cursor-pointer ${
                        active
                          ? "border-primary bg-primary/5 shadow-xs"
                          : "border-border bg-secondary/30 hover:border-primary/40"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-xs sm:text-sm text-foreground">
                          {method.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {method.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Simulated QR Code Preview when OnePay is selected */}
            {paymentMethod === "qr_onepay" && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/10 via-indigo-500/10 to-violet-500/10 border border-indigo-500/20 flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-white p-2 flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
                  <QrCode className="w-16 h-16 text-slate-900" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-600 text-white">
                    BCEL OnePay • LAO QR
                  </span>
                  <p className="text-xs font-semibold text-foreground">
                    {dictionary.checkout.scanQrPrompt}
                  </p>
                  <p className="text-sm font-extrabold text-primary">
                    {formatPrice(cartTotal)}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {dictionary.checkout.confirmOrder} • {formatPrice(cartTotal)}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

