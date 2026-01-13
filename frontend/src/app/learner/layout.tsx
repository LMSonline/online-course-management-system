import LearnerNavbar from "@/core/components/learner/navbar/LearnerNavbar";
import { CartProvider } from "@/core/components/learner/cart/CartContext";

export default function LearnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <LearnerNavbar />
      <main className="min-h-[72vh]">{children}</main>
    </CartProvider>
  );
}
