# Cart & Checkout Implementation Report

## Summary

Successfully implemented an Udemy-like shopping cart system with add-to-cart functionality, cart page, and checkout placeholder. The implementation uses a local cart store (Zustand + localStorage) since backend cart endpoints are not available.

---

## Files Created

### Cart Domain
1. **`src/features/cart/types/cart.types.ts`**
   - `CartItem` interface
   - `CartState` interface

2. **`src/features/cart/services/cart.service.ts`**
   - Local adapter service that uses cart store
   - API: `getCart()`, `addToCart()`, `removeFromCart()`, `clearCart()`, `applyCoupon()`, `removeCoupon()`, `isInCart()`, `getCartItemCount()`
   - Designed to be easily swapped with backend API later

3. **`src/features/cart/hooks/useCart.ts`**
   - React hook to access cart state and actions

### Cart Store
4. **`src/store/cart.store.ts`**
   - Zustand store with localStorage persistence (key: `lms_cart_v1`)
   - State: `items`, `couponCode`, `discount`, `total`, `subtotal`
   - Actions: `addItem()`, `removeItem()`, `clearCart()`, `updateCoupon()`, `removeCoupon()`, `getItemCount()`, `isInCart()`
   - Auto-calculates totals on hydration

### UI Components
5. **`src/components/cart/CartBadge.tsx`**
   - Cart icon with item count badge
   - Links to `/cart`

6. **`src/features/courses/components/CourseHoverCard.tsx`**
   - Hover card component for course preview
   - Shows course details, "Add to cart" button, wishlist icon
   - Desktop: appears on hover
   - Mobile: can be triggered via click

### Pages
7. **`src/app/cart/page.tsx`**
   - Shopping cart page with:
     - Left: Cart items list (image, title, author, rating, price, remove/wishlist actions)
     - Right: Summary (subtotal, discount, total, coupon input, "Proceed to Checkout" button)
   - Empty state when cart is empty
   - Loading skeleton
   - Toast notifications for actions

8. **`src/app/checkout/page.tsx`**
   - Checkout placeholder page
   - Shows banner that payment backend is not available
   - Lists expected payment endpoints
   - Requires authentication (redirects to login if not authenticated)
   - Shows order summary

---

## Files Modified

1. **`src/core/components/learner/catalog/CourseCard.tsx`**
   - Added hover card functionality (desktop)
   - Added "Add to cart" button click handler
   - Shows "In cart" state if course already in cart
   - Integrated with cart service

2. **`src/core/components/public/Navbar.tsx`**
   - Replaced static cart icon with `CartBadge` component
   - Shows item count badge

---

## Features Implemented

### Add-to-Cart UX
- ✅ Hover card on course tiles (desktop) with course preview
- ✅ "Add to cart" button on course cards
- ✅ Toast notification when item added
- ✅ Cart badge updates with item count
- ✅ "In cart" state indicator

### Cart Page
- ✅ List of cart items with details
- ✅ Remove item functionality
- ✅ Wishlist button (UI only, not wired to backend)
- ✅ Coupon code input and application (mock 10% discount)
- ✅ Price summary (subtotal, discount, total)
- ✅ "Proceed to Checkout" button
- ✅ Empty state with "Browse courses" link
- ✅ Loading skeleton

### Checkout Page
- ✅ Authentication check (redirects to login if not authenticated)
- ✅ Empty cart check (redirects to cart if empty)
- ✅ Banner showing payment backend not available
- ✅ Order summary display
- ✅ Lists expected payment endpoints

---

## Data & State Design

### Cart Store (Zustand + localStorage)
- **Storage Key:** `lms_cart_v1`
- **Persistence:** localStorage (survives page refresh)
- **Cart Item Structure:**
  ```typescript
  {
    courseId: string;
    slug: string;
    title: string;
    price: number;
    priceLabel: string;
    imageUrl?: string;
    thumbColor?: string;
    instructorName: string;
    rating: number;
    ratingCount: number;
    updatedAt?: string;
    addedAt: string; // ISO timestamp
  }
  ```

### Service API
The cart service provides a consistent API that can be swapped with backend API:
- `getCart()` - Get current cart state
- `addToCart(item)` - Add course to cart
- `removeFromCart(courseId)` - Remove course from cart
- `clearCart()` - Clear entire cart
- `applyCoupon(code, discount?)` - Apply coupon code
- `removeCoupon()` - Remove coupon
- `isInCart(courseId)` - Check if course is in cart
- `getCartItemCount()` - Get total item count

---

## Backend Integration Status

### Cart Endpoints
❌ **NOT AVAILABLE** - No cart endpoints in backend API contract

**Current Implementation:**
- Uses local cart store (Zustand + localStorage)
- Service layer designed to be swapped with backend API when available

**Future Migration:**
When backend cart endpoints are available, update `src/features/cart/services/cart.service.ts` to call backend API instead of using store directly.

### Payment Endpoints
❌ **NOT IMPLEMENTED** - PaymentController is empty (stub class)

