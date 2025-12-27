# Frontend Audit & Implementation-Ready Patch Plan

**Generated:** 2025-01-XX  
**Purpose:** Audit current FE repository and provide concrete patch plan to connect with backend using contractKeys

---

## TASK 1 — Repo Profile

### ✅ Detected Setup

- **Framework:** Next.js 15.5.4 (App Router)
- **Language:** TypeScript (strict mode)
- **Data Fetching:** React Query (@tanstack/react-query v5.90.12) in client components
- **HTTP Client:** Axios (v1.13.2) with interceptors
- **State Management:** Zustand (v5.0.8) + React Query
- **UI Library:** Custom components in `src/core/components`
- **Styling:** Tailwind CSS v4.1.13

### Current Structure

```
frontend/src/
├── app/              # Next.js App Router pages
├── core/components/  # UI primitives + domain components (mixed)
├── hooks/            # Custom hooks (some domain-specific)
├── lib/              # Utilities, API client, providers
└── services/         # API service layer (by domain)
```

### ✅ Existing Infrastructure

- ✅ API client with axios interceptors (`src/lib/api/axios.ts`)
- ✅ Token storage (`src/lib/api/tokenStorage.ts`)
- ✅ Error handling (`src/lib/api/api.error.ts`)
- ✅ React Query provider setup
- ✅ Middleware for route protection
- ✅ Service layer organized by domain

### ⚠️ Issues Detected

- ❌ No contract key constants
- ❌ No domain ID separation (accountId vs studentId vs teacherId)
- ❌ No auth bootstrap flow (AUTH_ME → STUDENT_GET_ME/TEACHER_GET_ME)
- ❌ Guards don't check domain IDs
- ❌ Missing many routes from `docs/routes.md`
- ❌ No `features/` layer (3-layer architecture incomplete)

---

## TASK 2 — FE Architecture Audit

### Current State

| Layer | Status | Location | Notes |
|-------|--------|----------|-------|
| **Pages/Screens** | ✅ Existing | `src/app/` | Next.js App Router pages |
| **Features** | ❌ Missing | N/A | No `src/features/` directory. Domain logic mixed in `services/` and `hooks/` |
| **UI Primitives** | ⚠️ Needs refactor | `src/core/components/ui/` | Some UI components exist but mixed with domain components |

### Import Boundaries

**Current Issues:**
- ❌ `core/components/` contains domain-specific components (admin/, teacher/, learner/)
- ❌ Services directly import from `core/components/` (should be one-way: features → core)
- ⚠️ No clear separation between UI primitives and feature components

**Required Structure:**
```
src/
├── app/                    # Pages (route-level)
├── features/               # Domain modules (NEW)
│   ├── auth/
│   ├── course/
│   ├── enrollment/
│   ├── review/
│   ├── teacher/
│   ├── student/
│   └── admin/
├── core/                   # Shared primitives
│   └── components/
│       └── ui/            # Button, Input, Modal, etc.
└── lib/                    # Utilities, API client
```

---

## TASK 3 — Route Implementation vs docs/routes.md

### Missing Routes (from docs/routes.md)

#### Public Routes
- ❌ `/tags` → `TagListScreen` (exists in screens.md)

#### Student Routes
- ❌ `/students/me` → `StudentMeScreen`
- ❌ `/enrollments/:id` → `EnrollmentDetailScreen`
- ❌ `/learn/:courseSlug/progress` → `CourseProgressOverviewScreen`
- ❌ `/learn/:courseSlug/lessons/:lessonId` → `LessonPlayerScreen` (current: `/learn/:courseSlug/lecture/:lessonId`)
- ❌ `/learn/:courseSlug/announcements` → `CourseAnnouncementsScreen`
- ❌ `/learn/:courseSlug/qna` → `CourseQAScreen`
- ❌ `/learn/:courseSlug/resources` → `CourseResourcesScreen`
- ❌ `/lessons/:lessonId/quizzes` → `LessonQuizzesScreen`
- ❌ `/quizzes/:id` → `QuizDetailScreen`
- ❌ `/quizzes/:quizId/attempts/:attemptId` → `QuizAttemptPlayScreen`
- ❌ `/lessons/:lessonId/assignments` → `LessonAssignmentsScreen`
- ❌ `/assignments/:id` → `AssignmentDetailScreen`
- ❌ `/assignments/:assignmentId/submit` → `SubmitAssignmentScreen`
- ❌ `/submissions/:id` → `SubmissionDetailScreen`
- ❌ `/recommendations` → `RecommendationScreen`
- ❌ `/recommendations/:id/feedback` → `RecommendationFeedbackScreen`
- ❌ `/reports` → `MyReportsScreen`
- ❌ `/reports/new` → `SubmitReportScreen`
- ❌ `/reports/:id` → `ReportDetailScreen`
- ❌ `/me/profile` → `ProfileScreen` (current: `/me`)
- ❌ `/me/profile/edit` → `ProfileEditScreen` (current: `/me/edit`)
- ❌ `/me/avatar` → `UploadAvatarScreen`

