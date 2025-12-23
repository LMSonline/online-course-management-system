# Frontend Refactor Summary

## A) Commit-Style Summary of Changes

### New Files Created

**Core API Infrastructure:**
- `src/services/core/api.ts` - Axios-based API client with interceptors
- `src/services/core/token.ts` - Token management utilities
- `src/services/core/auth-refresh.ts` - Token refresh with single-flight lock
- `src/services/core/errors.ts` - Standardized error classes

**Configuration:**
- `src/config/runtime.ts` - Runtime configuration (USE_MOCK flag, API_BASE_URL)

**Feature Structure:**
- `src/features/instructor/types/dashboard.types.ts` - Instructor dashboard types
- `src/features/instructor/mocks/dashboard.mocks.ts` - Instructor dashboard mocks
- `src/features/instructor/services/instructor.service.ts` - Instructor service
- `src/features/courses/types/catalog.types.ts` - Course catalog types
- `src/features/courses/types/course-detail.types.ts` - Course detail types
- `src/features/courses/mocks/catalog.mocks.ts` - Course catalog mocks
- `src/features/courses/mocks/course-detail.mocks.ts` - Course detail mocks
- `src/features/courses/services/courses.service.ts` - Courses service
- `src/features/auth/services/auth.service.ts` - Auth service (migrated from services/public)
- `src/features/auth/utils/requireAuth.ts` - Auth guard utilities

**Hooks (Moved):**
- `src/hooks/useBump.ts` - Moved from `src/core/components/hooks/UseBump.ts`
- `src/hooks/useHoverFloat.ts` - Moved from `src/core/components/hooks/UseHoverFloat.ts`
- `src/hooks/usePrefersReducedMotion.ts` - Moved from `src/core/components/hooks/UsePrefersReducedMotion.ts`
- `src/hooks/useSplashRedirect.ts` - Moved from `src/core/components/hooks/UseSplashRedirect.ts`
- `src/hooks/useGsapFadeIn.ts` - Moved from `src/core/components/gsap/UseGsapFadeIn.ts`
- `src/hooks/useGsapStagger.ts` - Moved from `src/core/components/gsap/UseGsapStagger.ts`

**Store (Moved):**
- `src/store/assistant.store.ts` - Moved from `src/core/components/public/store.ts`

### Files Modified

**Configuration:**
- `tsconfig.json` - Added path aliases for features, services, store, hooks, config, types
- `package.json` - Added axios dependency

**Pages Updated to Use Services:**
- `src/app/instructor/dashboard/page.tsx` - Now uses `getInstructorDashboard()` service
- `src/app/learner/catalog/page.tsx` - Now uses `listCourses()` service
- `src/app/learner/courses/[slug]/page.tsx` - Now uses `getCourseBySlug()` service
- `src/app/(public)/login/page.tsx` - Updated to use new auth service
- `src/app/[username]/dashboard/page.tsx` - Updated imports

**Component Imports Updated:**
- `src/core/components/public/AssistantWidget.tsx` - Updated store import
- `src/core/components/public/Navbar.tsx` - Updated store import

### Files to Remove (After Verification)

**Old API Client:**
- `src/services/core/api.ts` (old fetch-based) - **NOTE**: This was replaced, but the old file may still exist. The new axios-based version is at the same path.

**Old Auth Service:**
- `src/services/public/auth.services.ts` - Can be removed after all imports are updated

**Old Hooks (after imports updated):**
- `src/core/components/hooks/*` - All hooks moved to `src/hooks/`
- `src/core/components/gsap/*` - All GSAP hooks moved to `src/hooks/`

**Old Store:**
- `src/core/components/public/store.ts` - Moved to `src/store/assistant.store.ts`

---

## B) Updated Folder Tree

```
frontend/
├── src/
│   ├── app/                          # Next.js App Router (unchanged structure)
│   │   ├── (public)/
│   │   ├── [username]/
│   │   ├── admin/
│   │   ├── instructor/
│   │   └── learner/
│   ├── components/                   # UI components (to be reorganized)
│   │   └── core/                     # Legacy - will be moved to features/
│   │       └── components/
│   │           ├── admin/
│   │           ├── instructor/
│   │           ├── learner/
│   │           ├── public/
│   │           └── ui/
│   ├── features/                     # NEW: Feature-based modules
│   │   ├── auth/
│   │   │   ├── services/
│   │   │   │   └── auth.service.ts
│   │   │   └── utils/
│   │   │       └── requireAuth.ts
│   │   ├── courses/
│   │   │   ├── services/
│   │   │   │   └── courses.service.ts
│   │   │   ├── types/
│   │   │   │   ├── catalog.types.ts
│   │   │   │   └── course-detail.types.ts
│   │   │   └── mocks/
│   │   │       ├── catalog.mocks.ts
│   │   │       └── course-detail.mocks.ts
│   │   └── instructor/
│   │       ├── services/
│   │       │   └── instructor.service.ts
│   │       ├── types/
│   │       │   └── dashboard.types.ts
│   │       └── mocks/
│   │           └── dashboard.mocks.ts
│   ├── hooks/                        # NEW: Cross-feature hooks
│   │   ├── useBump.ts
│   │   ├── useHoverFloat.ts
│   │   ├── usePrefersReducedMotion.ts
│   │   ├── useSplashRedirect.ts
│   │   ├── useGsapFadeIn.ts
│   │   └── useGsapStagger.ts
│   ├── services/                     # API services
│   │   ├── core/                     # Core API infrastructure
│   │   │   ├── api.ts                # Axios client (NEW)
│   │   │   ├── token.ts              # Token management (NEW)
│   │   │   ├── auth-refresh.ts       # Token refresh (NEW)
│   │   │   └── errors.ts             # Error classes (NEW)
│   │   ├── public/                   # Legacy - to be migrated
│   │   │   └── auth.services.ts      # OLD - use features/auth/services/auth.service.ts
│   │   └── teacher/                  # Legacy - to be migrated
│   │       └── teacher.services.ts
│   ├── store/                        # NEW: Global state
│   │   └── assistant.store.ts
│   ├── lib/                          # Utilities (unchanged)
│   │   ├── cn.ts
│   │   └── [legacy types - to be migrated]
│   ├── config/                       # NEW: Configuration
│   │   └── runtime.ts
│   └── styles/
│       └── globals.css
├── .env.example                      # NEW: Environment template
└── package.json                      # Updated: axios added
```

