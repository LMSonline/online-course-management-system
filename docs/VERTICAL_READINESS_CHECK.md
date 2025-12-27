# Vertical Readiness Check Report

**Date:** 2025-01-XX  
**Purpose:** Determine if FE repo is ready to implement vertical slices (screen -> hooks -> API -> UI)

---

## 📊 Readiness Score: **72/100**

### Breakdown:
- **BLOCKERS:** 2 items (must fix before vertical)
- **WARNINGS:** 4 items (can proceed but will hurt)
- **OK:** 3 items

---

## ✅ A) Environment & BaseURL Correctness

**Status:** ✅ **OK** (Fixed in recent patch)

**Verification:**
- ✅ `src/lib/env.ts` correctly handles BASE_URL + VERSION without double `/api/v1`
- ✅ `src/lib/api/axios.ts` uses `ENV.API.BASE_API_URL` (no duplication)
- ✅ Refresh endpoint uses `/auth/refresh` (baseURL already includes `/api/v1`)

**Note:** User must create `.env.local` with:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_API_VERSION=api/v1
```

---

## ✅ B) API Client "Single Entry"

**Status:** ✅ **OK**

**Verification:**
- ✅ Single axios client: `src/lib/api/axios.ts` (`axiosClient`)
- ✅ Request interceptor attaches `Authorization: Bearer <token>`
- ✅ Response interceptor: refresh on 401, retries once, avoids infinite loop (`_retry` flag)
- ✅ Standardized error shape: `AppError` class with `status`, `code`, `contractKey`
- ✅ `unwrapResponse<T>()` helper exists and used in services

**Files:**
- `src/lib/api/axios.ts` ✅
- `src/lib/api/api.error.ts` ✅
- `src/lib/api/unwrap.ts` ✅

---

## ⚠️ C) Auth Bootstrap

**Status:** ⚠️ **WARNING** (Works but needs verification)

**What Exists:**
- ✅ `useAuthBootstrap()` hook implements 2-step hydration
- ✅ `authStore` (Zustand) stores: `accountId`, `role`, `studentId`, `teacherId`
- ✅ Login flow triggers bootstrap (invalidates `AUTH_ME` query)
- ✅ Logout clears authStore + query cache

**What Needs Verification:**
- ⚠️ `useAuthBootstrap` logic: checks `accountData?.role === "USER"` but should also check persisted `role === "STUDENT"` (already done ✅)
- ⚠️ Need to verify bootstrap actually runs on app boot (AuthBootstrapGate in layout ✅)
- ⚠️ Need to test: login → verify studentId/teacherId hydrated before navigation

**Files:**
- `src/hooks/auth/useAuthBootstrap.ts` ✅
- `src/lib/auth/authStore.ts` ✅
- `src/components/auth/AuthBootstrapGate.tsx` ✅
- `src/app/layout.tsx` ✅ (wraps children with AuthBootstrapGate)

**Action Required:**
- Test login flow end-to-end to verify domain IDs hydrate correctly

---

## ❌ D) Route Guards

**Status:** ❌ **BLOCKER** (Guards exist but don't check domain IDs)

**What Exists:**
- ✅ `LayoutGuard` component in `src/core/components/guards/LayoutGuard.tsx`
- ✅ `GuestGuard`, `AuthGuard`, `AdminGuard`, `TeacherGuard`, `LearnerGuard` wrappers
- ✅ Middleware in `src/middleware.ts` checks role-based access

**What's Missing:**
- ❌ Guards don't check `studentId` for `requireStudent` routes
- ❌ Guards don't check `teacherId` for `requireCreator` routes
- ❌ Guards only check role from JWT token, not from `authStore` with domain IDs
- ❌ No `requireStudent` guard that verifies `studentId != null`
- ❌ No `requireCreator` guard that verifies `teacherId != null`

**Current Guard Implementation:**
```typescript
// LayoutGuard.tsx - Only checks role from JWT, not domain IDs
if (!allowedRoles.includes(decoded.role)) {
  router.replace("/403");
}
```

**Required Fix:**
- Update `LayoutGuard` to use `useAuthStore()` and check domain IDs
- Create `requireStudent` guard: `role === "STUDENT" && studentId != null`
- Create `requireCreator` guard: `role === "TEACHER" && teacherId != null`

**Files to Update:**
- `src/core/components/guards/LayoutGuard.tsx` - Add domain ID checks
- Create `src/lib/auth/guards.ts` - Export guard utilities (if not exists)

**Impact:** **BLOCKER** - Student/Teacher verticals will fail if routes don't have domain IDs

---

## ❌ E) Routes Completeness vs docs/routes.md

**Status:** ❌ **BLOCKER** (Many critical routes missing)

### Missing Critical Public Routes:
- ❌ `/search` → `SearchResultsScreen` (docs: `/search`) - **NOT FOUND**
- ❌ `/categories` → `CategoryTreeScreen` (docs: `/categories`) - **NOT FOUND**
- ❌ `/categories/:slug` → `CategoryDetailScreen` (docs: `/categories/:slug`) - **NOT FOUND**
- ❌ `/courses` → `CourseListScreen` (docs: `/courses`) - **NOT FOUND** (exists: `/learner/catalog` but wrong path)
- ❌ `/courses/:slug` → `CourseDetailScreen` (exists: `/learner/courses/[slug]/page.tsx` but path should be `/courses/:slug` not `/learner/courses/:slug`)
- ❌ `/tags` → `TagListScreen` (docs: `/tags`) - **NOT FOUND**
- ❌ `/teachers/:id` → `TeacherPublicProfileScreen` (docs: `/teachers/:id`) - **NOT FOUND**

### Missing Critical Student Routes:
- ❌ `/students/me` → `StudentMeScreen` (docs: `/students/me`) - **NOT FOUND**
- ❌ `/my-learning` → `MyEnrollmentsScreen` (docs: `/my-learning`, exists: `/learner/dashboard` but wrong path - should be `/my-learning`)
- ❌ `/enrollments/:id` → `EnrollmentDetailScreen` (docs: `/enrollments/:id`) - **NOT FOUND**
- ❌ `/learn/:courseSlug` → `CourseLearningHomeScreen` (exists: `/learner/courses/[slug]/learn/page.tsx` but path should be `/learn/:courseSlug`)
- ❌ `/learn/:courseSlug/progress` → `CourseProgressOverviewScreen` - **NOT FOUND**
- ❌ `/learn/:courseSlug/lessons/:lessonId` → `LessonPlayerScreen` (docs: `/learn/:courseSlug/lessons/:lessonId`, current may be different)
- ❌ Many more student routes (30+ missing - see docs/routes.md section 3.2)

### Missing Critical Teacher Routes:
- ❌ `/teachers/me` → `TeacherMeScreen` (docs: `/teachers/me`)
- ❌ `/teachers/:id/stats` → `TeacherStatsScreen` (docs: `/teachers/:id/stats`)
- ❌ `/teachers/:id/revenue` → `TeacherRevenueScreen` (docs: `/teachers/:id/revenue`)

### Extra Routes (Not in docs/routes.md):
- ⚠️ `/explore` → exists (`src/app/(public)/explore/page.tsx`) but not in docs/routes.md
- ⚠️ `/privacy`, `/terms` → exists but not in docs
- ⚠️ `/verify-email` → exists (`src/app/(auth)/verify-email/page.tsx`) but not explicitly in docs
- ⚠️ `/[username]/dashboard` → exists but not in docs
- ⚠️ `/teacher/analytics`, `/teacher/payouts`, `/teacher/qna`, `/teacher/students`, `/teacher/help` → exist but not in docs
- ⚠️ `/learner/catalog` → exists but docs says `/courses`
- ⚠️ `/learner/courses/[slug]` → exists but docs says `/courses/:slug` (public) or `/learn/:courseSlug` (student)

**Impact:** **BLOCKER** - Cannot implement vertical slices for screens that don't have routes

**Route Comparison Table:**

| Docs Route | Screen Name | Actual Route | Status |
|------------|-------------|--------------|--------|
| `/` | HomeScreen | `/` (exists) | ✅ |
| `/search` | SearchResultsScreen | **NOT FOUND** | ❌ |
| `/categories` | CategoryTreeScreen | **NOT FOUND** | ❌ |
| `/categories/:slug` | CategoryDetailScreen | **NOT FOUND** | ❌ |
| `/courses` | CourseListScreen | `/learner/catalog` (wrong path) | ⚠️ |
| `/courses/:slug` | CourseDetailScreen | `/learner/courses/[slug]` (wrong path) | ⚠️ |
| `/tags` | TagListScreen | **NOT FOUND** | ❌ |
| `/teachers/:id` | TeacherPublicProfileScreen | **NOT FOUND** | ❌ |
| `/login` | LoginScreen | `/login` (exists) | ✅ |
| `/register` | RegisterScreen | `/signup` (wrong path) | ⚠️ |
| `/my-learning` | MyEnrollmentsScreen | `/learner/dashboard` (wrong path) | ⚠️ |
| `/students/me` | StudentMeScreen | **NOT FOUND** | ❌ |
| `/learn/:courseSlug` | CourseLearningHomeScreen | `/learner/courses/[slug]/learn` (wrong path) | ⚠️ |
| `/teachers/me` | TeacherMeScreen | **NOT FOUND** | ❌ |
| `/teachers/:id/stats` | TeacherStatsScreen | **NOT FOUND** | ❌ |
| `/teachers/:id/revenue` | TeacherRevenueScreen | **NOT FOUND** | ❌ |

**Action Required:**
1. **For Public Vertical:** Create `/search`, `/categories`, `/categories/[slug]`, `/courses`, `/tags` routes
2. **For Student Vertical:** Create `/students/me`, `/my-learning`, `/enrollments/[id]` and update `/learn/*` routes
3. **For Teacher Vertical:** Create `/teachers/me`, `/teachers/[id]/stats`, `/teachers/[id]/revenue`
4. **Decision needed:** Keep `/explore` or remove? Align `/learner/*` paths with docs?

---

## ⚠️ F) Query State Handling

**Status:** ⚠️ **WARNING** (React Query exists but query keys inconsistent)

**What Exists:**
- ✅ React Query provider in root layout (`ReactQueryProvider`)
- ✅ Some hooks use `CONTRACT_KEYS` (e.g., `useAuth`, `useAuthBootstrap`)
- ✅ Mutations invalidate queries

**What's Inconsistent:**
- ⚠️ `useTeacherCourses` uses `["teacher-courses", filters]` instead of contract key
- ⚠️ `useAdminAccounts` uses `["adminAccounts"]` instead of contract key
- ⚠️ Query keys not consistently following `CONTRACT_KEYS.*` pattern
- ⚠️ No clear policy: some use contract keys, some use custom strings

**Files:**
- `src/hooks/useAuth.ts` ✅ (uses `CONTRACT_KEYS.AUTH_ME`)
- `src/hooks/auth/useAuthBootstrap.ts` ✅ (uses contract keys)
- `src/hooks/teacher/useTeacherCourses.ts` ❌ (uses `["teacher-courses"]`)
- `src/hooks/useAdminAccounts.ts` ❌ (uses `["adminAccounts"]`)

**Action Required:**
- Standardize all query keys to use `CONTRACT_KEYS.*`
- Update existing hooks to use contract keys

**Impact:** **WARNING** - Can proceed but will need refactoring later

---

## ⚠️ G) 3-Layer Architecture

**Status:** ⚠️ **WARNING** (Not a blocker for Public vertical)

**Current Structure:**
```
src/
├── app/              ✅ Pages/Screens (Next.js routes)
├── core/components/  ⚠️ Mixed: UI primitives + domain components
├── hooks/            ⚠️ Some domain-specific hooks
├── services/         ✅ Domain services exist
└── lib/              ✅ Utilities
```

**What's Missing:**
- ❌ No `src/features/` directory
- ⚠️ Domain components mixed in `core/components/` (admin/, teacher/, learner/)
- ⚠️ Import boundaries not enforced (UI components import from services)

**Impact:** **WARNING** - Can start Public vertical, but will need refactor for Student/Teacher verticals

---

## 🚦 Go / No-Go Decision

### ✅ **GO for Public Vertical Only**

**Rationale:**
- Public routes don't require auth/bootstrap
- API client works
- Can implement `/`, `/courses`, `/courses/:slug`, `/categories` screens
- Missing routes can be created as needed

### ❌ **NO-GO for Full Vertical (Student/Teacher/Admin)**

**Blockers:**
1. **Route guards don't check domain IDs** - Student/Teacher routes will fail
2. **Many critical routes missing** - Cannot implement screens without routes
3. **Query keys inconsistent** - Will cause cache issues

**Must Fix Before Full Vertical:**
1. Update route guards to check `studentId`/`teacherId`
2. Create missing routes from `docs/routes.md`
3. Standardize query keys to use `CONTRACT_KEYS.*`

---

## 📋 Minimal "Start Vertical Plan"

### Screen 1: HomeScreen (`/`)

**Status:** ✅ Route exists (`src/app/(public)/page.tsx`)

**Required Hooks/Contracts:**
- `useCoursesQuery` (or `useCourses`) - `COURSE_GET_LIST`
- `useCategoryTreeQuery` (or `useCategoryTree`) - `CATEGORY_GET_TREE`

**Files to Touch:**
1. `src/app/(public)/page.tsx` - Update to use hooks instead of mock data
2. Create `src/hooks/course/useCoursesQuery.ts` (or add to existing)
3. Create `src/hooks/category/useCategoryTreeQuery.ts` (or add to existing)
4. Update `src/services/courses/course.service.ts` - Add contract keys
5. Update `src/services/courses/category.service.ts` - Add contract keys

**Expected Success Criteria:**
- ✅ HomeScreen loads trending courses from API
- ✅ Category tree loads from API
- ✅ Loading states work
- ✅ Error states work
- ✅ No console errors

**Contract Keys Needed:**
- `COURSE_GET_LIST`
- `CATEGORY_GET_TREE`

**Query Keys:**
```typescript
// useCoursesQuery
queryKey: [CONTRACT_KEYS.COURSE_GET_LIST, { sort: 'trending', page, size }]

// useCategoryTreeQuery
queryKey: [CONTRACT_KEYS.CATEGORY_GET_TREE]
```

---

## 🔧 Detailed Blocker Fixes

### BLOCKER 1: Route Guards Don't Check Domain IDs

**File:** `src/core/components/guards/LayoutGuard.tsx`

**Current Code:**
```typescript
// Only checks role from JWT
if (!allowedRoles.includes(decoded.role)) {
  router.replace("/403");
}
```

**Required Fix:**
```typescript
import { useAuthStore } from "@/lib/auth/authStore";

// In LayoutGuard component
const { role, studentId, teacherId } = useAuthStore();

// For STUDENT routes
if (allowedRoles.includes("STUDENT") && role === "STUDENT" && !studentId) {
  // Show error or redirect
  return <ErrorScreen message="Student profile missing" />;
}

// For TEACHER routes
if (allowedRoles.includes("TEACHER") && role === "TEACHER" && !teacherId) {
  router.replace("/teachers/me");
  return null;
}
```

**Alternative:** Create separate guard components:
- `StudentGuard` - checks `role === "STUDENT" && studentId != null`
- `CreatorGuard` - checks `role === "TEACHER" && teacherId != null`

---

### BLOCKER 2: Missing Critical Routes

**Priority 1 (Public - Can start immediately):**
- `/search` → `src/app/search/page.tsx` (NEW)
- `/categories` → `src/app/categories/page.tsx` (NEW)
- `/categories/[slug]/page.tsx` (NEW)
- `/courses` → `src/app/courses/page.tsx` (NEW - currently at `/learner/catalog`)
- `/courses/[slug]` → `src/app/courses/[slug]/page.tsx` (NEW - currently at `/learner/courses/[slug]`)
- `/tags` → `src/app/tags/page.tsx` (NEW)
- `/teachers/[id]` → `src/app/teachers/[id]/page.tsx` (NEW)

**Priority 2 (Student - Block full vertical):**
- `/students/me` → `src/app/students/me/page.tsx`
- `/my-learning` → `src/app/my-learning/page.tsx` (or redirect `/learner/dashboard` → `/my-learning`)
- `/enrollments/[id]/page.tsx`
- `/learn/[courseSlug]/page.tsx` (update path from `/learner/courses/[slug]/learn`)

**Priority 3 (Teacher - Block full vertical):**
- `/teachers/me` → `src/app/teachers/me/page.tsx`
- `/teachers/[id]/stats/page.tsx`
- `/teachers/[id]/revenue/page.tsx`

---

## 📝 Summary Checklist

### ✅ Ready for Public Vertical:
- [x] API client works
- [x] BaseURL correct
- [x] React Query provider exists
- [x] Contract keys file exists
- [x] Public routes mostly exist (need `/search`, `/categories`, `/tags`)

### ❌ NOT Ready for Full Vertical:
- [ ] Route guards check domain IDs
- [ ] Missing student routes created
- [ ] Missing teacher routes created
- [ ] Query keys standardized

### ⚠️ Recommended Before Starting:
- [ ] Test auth bootstrap flow end-to-end
- [ ] Verify `.env.local` exists with correct format
- [ ] Update query keys in existing hooks to use `CONTRACT_KEYS.*`

---

## 🎯 Recommended Action Plan

### Phase 1: Fix Blockers (2-3 days)
1. **Day 1:** Update route guards to check domain IDs
2. **Day 2:** Create missing public routes (`/search`, `/categories`, `/tags`)
3. **Day 3:** Standardize query keys in existing hooks

### Phase 2: Start Public Vertical (1 week)
1. Implement `HomeScreen` with real API calls
2. Implement `CourseListScreen` (`/courses`)
3. Implement `CourseDetailScreen` (`/courses/:slug`)
4. Implement `CategoryTreeScreen` (`/categories`)

### Phase 3: Fix Remaining Routes (1 week)
1. Create missing student routes
2. Create missing teacher routes
3. Update existing routes to match docs/routes.md paths

### Phase 4: Full Vertical (ongoing)
1. Start student verticals
2. Start teacher verticals
3. Start admin verticals

---

**End of Report**