#### Teacher Routes
- ❌ `/teachers/me` → `TeacherMeScreen`
- ❌ `/teachers/:id/stats` → `TeacherStatsScreen` (note: :id = teacherId)
- ❌ `/teachers/:id/revenue` → `TeacherRevenueScreen` (note: :id = teacherId)

#### Admin Routes
- ✅ Most admin routes exist, but paths may need verification

### Extra Routes (not in docs/routes.md)

- ⚠️ `/explore` → exists but not in docs
- ⚠️ `/privacy`, `/terms` → exists but not in docs
- ⚠️ `/verify-email` → exists but not explicitly in docs
- ⚠️ `/[username]/dashboard` → exists but not in docs
- ⚠️ `/teacher/analytics` → exists but not in docs
- ⚠️ `/teacher/payouts` → exists but not in docs
- ⚠️ `/teacher/qna` → exists but not in docs
- ⚠️ `/teacher/students` → exists but not in docs
- ⚠️ `/teacher/help` → exists but not in docs

**Action:** Review with team whether these should be kept or removed.

---

## TASK 4 — API Client + Auth Flow (CRITICAL)

### Current Implementation

**✅ What Exists:**
- ✅ Single API client (`src/lib/api/axios.ts`)
- ✅ Token attachment in request interceptor
- ✅ Refresh on 401 + retry once
- ✅ Standardized error shape (`AppError`)

**❌ What's Missing:**

1. **Domain ID Separation**
   - ❌ No `studentId` or `teacherId` in auth state
   - ❌ `useCurrentUser` only calls `AUTH_ME`, doesn't hydrate domain IDs
   - ❌ No `STUDENT_GET_ME` or `TEACHER_GET_ME` calls

2. **Auth Bootstrap Flow**
   - ❌ No 2-step hydration: AUTH_ME → STUDENT_GET_ME/TEACHER_GET_ME
   - ❌ Login flow doesn't fetch domain IDs

3. **Route Guards**
   - ❌ `middleware.ts` only checks role, not domain IDs
   - ❌ No `requireStudent` guard (checks studentId)
   - ❌ No `requireCreator` guard (checks teacherId)
   - ❌ No `requireAdmin` guard (only role check)

4. **Auth Store/Context**
   - ❌ No centralized auth store with `{ accountId, role, studentId?, teacherId? }`
   - ❌ Auth state scattered (localStorage + React Query cache)

### Required Files to Create

1. `src/lib/auth/authStore.ts` - Zustand store for auth state
2. `src/lib/auth/guards.ts` - Route guard utilities
3. `src/services/student/student.service.ts` - Student API service
4. `src/services/teacher/teacher.service.ts` - Teacher API service
5. `src/hooks/auth/useAuthBootstrap.ts` - Bootstrap hook
6. `src/hooks/student/useCurrentStudent.ts` - Student profile hook
7. `src/hooks/teacher/useCurrentTeacher.ts` - Teacher profile hook

---

## TASK 5 — ContractKey Alignment

### Current State

**❌ Missing:**
- ❌ No contract key constants file
- ❌ Services use hardcoded endpoint strings
- ❌ Hook naming doesn't follow contractKey convention
- ❌ No testId convention from `Interactive_Elements_List.md`

### Required Changes

1. **Create Contract Keys File**
   - `src/lib/api/contractKeys.ts` - Export all contract keys from `ENDPOINT_TO_CONTRACT_MAP.md`

2. **Update Service Layer**
   - Replace hardcoded strings with contract keys
   - Use contract keys in error handling

3. **Update Hook Naming**
   - Queries: `useXxxQuery` (e.g., `useCourseQuery`, `useCoursesQuery`)
   - Mutations: `useXxxMutation` (e.g., `useCreateCourseMutation`)

4. **Add TestId Convention**
   - Follow `Interactive_Elements_List.md` format: `testId | actionKey | contractKey`
   - Add `data-testid` attributes to interactive elements

