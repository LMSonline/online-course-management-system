/**
 * Cart types
 */

export interface CartItem {
  courseId: string;
  slug: string;
  title: string;
  price: number; // in VND or base currency
  priceLabel: string; // formatted price string (e.g., "₫2,239,000")
  imageUrl?: string;
  thumbColor?: string; // tailwind gradient class
  instructorName: string;
  rating: number;
  ratingCount: number;
  updatedAt?: string; // ISO date string
  addedAt: string; // ISO date string when added to cart
}

export interface CartState {
  items: CartItem[];
  couponCode?: string;
  discount?: number; // discount amount
  total: number; // total after discount
  subtotal: number; // total before discount
}