---

## C) Screen -> Service Mapping Table

| Screen | Old Mock Source | New Service Function | Status |
|--------|----------------|---------------------|--------|
| `/instructor/dashboard` | `INSTRUCTOR_DASHBOARD_MOCK` from `lib/instructor/dashboard/types.ts` | `getInstructorDashboard()` from `features/instructor/services/instructor.service.ts` | ✅ **DONE** |
| `/learner/catalog` | `COURSE_CATALOG_MOCK` from `lib/learner/catalog/types.ts` | `listCourses(params)` from `features/courses/services/courses.service.ts` | ✅ **DONE** |
| `/learner/courses/[slug]` | `MOCK_COURSE` from `lib/learner/course/types.ts` | `getCourseBySlug(slug)` from `features/courses/services/courses.service.ts` | ✅ **DONE** |
| `/admin/dashboard` | `ADMIN_MOCK_DATA` from `lib/admin/types.ts` | ❌ **TODO**: Create `features/admin/services/admin.service.ts` | ⚠️ **PENDING** |
| `/admin/manage/users` | `ADMIN_MOCK_DATA.users` | ❌ **TODO**: Add `getUsers()` to admin service | ⚠️ **PENDING** |
| `/admin/manage/courses/approval` | `ADMIN_MOCK_DATA.courseApprovals` | ❌ **TODO**: Add `getCourseApprovals()` to admin service | ⚠️ **PENDING** |
| `/learner/dashboard` | `MOCK_COURSES`, `RECOMMENDED_COURSES` | ❌ **TODO**: Create `features/learner/services/learner.service.ts` | ⚠️ **PENDING** |
| `/learner/assignments` | Mock data in types | ❌ **TODO**: Add to learner service | ⚠️ **PENDING** |
| `/learner/quiz/[id]` | `MOCK_QUIZ` | ❌ **TODO**: Add to learner service | ⚠️ **PENDING** |

---

## D) Backend Integration Checklist

### Endpoints Expected by Frontend

#### Auth Endpoints (✅ Implemented in Backend)
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/verify-email` - Verify email
- `POST /api/v1/auth/resend-verification-email` - Resend verification
- `POST /api/v1/auth/forgot-password` - Forgot password
- `POST /api/v1/auth/reset-password` - Reset password
- `PUT /api/v1/auth/change-password` - Change password

#### Teacher/Instructor Endpoints (✅ Implemented in Backend)
- `GET /api/v1/teachers/me` - Get current teacher profile
- `GET /api/v1/teachers/{id}` - Get teacher by ID
- `GET /api/v1/teachers/{id}/stats` - Get teacher statistics
- `GET /api/v1/teachers/{id}/revenue` - Get teacher revenue
- `GET /api/v1/teachers/{id}/courses` - Get teacher's courses
- `GET /api/v1/teachers/{id}/students` - Get teacher's students
- `PUT /api/v1/teachers/{id}` - Update teacher
- `PUT /api/v1/teachers/{id}/avatar` - Upload avatar
- `POST /api/v1/teachers/{id}/request-approval` - Request approval
- `POST /api/v1/teachers/{id}/approve` - Approve teacher (admin)
- `POST /api/v1/teachers/{id}/reject` - Reject teacher (admin)
- `DELETE /api/v1/teachers/{id}` - Delete teacher (admin)

#### Course Endpoints (⚠️ Partially Implemented)
- `GET /api/v1/courses` - List courses (with filters: category, level, search)
  - **Status**: Backend exists but may need pagination support
  - **Expected Response**: `PageResponse<CourseResponse>`
- `GET /api/v1/courses/{slug}` - Get course by slug
  - **Status**: Backend exists
  - **Expected Response**: `CourseDetailResponse`
- `GET /api/v1/courses/{id}/lessons` - Get course lessons
  - **Status**: Check if exists
- `POST /api/v1/courses/{id}/enroll` - Enroll in course
  - **Status**: Check if exists

#### Learner Endpoints (❌ Not Yet Created)
- `GET /api/v1/learners/{id}/dashboard` - Learner dashboard data
- `GET /api/v1/learners/{id}/courses` - Learner's enrolled courses
- `GET /api/v1/learners/{id}/assignments` - Learner's assignments
- `GET /api/v1/learners/{id}/progress` - Learning progress

#### Admin Endpoints (❌ Not Yet Created)
- `GET /api/v1/admin/users` - List all users
- `GET /api/v1/admin/courses/approvals` - List course approvals
- `GET /api/v1/admin/reports` - System reports
- `GET /api/v1/admin/dashboard` - Admin dashboard data

---

## E) How to Use

### Running in Mock Mode

1. Create `.env.local` file:
   ```env
   NEXT_PUBLIC_USE_MOCK=true
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