### Mismatches Found

| Current | Should Be | Contract Key |
|---------|-----------|--------------|
| `useCurrentUser` | `useCurrentUserQuery` | `AUTH_ME` |
| `useLogin` | `useLoginMutation` | `AUTH_LOGIN` |
| `useRegister` | `useRegisterMutation` | `AUTH_REGISTER` |
| N/A | `useCurrentStudentQuery` | `STUDENT_GET_ME` |
| N/A | `useCurrentTeacherQuery` | `TEACHER_GET_ME` |

---

## TASK 6 — Prefetch & Data Fetching Strategy

### Recommended Approach: **React Query in Client Components**

**Justification:**
- ✅ Already using React Query v5
- ✅ Better for real-time updates, optimistic updates
- ✅ Works well with Next.js App Router client components
- ✅ Supports prefetching via `queryClient.prefetchQuery()`

### Prefetch Strategy

**Where to Prefetch:**
- **Layout level:** Global data (auth state, categories)
- **Page level:** Route-specific data (course detail, enrollments)
- **Route handlers:** Not recommended (server-side prefetch conflicts with React Query)

### Prefetch Mapping (from docs/routes.md section 5)

| Route | Prefetch Queries | Location |
|-------|------------------|----------|
| `/` | `COURSE_GET_LIST`, `CATEGORY_GET_TREE` | `app/(public)/page.tsx` |
| `/my-learning` | `STUDENT_GET_ME`, `ENROLLMENT_GET_STUDENT_LIST` | `app/learner/dashboard/page.tsx` |
| `/learn/:courseSlug` | `COURSE_GET_DETAIL`, curriculum, progress | `app/learner/courses/[slug]/learn/page.tsx` |
| `/teacher/courses` | `TEACHER_GET_ME`, `COURSE_GET_TEACHER_LIST` | `app/teacher/courses/page.tsx` |
| `/admin` | `ADMIN_GET_DASHBOARD`, `ADMIN_GET_STATISTICS` | `app/admin/dashboard/page.tsx` |

**Implementation:**
- Use `useQuery` with `staleTime` for caching
- Use `queryClient.prefetchQuery()` in `useEffect` or `router.prefetch()`
- Consider `useSuspenseQuery` for Next.js 15 (if using Suspense)

---

## TASK 7 — PATCH PLAN (Actionable)

### Phase 1: Foundation (Critical)

#### 1.1 Create Contract Keys File

**File:** `src/lib/api/contractKeys.ts`

```typescript
/**
 * Contract Keys - Source of truth from ENDPOINT_TO_CONTRACT_MAP.md
 * DO NOT modify without updating backend docs
 */

export const CONTRACT_KEYS = {
  // Auth
  AUTH_LOGIN: 'AUTH_LOGIN',
  AUTH_REGISTER: 'AUTH_REGISTER',
  AUTH_REFRESH: 'AUTH_REFRESH',
  AUTH_LOGOUT: 'AUTH_LOGOUT',
  AUTH_ME: 'AUTH_ME',
  
  // Account
  ACCOUNT_GET_PROFILE: 'ACCOUNT_GET_PROFILE',
  ACCOUNT_UPDATE_PROFILE: 'ACCOUNT_UPDATE_PROFILE',
  ACCOUNT_UPLOAD_AVATAR: 'ACCOUNT_UPLOAD_AVATAR',
  
  // Student
  STUDENT_GET_ME: 'STUDENT_GET_ME',
  STUDENT_GET_BY_ID: 'STUDENT_GET_BY_ID',
  
  // Teacher
  TEACHER_GET_ME: 'TEACHER_GET_ME',
  TEACHER_GET_BY_ID: 'TEACHER_GET_BY_ID',
  TEACHER_GET_STATS: 'TEACHER_GET_STATS',
  TEACHER_GET_REVENUE: 'TEACHER_GET_REVENUE',
  
  // Course
  COURSE_GET_LIST: 'COURSE_GET_LIST',
  COURSE_GET_DETAIL: 'COURSE_GET_DETAIL',
  COURSE_CREATE: 'COURSE_CREATE',
  COURSE_UPDATE: 'COURSE_UPDATE',
  COURSE_DELETE: 'COURSE_DELETE',
  COURSE_OPEN_ACTION: 'COURSE_OPEN_ACTION',
  COURSE_CLOSE_ACTION: 'COURSE_CLOSE_ACTION',
  
  // ... (add all from ENDPOINT_TO_CONTRACT_MAP.md)
} as const;

export type ContractKey = typeof CONTRACT_KEYS[keyof typeof CONTRACT_KEYS];
```

