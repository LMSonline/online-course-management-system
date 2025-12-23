# Runtime Error Fixes

## Summary

Fixed three critical runtime errors:
1. **Auth double `/api/v1` prefix** - Fixed response unwrapping
2. **Courses `.map()` undefined crash** - Added robust response unwrapping
3. **Next/Image 400 errors** - Created SafeImage component with fallback

---

## Changes Made

### 1. Response Unwrapping Utility
**File:** `src/services/core/unwrap.ts` (NEW)

- `unwrapApiResponse<T>()` - Handles `ApiResponse<T>` wrapper
- `unwrapPage<T>()` - Handles paginated responses with fallback to empty array

### 2. Safe Image Component
**File:** `src/components/shared/SafeImage.tsx` (NEW)

- Wraps Next.js `Image` component
- Automatic fallback to placeholder on error
- Prevents 400 errors from missing images

### 3. Updated Services

**Files Modified:**
- `src/features/auth/services/auth.service.ts` - Uses `unwrapApiResponse()`
- `src/features/courses/services/courses.service.ts` - Uses `unwrapPage()` for safe array access
- `src/features/profile/services/profile.service.ts` - Uses `unwrapApiResponse()`
- `src/features/recommendation/services/recommendation.service.ts` - Uses `unwrapApiResponse()`

### 4. Updated Components

**Files Modified:**
- `src/core/components/public/explore/ExploreCategories.tsx` - Uses `SafeImage` instead of `Image`
- `src/app/(public)/explore/page.tsx` - Added null safety for courses array

### 5. Documentation Update

**File:** `README.md`
- Updated to clarify `NEXT_PUBLIC_API_BASE_URL` should include `/api/v1`

---

## Environment Variable

**IMPORTANT:** Set `NEXT_PUBLIC_API_BASE_URL` to include `/api/v1`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

**NOT:**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080  # ❌ Missing /api/v1
```

---

## Verification

After these fixes:
1. ✅ Auth calls should work: `/auth/me` → `http://localhost:8080/api/v1/auth/me`
2. ✅ Courses list should not crash, shows empty state if no courses
3. ✅ Images should load or show fallback placeholder (no 400 errors)

---

## Testing

1. Set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1` in `.env.local`
2. Run `npm run dev`
3. Check browser console - should see no errors
4. Navigate to `/explore` - should load without crashing
5. Check Network tab - auth requests should go to correct URL