**Expected Endpoints (from API_CONTRACT.md):**
- `POST /api/v1/payments/checkout` - Create payment order
- `POST /api/v1/payments/webhook` - Payment provider webhook
- `GET /api/v1/payments/{id}` - Get payment status
- `GET /api/v1/payments` - List payment history
- `POST /api/v1/payments/{id}/confirm` - Confirm payment

**Current Implementation:**
- Checkout page shows banner that payment backend is not available
- Lists expected endpoints for reference

---

## Routes

### New Routes
- **`/cart`** - Shopping cart page
- **`/checkout`** - Checkout page (placeholder)

### Existing Routes (Enhanced)
- Course cards on explore/catalog/search/topic pages now have add-to-cart functionality

---

## UX States

### Cart Page
- ✅ **Loading:** Skeleton while hydrating
- ✅ **Empty:** EmptyState with "Browse courses" button
- ✅ **Error:** Toast notifications for errors
- ✅ **Success:** Toast notifications for actions (add, remove, coupon)

### Checkout Page
- ✅ **Loading:** Skeleton while checking auth
- ✅ **Unauthenticated:** Redirects to `/login?redirect=/checkout`
- ✅ **Empty Cart:** Redirects to `/cart`
- ✅ **Backend Unavailable:** Shows banner with expected endpoints

---

## Auth Rules

- ✅ **Cart:** Public (no login required, like Udemy)
- ✅ **Checkout:** Requires authentication
  - If not authenticated → redirects to `/login?redirect=/checkout`
  - After login → redirects back to checkout

---

## Styling

- ✅ Matches existing design system
- ✅ Uses existing CSS variables (`--brand-600`, `--brand-300`, etc.)
- ✅ Reuses existing components (Button, Skeleton, EmptyState, Toast, SafeImage)
- ✅ Responsive design (mobile-friendly)
- ✅ Consistent with existing UI patterns

---

## Testing Checklist

### Add-to-Cart
- [ ] Hover over course card shows hover card (desktop)
- [ ] Click "Add to cart" adds item to cart
- [ ] Toast notification appears
- [ ] Cart badge updates with count
- [ ] "In cart" state shows on course card
- [ ] Clicking "In cart" navigates to cart page

### Cart Page
- [ ] Cart items display correctly
- [ ] Remove item works
- [ ] Coupon code input and application works
- [ ] Price calculations are correct
- [ ] Empty state shows when cart is empty
- [ ] "Proceed to Checkout" navigates to checkout

### Checkout Page
- [ ] Requires authentication (redirects if not logged in)
- [ ] Shows banner about payment backend
- [ ] Displays order summary
- [ ] Redirects to cart if cart is empty

---

## Switching to Real API (Future)

When backend cart endpoints are available:

1. **Update `src/features/cart/services/cart.service.ts`:**
   ```typescript
   // Replace store calls with API calls
   export async function getCart(): Promise<CartState> {
     const response = await apiClient.get<ApiResponse<CartState>>("/cart");
     return unwrapApiResponse(response.data);
   }
   
   export async function addToCart(item: Omit<CartItem, "addedAt">): Promise<void> {
     await apiClient.post("/cart/items", item);
   }
   
   // ... etc
   ```

2. **Keep store for optimistic updates (optional):**
   - Use store for immediate UI updates
   - Sync with backend in background
   - Handle conflicts if needed

3. **Update cart store:**
   - Remove localStorage persistence (or keep as fallback)
   - Add sync actions to fetch from backend on mount

---

## Mock vs Real Mode

**Current Implementation:**
- Always uses local cart store (no backend endpoints available)
- No `USE_MOCK` toggle needed for cart (it's always "local")

**Future:**
- When backend cart endpoints are available, add `USE_MOCK` toggle to `cart.service.ts`
- Similar to how `courses.service.ts` handles mock/real mode

---

## Known Limitations

1. **Coupon Validation:** Currently uses mock 10% discount. Real implementation should call backend API.
2. **Wishlist:** UI exists but not wired to backend (no wishlist endpoints in API contract).
3. **Save for Later:** Not implemented (can be added later).
4. **Cart Sync:** No backend sync (cart is local-only). When user logs in, cart doesn't sync with backend.
5. **Price Extraction:** Price is extracted from `priceLabel` string (e.g., "₫2,239,000" → 2239000). This is fragile and should be improved when backend provides numeric price.

---

## Files Summary

### Created (8 files)
- `src/features/cart/types/cart.types.ts`
- `src/features/cart/services/cart.service.ts`
- `src/features/cart/hooks/useCart.ts`
- `src/store/cart.store.ts`
- `src/components/cart/CartBadge.tsx`
- `src/features/courses/components/CourseHoverCard.tsx`
- `src/app/cart/page.tsx`
- `src/app/checkout/page.tsx`

### Modified (2 files)
- `src/core/components/learner/catalog/CourseCard.tsx`
- `src/core/components/public/Navbar.tsx`

---

**Implementation Date:** 2025-01-27  
**Status:** ✅ Complete and Ready for Testing