#### 1.2 Create Auth Store

**File:** `src/lib/auth/authStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AuthState {
  accountId: number | null;
  role: 'USER' | 'CREATOR' | 'ADMIN' | null;
  studentId: number | null;
  teacherId: number | null;
  email: string | null;
  fullName: string | null;
  
  // Actions
  setAuth: (data: {
    accountId: number;
    role: 'USER' | 'CREATOR' | 'ADMIN';
    email: string;
    fullName: string;
  }) => void;
  setStudentId: (studentId: number) => void;
  setTeacherId: (teacherId: number) => void;
  clear: () => void;
  
  // Getters
  isAuthenticated: () => boolean;
  isStudent: () => boolean;
  isTeacher: () => boolean;
  isAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accountId: null,
      role: null,
      studentId: null,
      teacherId: null,
      email: null,
      fullName: null,
      
      setAuth: (data) => set(data),
      setStudentId: (studentId) => set({ studentId }),
      setTeacherId: (teacherId) => set({ teacherId }),
      clear: () => set({
        accountId: null,
        role: null,
        studentId: null,
        teacherId: null,
        email: null,
        fullName: null,
      }),
      
      isAuthenticated: () => !!get().accountId,
      isStudent: () => get().role === 'USER' && !!get().studentId,
      isTeacher: () => get().role === 'CREATOR' && !!get().teacherId,
      isAdmin: () => get().role === 'ADMIN',
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accountId: state.accountId,
        role: state.role,
        studentId: state.studentId,
        teacherId: state.teacherId,
        email: state.email,
        fullName: state.fullName,
      }),
    }
  )
);
```

#### 1.3 Create Guards

**File:** `src/lib/auth/guards.ts`

```typescript
import { redirect } from 'next/navigation';
import { useAuthStore } from './authStore';

export async function requireAuth(): Promise<{ accountId: number; role: string }> {
  const { accountId, role } = useAuthStore.getState();
  
  if (!accountId || !role) {
    redirect('/login?next=' + encodeURIComponent(window.location.pathname));
  }
  
  return { accountId, role };
}

export async function requireStudent(): Promise<{ accountId: number; studentId: number }> {
  const { accountId, role, studentId } = useAuthStore.getState();
  
  if (!accountId || role !== 'USER' || !studentId) {
    if (!studentId) {
      // Show error or redirect to profile completion
      throw new Error('Student profile missing');
    }
    redirect('/login?next=' + encodeURIComponent(window.location.pathname));
  }
  
  return { accountId, studentId };
}

export async function requireCreator(): Promise<{ accountId: number; teacherId: number }> {
  const { accountId, role, teacherId } = useAuthStore.getState();
  
  if (!accountId || role !== 'CREATOR' || !teacherId) {
    if (!teacherId) {
      redirect('/teachers/me');
    }
    redirect('/login?next=' + encodeURIComponent(window.location.pathname));
  }
  
  return { accountId, teacherId };
}

export async function requireAdmin(): Promise<{ accountId: number }> {
  const { accountId, role } = useAuthStore.getState();
  
  if (!accountId || role !== 'ADMIN') {
    redirect('/403');
  }
  
  return { accountId };
}
```

#### 1.4 Create Student Service

**File:** `src/services/student/student.service.ts`

```typescript
import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { ApiResponse } from '@/lib/api/api.types';
import { CONTRACT_KEYS } from '@/lib/api/contractKeys';

export interface StudentProfile {
  id: number;
  accountId: number;
  // ... other fields
}

export const studentService = {
  getMe: async (): Promise<StudentProfile> => {
    const response = await axiosClient.get<ApiResponse<StudentProfile>>(
      '/students/me'
    );
    return unwrapResponse(response);
  },
  
  getById: async (id: number): Promise<StudentProfile> => {
    const response = await axiosClient.get<ApiResponse<StudentProfile>>(
      `/students/${id}`
    );
    return unwrapResponse(response);
  },
};
```

#### 1.5 Create Teacher Service

**File:** `src/services/teacher/teacher.service.ts`

