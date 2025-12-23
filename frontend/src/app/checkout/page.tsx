"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Lock, Shield } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCart } from "@/features/cart/hooks/useCart";
import { useCheckout } from "@/features/payment/hooks/useCheckout";
import { useToastStore } from "@/lib/toast";
import { Skeleton } from "@/components/ui/Skeleton";
import { USE_MOCK } from "@/config/runtime";

interface FormData {
  country: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  nameOnCard: string;
  saveCard: boolean;
}

interface FormErrors {
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvc?: string;
  nameOnCard?: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, subtotal, total, discount, couponCode } = useCart();
  const { submitCheckout, loading: checkoutLoading } = useCheckout();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    country: "VN",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
    nameOnCard: "",
    saveCard: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push(`/login?redirect=${encodeURIComponent("/checkout")}`);
      return;
    }

    if (!authLoading && items.length === 0) {
      router.push("/cart");
      return;
    }
  }, [user, authLoading, items.length, router]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Card number validation (at least 12 digits)
    const cardNumberDigits = formData.cardNumber.replace(/\s/g, "");
    if (cardNumberDigits.length < 12) {
      newErrors.cardNumber = "Card number must be at least 12 digits";
    }

    // Expiry validation
    if (!formData.expiryMonth || !formData.expiryYear) {
      newErrors.expiryMonth = "Expiry date is required";
    } else {
      const month = parseInt(formData.expiryMonth, 10);
      const year = parseInt("20" + formData.expiryYear, 10);
      const now = new Date();
      const expiryDate = new Date(year, month - 1);
      if (expiryDate < now) {
        newErrors.expiryMonth = "Card has expired";
      }
    }

    // CVC validation (3-4 digits)
    if (!formData.cvc || formData.cvc.length < 3 || formData.cvc.length > 4) {
      newErrors.cvc = "CVC must be 3-4 digits";
    }

    // Name validation
    if (!formData.nameOnCard.trim()) {
      newErrors.nameOnCard = "Name on card is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      useToastStore.getState().error("Please check your payment details");
      return;
    }

    setSubmitting(true);

    try {
      const result = await submitCheckout({
        items: items.map((item) => ({
          courseId: item.courseId,
          price: item.price,
        })),
        couponCode,
        discount,
        billingAddress: {
          country: formData.country,
        },
        paymentMethod: {
          type: "card",
          cardNumber: formData.cardNumber.replace(/\s/g, ""),
          expiryMonth: formData.expiryMonth,
          expiryYear: formData.expiryYear,
          cvc: formData.cvc,
          nameOnCard: formData.nameOnCard,
          saveCard: formData.saveCard,
        },
      });

      if (result) {
        router.push(`/checkout/success?orderId=${result.orderId}&paymentId=${result.paymentId}`);
      } else {
        useToastStore.getState().error("Payment failed. Please try again.");
      }
    } catch (error) {
      useToastStore.getState().error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "");
    // Add spaces every 4 digits
    value = value.match(/.{1,4}/g)?.join(" ") || value;
    setFormData({ ...formData, cardNumber: value });
    if (errors.cardNumber) {
      setErrors({ ...errors, cardNumber: undefined });
    }
  };

  if (loading || authLoading) {
    return (
      <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
        <section className="mx-auto w-full max-w-6xl">
          <Skeleton className="h-8 w-48 mb-6" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-96 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        </section>
      </main>
    );
  }

  if (!user || items.length === 0) {
    return null; // Redirecting
  }

  const originalTotal = discount && discount > 0 ? subtotal : total;
  const discountTotal = discount || 0;

  return (
    <main className="px-4 sm:px-6 lg:px-10 xl:px-16 py-6 md:py-8">
      <section className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <Link
            href="/cart"
            className="text-sm text-slate-400 hover:text-slate-200 transition"
          >
            Cancel
          </Link>
        </div>

        {/* Demo Mode Banner */}
        {USE_MOCK && (
          <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/10">
            <p className="text-sm text-amber-300">
              <strong>Demo Mode:</strong> Payment backend not available yet. This is a mock checkout flow.
            </p>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left Column: Billing & Payment */}
          <div className="space-y-6">
            {/* Billing Address */}
            <div className="p-6 rounded-xl border border-white/10 bg-slate-950/80">
              <h2 className="text-xl font-semibold mb-4">Billing address</h2>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Country
                </label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 text-slate-200 focus:outline-none focus:border-[var(--brand-500)]"
                >
                  <option value="VN">Vietnam</option>
                  <option value="US">United States</option>
                  <option value="GB">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                </select>
                <p className="mt-2 text-xs text-slate-400">
                  You will be charged in VND. Currency conversion may apply.
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="p-6 rounded-xl border border-white/10 bg-slate-950/80">
              <h2 className="text-xl font-semibold mb-4">Payment method</h2>
              
              {/* Card Option */}
              <div className="flex items-center gap-3 p-4 rounded-lg border border-[var(--brand-500)]/50 bg-[var(--brand-500)]/10">
                <input
                  type="radio"
                  id="card"
                  name="paymentMethod"
                  value="card"
                  checked
                  readOnly
                  className="w-4 h-4 text-[var(--brand-600)]"
                />
                <label htmlFor="card" className="flex-1 flex items-center gap-2 cursor-pointer">
                  <CreditCard size={20} className="text-slate-300" />
                  <span className="text-slate-200 font-medium">Card</span>
                </label>
                <div className="flex gap-2">
                  <span className="text-xs text-slate-400">Visa</span>
                  <span className="text-xs text-slate-400">Mastercard</span>
                  <span className="text-xs text-slate-400">Amex</span>
                </div>
              </div>

              {/* Card Form */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Card number
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border ${
                      errors.cardNumber ? "border-red-500" : "border-white/10"
                    } text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[var(--brand-500)]`}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-xs text-red-400">{errors.cardNumber}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Expiry date
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={formData.expiryMonth}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                          setFormData({ ...formData, expiryMonth: value });
                          if (errors.expiryMonth) {
                            setErrors({ ...errors, expiryMonth: undefined });
                          }
                        }}
                        placeholder="MM"
                        maxLength={2}
                        className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border ${
                          errors.expiryMonth ? "border-red-500" : "border-white/10"
                        } text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[var(--brand-500)]`}
                      />
                      <input
                        type="text"
                        value={formData.expiryYear}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 2);
                          setFormData({ ...formData, expiryYear: value });
                          if (errors.expiryYear) {
                            setErrors({ ...errors, expiryYear: undefined });
                          }
                        }}
                        placeholder="YY"
                        maxLength={2}
                        className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border ${
                          errors.expiryYear ? "border-red-500" : "border-white/10"
                        } text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[var(--brand-500)]`}
                      />
                    </div>
                    {errors.expiryMonth && (
                      <p className="mt-1 text-xs text-red-400">{errors.expiryMonth}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      CVC
                    </label>
                    <input
                      type="text"
                      value={formData.cvc}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setFormData({ ...formData, cvc: value });
                        if (errors.cvc) {
                          setErrors({ ...errors, cvc: undefined });
                        }
                      }}
                      placeholder="123"
                      maxLength={4}
                      className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border ${
                        errors.cvc ? "border-red-500" : "border-white/10"
                      } text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[var(--brand-500)]`}
                    />
                    {errors.cvc && (
                      <p className="mt-1 text-xs text-red-400">{errors.cvc}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Name on card
                  </label>
                  <input
                    type="text"
                    value={formData.nameOnCard}
                    onChange={(e) => {
                      setFormData({ ...formData, nameOnCard: e.target.value });
                      if (errors.nameOnCard) {
                        setErrors({ ...errors, nameOnCard: undefined });
                      }
                    }}
                    placeholder="John Doe"
                    className={`w-full px-4 py-2.5 rounded-lg bg-slate-900/60 border ${
                      errors.nameOnCard ? "border-red-500" : "border-white/10"
                    } text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-[var(--brand-500)]`}
                  />
                  {errors.nameOnCard && (
                    <p className="mt-1 text-xs text-red-400">{errors.nameOnCard}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveCard"
                    checked={formData.saveCard}
                    onChange={(e) => setFormData({ ...formData, saveCard: e.target.checked })}
                    className="w-4 h-4 rounded border-white/20 text-[var(--brand-600)] focus:ring-[var(--brand-500)]"
                  />
                  <label htmlFor="saveCard" className="text-sm text-slate-300">
                    Securely save this card for future purchases
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <div className="sticky top-4 p-6 rounded-xl border border-white/10 bg-slate-950/80 space-y-4">
              <h2 className="text-xl font-semibold">Order summary</h2>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm text-slate-400">
                  <span>Original Price</span>
                  <span>{formatPrice(originalTotal)}</span>
                </div>
                {discountTotal > 0 && (
                  <div className="flex justify-between text-sm text-[var(--brand-300)]">
                    <span>Discount</span>
                    <span>-{formatPrice(discountTotal)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-slate-400 pt-2">
                  {items.length} {items.length === 1 ? "course" : "courses"}
                </p>
              </div>

              {/* Terms */}
              <p className="text-xs text-slate-400">
                By completing your purchase, you agree to these{" "}
                <Link href="/terms" className="text-[var(--brand-400)] hover:underline">
                  Terms of Service
                </Link>
                .
              </p>

              {/* Pay Button */}
              <form onSubmit={handleSubmit}>
                <button
                  type="submit"
                  disabled={submitting || checkoutLoading}
                  className="w-full px-6 py-3.5 rounded-xl bg-[var(--brand-600)] text-white font-semibold hover:bg-[var(--brand-700)] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting || checkoutLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      Pay {formatPrice(total)}
                    </>
                  )}
                </button>
              </form>

              {/* Money-back guarantee */}
              <div className="flex items-start gap-2 pt-4 border-t border-white/10">
                <Shield size={16} className="text-[var(--brand-400)] mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-400">
                  <strong className="text-slate-300">30-day money-back guarantee</strong>
                  <br />
                  Full refund if you're not satisfied
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