2. Run the app:
   ```bash
   npm run dev
   ```

3. All API calls will return mock data.

### Running with Real API

1. Update `.env.local`:
   ```env
   NEXT_PUBLIC_USE_MOCK=false
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```

2. Ensure backend is running on the specified URL.

3. All API calls will hit the real backend.

### Switching Between Modes

The `USE_MOCK` flag in `src/config/runtime.ts` controls this. Each service checks this flag:
- If `true`: Returns mock data immediately
- If `false`: Makes real API calls

---

## F) Remaining Work

### High Priority

1. **Update remaining pages to use services:**
   - `/admin/dashboard` → Create admin service
   - `/admin/manage/users` → Add `getUsers()` to admin service
   - `/admin/manage/courses/approval` → Add `getCourseApprovals()` to admin service
   - `/learner/dashboard` → Create learner service

2. **Move components to features:**
   - `src/core/components/admin/*` → `src/features/admin/components/*`
   - `src/core/components/instructor/*` → `src/features/instructor/components/*`
   - `src/core/components/learner/*` → `src/features/learner/components/*`
   - `src/core/components/public/*` → `src/features/public/components/*` or `src/components/shared/*`

3. **Update all imports:**
   - Search for old hook imports: `@/core/components/hooks/*` → `@/hooks/*`
   - Search for old store imports: `@/core/components/public/store` → `@/store/assistant.store`
   - Search for old type imports: Update to new feature-based paths

4. **Remove old files:**
   - Delete `src/core/components/hooks/` folder
   - Delete `src/core/components/gsap/` folder
   - Delete `src/core/components/public/store.ts`
   - Delete `src/services/public/auth.services.ts` (after all imports updated)

### Medium Priority

5. **Create missing services:**
   - `src/features/admin/services/admin.service.ts`
   - `src/features/learner/services/learner.service.ts`
   - `src/features/public/services/public.service.ts` (if needed)

6. **Add error boundaries:**
   - Create `src/components/shared/ErrorBoundary.tsx`
   - Wrap main app sections

7. **Add loading states:**
   - Create `src/components/shared/LoadingSpinner.tsx`
   - Use in all pages that fetch data

### Low Priority

8. **Expand UI component library:**
   - Add Input, Select, Modal, Card, Toast components to `src/components/ui/`

9. **Add route protection middleware:**
   - Create `src/middleware.ts` for Next.js middleware
   - Protect routes based on auth state

---

## G) Testing Checklist

- [ ] App compiles without errors (`npm run build`)
- [ ] Instructor dashboard loads with mock data
- [ ] Course catalog loads with mock data
- [ ] Course detail page loads with mock data
- [ ] Login works and stores tokens
- [ ] Token refresh works (test by manually expiring token)
- [ ] Switching `USE_MOCK` flag works correctly
- [ ] All imports resolve correctly
- [ ] No console errors in browser

---

## H) Notes

1. **Backward Compatibility**: Old files still exist to prevent breaking changes. Remove them after verifying all imports are updated.

2. **Token Refresh**: The refresh mechanism uses a single-flight lock to prevent multiple simultaneous refresh requests. If refresh fails, user is automatically redirected to `/login`.

3. **Error Handling**: All API errors are wrapped in `ApiError` class with standardized structure. Network errors are wrapped in `NetworkError`.

4. **Mock Toggle**: The `USE_MOCK` flag allows easy switching between mock and real API. This is useful for:
   - Development without backend
   - Testing UI with consistent data
   - Gradual backend integration

5. **Type Safety**: All services are fully typed. Types are separated from mocks for better organization.

---

## I) Migration Path for Remaining Screens

For each screen using mock data:

1. Create or extend the appropriate feature service
2. Add mock data to `features/{domain}/mocks/`
3. Update the page to:
   - Import the service function
   - Use `useState` and `useEffect` to fetch data
   - Add loading and error states
   - Replace inline mock usage with service call

Example pattern:
```typescript
const [data, setData] = useState<DataType | null>(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function loadData() {
    try {
      setLoading(true);
      const result = await getDataService();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  loadData();
}, []);
```