```typescript
import { axiosClient } from '@/lib/api/axios';
import { unwrapResponse } from '@/lib/api/unwrap';
import { ApiResponse } from '@/lib/api/api.types';

export interface TeacherProfile {
  id: number;
  accountId: number;
  // ... other fields
}

export interface TeacherStats {
  totalCourses: number;
  totalStudents: number;
  avgRating: number;
  // ... other fields
}

export const teacherService = {
  getMe: async (): Promise<TeacherProfile> => {
    const response = await axiosClient.get<ApiResponse<TeacherProfile>>(
      '/teachers/me'
    );
    return unwrapResponse(response);
  },
  
  getStats: async (teacherId: number): Promise<TeacherStats> => {
    const response = await axiosClient.get<ApiResponse<TeacherStats>>(
      `/teachers/${teacherId}/stats`
    );
    return unwrapResponse(response);
  },
  
  getRevenue: async (teacherId: number, range?: string): Promise<any> => {
    const response = await axiosClient.get<ApiResponse<any>>(
      `/teachers/${teacherId}/revenue`,
      { params: { range } }
    );
    return unwrapResponse(response);
  },
};
```

#### 1.6 Create Auth Bootstrap Hook

**File:** `src/hooks/auth/useAuthBootstrap.ts`

```typescript
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/auth/authStore';
import { authService } from '@/services/auth/auth.service';
import { studentService } from '@/services/student/student.service';
import { teacherService } from '@/services/teacher/teacher.service';
import { CONTRACT_KEYS } from '@/lib/api/contractKeys';

export function useAuthBootstrap() {
  const { setAuth, setStudentId, setTeacherId, accountId } = useAuthStore();
  
  // Step 1: Get account info (AUTH_ME)
  const { data: accountData, isLoading: isLoadingAccount } = useQuery({
    queryKey: [CONTRACT_KEYS.AUTH_ME],
    queryFn: authService.getCurrentUser,
    enabled: !!useAuthStore.getState().accountId || !!tokenStorage.getAccessToken(),
    retry: false,
  });
  
  // Step 2: Hydrate domain IDs based on role
  const { data: studentData } = useQuery({
    queryKey: [CONTRACT_KEYS.STUDENT_GET_ME],
    queryFn: studentService.getMe,
    enabled: accountData?.role === 'USER' && !!accountData,
    retry: false,
  });
  
  const { data: teacherData } = useQuery({
    queryKey: [CONTRACT_KEYS.TEACHER_GET_ME],
    queryFn: teacherService.getMe,
    enabled: accountData?.role === 'CREATOR' && !!accountData,
    retry: false,
  });
  
  // Update store when data arrives
  useEffect(() => {
    if (accountData) {
      setAuth({
        accountId: accountData.id,
        role: accountData.role,
        email: accountData.email,
        fullName: accountData.fullName,
      });
    }
  }, [accountData, setAuth]);
  
  useEffect(() => {
    if (studentData) {
      setStudentId(studentData.id);
    }
  }, [studentData, setStudentId]);
  
  useEffect(() => {
    if (teacherData) {
      setTeacherId(teacherData.id);
    }
  }, [teacherData, setTeacherId]);
  
  return {
    isLoading: isLoadingAccount,
    isReady: !!accountData && (
      accountData.role === 'ADMIN' ||
      (accountData.role === 'USER' && !!studentData) ||
      (accountData.role === 'CREATOR' && !!teacherData)
    ),
  };
}
```

### Phase 2: Update Existing Files

#### 2.1 Update Login Hook

**File:** `src/hooks/useAuth.ts`

Update `useLogin` to call bootstrap after login:

```typescript
// In useLogin onSuccess:
onSuccess: async (data, variables) => {
  tokenStorage.setTokens(data.accessToken, data.refreshToken);
  
  // Set account info
  useAuthStore.getState().setAuth({
    accountId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    fullName: data.user.fullName,
  });
  
  // Trigger domain ID fetch (will be handled by useAuthBootstrap)
  queryClient.invalidateQueries({ queryKey: [CONTRACT_KEYS.AUTH_ME] });
  
  // Wait for domain IDs to hydrate (optional, or redirect immediately)
  // ...
  
  // Redirect logic
  const redirectUrl = variables.redirectUrl || (
    data.user.role === 'ADMIN' ? '/admin' :
    data.user.role === 'CREATOR' ? '/teacher/courses' :
    '/my-learning'
  );
  router.replace(redirectUrl);
},
```

#### 2.2 Update Middleware

**File:** `src/middleware.ts`

Add domain ID checks (but note: middleware runs server-side, so we can only check tokens, not hydrated state).

#### 2.3 Update API Client

**File:** `src/lib/api/axios.ts`

