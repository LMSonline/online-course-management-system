# Guards Patch Summary

**Date:** 2025-01-XX  
**Purpose:** Enforce domain ID requirements in route guards (accountId != studentId != teacherId)

---

## ✅ Changes Made

### 1. Updated `LayoutGuard.tsx`

**Key Changes:**
- ✅ Now uses `useAuthStore()` instead of JWT token decoding
- ✅ Waits for auth bootstrap readiness using `useAuthBootstrap()`
- ✅ Checks domain IDs (`studentId`/`teacherId`) when `requireDomainId={true}`
- ✅ Shows `ProfileMissingError` component if domain ID missing
- ✅ Added comprehensive comments explaining `accountId != studentId != teacherId` rule

**New Props:**
- `requireDomainId?: boolean` - If true, enforces domain ID check (studentId for STUDENT, teacherId for TEACHER)

**Guard Logic Flow:**
1. Wait for bootstrap if token exists
2. Redirect to login if no token or not authenticated
3. Wait if bootstrap not ready
4. Check role matches `allowedRoles`
5. If `requireDomainId=true`, verify domain ID exists
6. Show error UI if domain ID missing
7. Render children if all checks pass

### 2. Updated Guard Wrappers

**Updated Guards:**
- ✅ `AdminGuard` - `requireDomainId={false}` (ADMIN only needs accountId)
- ✅ `TeacherGuard` - `requireDomainId={true}` (requires teacherId)
- ✅ `LearnerGuard` - `requireDomainId={true}` (requires studentId)
- ✅ `StudentGuard` - New alias for `LearnerGuard`
- ✅ `CreatorGuard` - New alias for `TeacherGuard`
- ✅ `AuthGuard` - `requireDomainId={false}` (for routes like `/me/profile`)
- ✅ `GuestGuard` - Updated to use `useAuthStore()` and wait for bootstrap

### 3. Created `ProfileMissingError.tsx`

**Purpose:** Shows fallback UI when role matches but domain profile is missing

**Features:**
- Clear error message explaining the issue
- "Retry" button that invalidates bootstrap queries
- "Go to Profile" button that navigates to profile setup
- Prevents screen from rendering and calling APIs with accountId

**Usage:**
```tsx
<ProfileMissingError role="STUDENT" />
<ProfileMissingError role="TEACHER" />
```

---

## 📋 Implementation Details

### Domain ID Enforcement

**Rule:** `accountId != studentId != teacherId`

- **accountId**: From `AUTH_ME` (authentication service)
- **studentId**: From `STUDENT_GET_ME` (domain service)
- **teacherId**: From `TEACHER_GET_ME` (domain service)

**Why This Matters:**
- Student routes (e.g., `/my-learning`) need `studentId` to call `/students/{studentId}/enrollments`
- Teacher routes (e.g., `/teachers/:id/stats`) need `teacherId` to call `/teachers/{teacherId}/stats`
- Using `accountId` instead of domain IDs will cause 401/403/500 errors

### Bootstrap Readiness

Guards now wait for `useAuthBootstrap()` to complete before checking auth state. This ensures:
- No flicker from wrong redirects
- Domain IDs are hydrated before route access
- Consistent auth state across the app

**Bootstrap States:**
- `isLoading: true` → Show loading spinner
- `isReady: false` → Wait (bootstrap in progress)
- `isReady: true` → Proceed with auth checks

---

## 🔧 Usage Examples

### Student Route (requires studentId)
```tsx
// In layout.tsx or page.tsx
import { StudentGuard } from "@/core/components/guards";

export default function MyLearningLayout({ children }) {
  return (
    <StudentGuard>
      {children}
    </StudentGuard>
  );
}
```

### Teacher Route (requires teacherId)
```tsx
import { CreatorGuard } from "@/core/components/guards";

export default function TeacherCoursesLayout({ children }) {
  return (
    <CreatorGuard>
      {children}
    </CreatorGuard>
  );
}
```

### Admin Route (no domain ID needed)
```tsx
import { AdminGuard } from "@/core/components/guards";

export default function AdminLayout({ children }) {
  return (
    <AdminGuard>
      {children}
    </AdminGuard>
  );
}
```

### General Auth Route (no domain ID needed)
```tsx
import { AuthGuard } from "@/core/components/guards";

export default function ProfileLayout({ children }) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
```

### Custom Guard with Domain ID Check
```tsx
import { LayoutGuard } from "@/core/components/guards";

export default function CustomLayout({ children }) {
  return (
    <LayoutGuard 
      allowedRoles={["STUDENT", "TEACHER"]} 
      requireDomainId={true}
    >
      {children}
    </LayoutGuard>
  );
}
```

---

## 🧪 Testing Checklist

- [ ] Student route with `studentId` → Should render
- [ ] Student route without `studentId` → Should show `ProfileMissingError`
- [ ] Teacher route with `teacherId` → Should render
- [ ] Teacher route without `teacherId` → Should show `ProfileMissingError`
- [ ] Admin route → Should render (no domain ID needed)
- [ ] Guest route when authenticated → Should redirect to dashboard
- [ ] Protected route when not authenticated → Should redirect to login
- [ ] Bootstrap loading state → Should show loading spinner
- [ ] Retry button in `ProfileMissingError` → Should retry bootstrap
- [ ] "Go to Profile" button → Should navigate to profile route

---

## 📝 Notes

1. **Guards are client-side only** - They use `"use client"` directive
2. **Bootstrap must complete** - Guards wait for `isBootstrapReady` before checking auth
3. **Domain IDs are required** - For student/teacher routes, domain IDs must exist
4. **Error UI prevents API calls** - `ProfileMissingError` blocks screen rendering
5. **Retry mechanism** - Invalidates queries to trigger bootstrap retry

---

## 🚨 Breaking Changes

**Before:**
- Guards checked JWT token role only
- No domain ID verification
- Could access routes without domain IDs

**After:**
- Guards check `authStore` role and domain IDs
- Domain IDs required for student/teacher routes
- Shows error UI if domain ID missing

**Migration:**
- Update all route layouts to use appropriate guards
- Ensure `AuthBootstrapGate` is in root layout
- Test all protected routes after deployment

---

**End of Summary**

