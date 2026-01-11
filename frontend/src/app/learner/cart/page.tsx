"use client";

import React, { useState } from "react";
import { useCart } from "@/core/components/learner/cart/CartContext";
import { CartList } from "@/core/components/learner/cart/CartList";
import { CartSummary } from "@/core/components/learner/cart/CartSummary";
import { EmptyCart } from "@/core/components/learner/cart/EmptyCart";

export default function CartPage() {
	const { cart, removeCourse, removeSelected } = useCart();
	const [selected, setSelected] = useState<string[]>(cart.map((c) => c.id));

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
		<div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8">
			<div>
				<h1 className="text-3xl font-bold text-white mb-6">Your Cart</h1>
				<CartList
					courses={cart}
					selected={selected}
					onCheck={handleCheck}
					onRemove={removeCourse}
					onEnroll={(id) => alert(`Enroll flow for course ${id}`)}
				/>
			</div>
			<div>
				<CartSummary
					total={total}
					count={selected.length}
					onCheckout={() => alert("Checkout flow for selected courses")}
				/>
			</div>
		</div>
	);
}