Add contract key to error context (optional, for debugging):

```typescript
// In response interceptor, add contract key to error if available
throw new AppError(
  error.response?.data?.message || 'Request failed',
  error.response?.status || 500,
  error.response?.data?.code || 'UNKNOWN_ERROR',
  // contractKey could be added if we track it per request
);
```

### Phase 3: Create Missing Routes

Create all missing routes listed in **TASK 3** following Next.js App Router conventions.

### Phase 4: Refactor Architecture

#### 4.1 Create Features Layer

**Structure:**
```
src/features/
├── auth/
│   ├── api/
│   │   ├── useAuthMeQuery.ts
│   │   ├── useLoginMutation.ts
│   │   └── index.ts
│   └── components/
├── student/
│   ├── api/
│   │   ├── useCurrentStudentQuery.ts
│   │   └── index.ts
│   └── components/
├── course/
│   ├── api/
│   │   ├── useCourseQuery.ts
│   │   ├── useCoursesQuery.ts
│   │   └── index.ts
│   └── components/
└── ...
```

#### 4.2 Move Domain Components

Move domain-specific components from `core/components/` to `features/`:
- `core/components/admin/` → `features/admin/components/`
- `core/components/teacher/` → `features/teacher/components/`
- `core/components/learner/` → `features/student/components/`

Keep only true UI primitives in `core/components/ui/`.

---

## CHECKLIST

### Foundation (Phase 1)
- [ ] Create `src/lib/api/contractKeys.ts` with all contract keys
- [ ] Create `src/lib/auth/authStore.ts` (Zustand store)
- [ ] Create `src/lib/auth/guards.ts` (requireAuth, requireStudent, requireCreator, requireAdmin)
- [ ] Create `src/services/student/student.service.ts`
- [ ] Create `src/services/teacher/teacher.service.ts`
- [ ] Create `src/hooks/auth/useAuthBootstrap.ts`
- [ ] Create `src/hooks/student/useCurrentStudentQuery.ts`
- [ ] Create `src/hooks/teacher/useCurrentTeacherQuery.ts`

### Auth Flow (Phase 2)
- [ ] Update `src/hooks/useAuth.ts` to use authStore and bootstrap
- [ ] Update `src/middleware.ts` to check domain IDs (where possible)
- [ ] Add `useAuthBootstrap()` to root layout
- [ ] Update login flow to hydrate domain IDs
- [ ] Update logout to clear domain IDs

### Routes (Phase 3)
- [ ] Create `/tags` route (TagListScreen)
- [ ] Create `/students/me` route (StudentMeScreen)
- [ ] Create `/enrollments/:id` route (EnrollmentDetailScreen)
- [ ] Create all missing student routes (see TASK 3)
- [ ] Create `/teachers/me` route (TeacherMeScreen)
- [ ] Create `/teachers/:id/stats` route (TeacherStatsScreen)
- [ ] Create `/teachers/:id/revenue` route (TeacherRevenueScreen)
- [ ] Update existing routes to match docs/routes.md paths

### Contract Keys (Phase 4)
- [ ] Update all services to use contract keys
- [ ] Update hook naming to match convention (useXxxQuery, useXxxMutation)
- [ ] Add testId attributes following Interactive_Elements_List.md

### Architecture (Phase 5)
- [ ] Create `src/features/` directory structure
- [ ] Move domain components from `core/components/` to `features/`
- [ ] Create feature API hooks in `features/*/api/`
- [ ] Update imports to respect boundaries (features → core, not reverse)

### Testing
- [ ] Test auth bootstrap flow (AUTH_ME → STUDENT_GET_ME/TEACHER_GET_ME)
- [ ] Test guards (requireStudent, requireCreator, requireAdmin)
- [ ] Test refresh token flow
- [ ] Test route navigation with domain IDs
- [ ] Verify no accountId used in place of studentId/teacherId

---

## Notes

1. **Critical Rule:** Never use `accountId` in place of `studentId` or `teacherId` when constructing routes with `:id` (e.g., `/teachers/:id/stats` must use `teacherId`).

2. **Bootstrap Timing:** Auth bootstrap should run in root layout or a client component wrapper to ensure it runs on every page load.

3. **Error Handling:** If `STUDENT_GET_ME` or `TEACHER_GET_ME` returns 404, handle gracefully (profile not created yet).

4. **Migration:** Existing code using `useCurrentUser` should be updated to use `useAuthStore` and domain-specific hooks.

---

**End of Audit Report**

