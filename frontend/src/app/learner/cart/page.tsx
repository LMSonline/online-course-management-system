"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { CartCourse, useCart } from "@/core/components/learner/cart/CartContext";
import { CartList } from "@/core/components/learner/cart/CartList";
import { CartSummary } from "@/core/components/learner/cart/CartSummary";
import { EmptyCart } from "@/core/components/learner/cart/EmptyCart";

const EnrollStepper = dynamic(
  () => import("@/core/components/learner/enroll/EnrollStepper"),
  { ssr: false }
);

export default function CartPage() {
  const { cart, removeCourse } = useCart();
  const [selected, setSelected] = useState<string[]>(cart.map((c) => c.id));
  const [showEnroll, setShowEnroll] = useState(false);
  const [enrollCourse, setEnrollCourse] = useState<CartCourse | null>(null);

  const handleCheck = (id: string, checked: boolean) => {
    setSelected((prev) =>
      checked ? [...prev, id] : prev.filter((sid) => sid !== id)
    );
  };

  const total = cart
    .filter((c) => selected.includes(c.id))
    .reduce((sum, c) => sum + c.price, 0);

  if (cart.length === 0) return <EmptyCart />;

  return (
    <>
      {/* MAIN PAGE */}
      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
        <div>
          <h1 className="mb-6 text-3xl font-bold text-white">Your Cart</h1>
          <CartList
            courses={cart}
            selected={selected}
            onCheck={handleCheck}
            onRemove={removeCourse}
            onEnroll={(id) => {
              const course = cart.find((c) => c.id === id);
              if (course) {
                setEnrollCourse(course);
                setShowEnroll(true);
              }
            }}
          />
        </div>
        <CartSummary
          total={total}
          count={selected.length}
          onCheckout={() => alert("Checkout flow for selected courses")}
        />
      </div>

      {/* ENROLL MODAL – BACKDROP ONLY */}
      {showEnroll && enrollCourse && (
        <div
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-black/60 backdrop-blur-sm
          "
        >
          <EnrollStepper
            course={enrollCourse}
            onClose={() => setShowEnroll(false)}
          />
        </div>
      )}
    </>
  );
}
