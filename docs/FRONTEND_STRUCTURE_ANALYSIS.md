# Frontend LMS Codebase Structure Analysis

## A) Current Structure Overview

```
frontend/
├── public/                    # Static assets (images, SVGs)
│   └── images/
│       ├── avatars/
│       ├── banners/
│       ├── brand/
│       ├── certs/
│       └── skills/
├── src/
│   ├── app/                   # Next.js App Router (pages/routes)
│   │   ├── (public)/          # Public routes group
│   │   │   ├── explore/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   ├── forgot-password/
│   │   │   ├── reset-password/
│   │   │   ├── verify-email/
│   │   │   ├── privacy/
│   │   │   ├── terms/
│   │   │   └── layout.tsx
│   │   ├── [username]/       # Dynamic route
│   │   │   ├── dashboard/
│   │   │   └── layout.tsx
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   └── manage/
│   │   │       ├── courses/approval/
│   │   │       ├── reports/
│   │   │       └── users/
│   │   ├── instructor/
│   │   │   ├── dashboard/
│   │   │   └── course_ins/[id]/manage/
│   │   ├── learner/
│   │   │   ├── assignments/
│   │   │   ├── catalog/
│   │   │   ├── courses/
│   │   │   │   └── [slug]/
│   │   │   │       ├── learn/
│   │   │   │       └── page.tsx
│   │   │   ├── dashboard/
│   │   │   ├── quiz/[id]/
│   │   │   └── layout.tsx
│   │   └── layout.tsx         # Root layout
│   ├── core/                  # Shared/core functionality
│   │   └── components/
│   │       ├── admin/         # Admin-specific components
│   │       │   ├── courses/
│   │       │   ├── dashboard/
│   │       │   ├── navbar/
│   │       │   ├── reports/
│   │       │   └── users/
│   │       ├── course/        # Shared course components
│   │       ├── gsap/          # GSAP animation hooks
│   │       ├── hooks/         # Custom React hooks
│   │       ├── infra/         # Infrastructure adapters
│   │       ├── instructor/    # Instructor-specific components
│   │       │   ├── course-management/
│   │       │   ├── dashboard/
│   │       │   └── navbar/
│   │       ├── learner/      # Learner-specific components
│   │       │   ├── assignments/
│   │       │   ├── catalog/
│   │       │   ├── course/
│   │       │   ├── dashboard/
│   │       │   ├── navbar/
│   │       │   ├── player/
│   │       │   └── quiz/
│   │       ├── public/        # Public/shared components
│   │       │   ├── explore/
│   │       │   ├── landingpage/
│   │       │   ├── Advertisement.tsx
│   │       │   ├── AssistantPopup.tsx
│   │       │   ├── AssistantWidget.tsx
│   │       │   ├── Footer.tsx
│   │       │   ├── Navbar.tsx
│   │       │   ├── Popup.tsx
│   │       │   └── store.ts   # Zustand store (Assistant)
│   │       └── ui/            # UI primitives
│   │           ├── AnimatedBackground.tsx
│   │           ├── Button.tsx
│   │           ├── CategoryPills.tsx
│   │           ├── IconCircleButton.tsx
│   │           ├── SearchBar.tsx
│   │           └── TopicCard.tsx
│   ├── lib/                   # Type definitions & utilities
│   │   ├── admin/
│   │   │   └── types.ts
│   │   ├── instructor/
│   │   │   ├── course-management/types.ts
│   │   │   └── dashboard/types.ts
│   │   ├── learner/
│   │   │   ├── assignments/types.ts
│   │   │   ├── catalog/types.ts
│   │   │   ├── course/types.ts
│   │   │   ├── dashboard/types.ts
│   │   │   ├── player/types.ts
│   │   │   └── quiz/types.ts
│   │   └── cn.ts              # className utility (clsx + tailwind-merge)
│   ├── services/              # API client layer
│   │   ├── core/
│   │   │   └── api.ts         # Base API client (fetch wrapper)
│   │   ├── public/
│   │   │   └── auth.services.ts
│   │   └── teacher/
│   │       └── teacher.services.ts
│   └── styles/
│       └── globals.css        # Global styles + Tailwind imports
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── next.config.ts
```

---

## B) Folder-by-Folder Explanation

| Path | Purpose | Contains | Notes/Anti-patterns |
|------|---------|----------|---------------------|
| `src/app/` | Next.js App Router pages/routes | Page components (`page.tsx`), layouts (`layout.tsx`), route groups `(public)` | ✅ **GOOD**: Uses App Router conventions<br>⚠️ **ISSUE**: Mix of role-based (`admin/`, `instructor/`, `learner/`) and dynamic (`[username]/`) routes creates confusion<br>⚠️ **ISSUE**: `admin.txt`, `instructor.txt` files should be removed |
| `src/core/components/` | Shared/reusable components organized by domain | Domain-specific folders (`admin/`, `instructor/`, `learner/`, `public/`), UI primitives (`ui/`), hooks (`hooks/`) | ✅ **GOOD**: Clear domain separation<br>⚠️ **ISSUE**: `hooks/` inside `components/` is unconventional (should be `src/hooks/` or `src/core/hooks/`)<br>⚠️ **ISSUE**: `gsap/` folder contains hooks, not components<br>⚠️ **ISSUE**: `infra/` purpose unclear |
| `src/core/components/ui/` | UI primitives (design system) | Button, SearchBar, CategoryPills, IconCircleButton, etc. | ✅ **GOOD**: Design system components<br>⚠️ **ISSUE**: Very small set (only 6 components) - missing Input, Select, Modal, Card, etc.<br>⚠️ **ISSUE**: No index.ts for easy imports |
| `src/core/components/public/` | Public/shared components | Navbar, Footer, Popup, AssistantWidget, landing page sections | ✅ **GOOD**: Clear public components<br>⚠️ **ISSUE**: `store.ts` (Zustand) should be in `src/store/` or `src/core/store/`<br>⚠️ **ISSUE**: `explore/` and `landingpage/` could be feature folders |
| `src/lib/` | Type definitions & utilities | TypeScript types organized by feature (`admin/`, `instructor/`, `learner/`), utility functions (`cn.ts`) | ✅ **GOOD**: Types co-located by feature<br>⚠️ **ISSUE**: `lib/` typically means "library utilities" but here it's mostly types - consider `types/` or `@types/`<br>⚠️ **ISSUE**: Mock data mixed with types (e.g., `INSTRUCTOR_DASHBOARD_MOCK` in types.ts) |
| `src/services/` | API client layer | Service functions organized by domain (`public/`, `teacher/`), base client (`core/api.ts`) | ✅ **GOOD**: Clear API abstraction<br>⚠️ **ISSUE**: Only 3 service files - missing services for courses, students, assignments, etc.<br>⚠️ **ISSUE**: No interceptors for token refresh, error handling<br>⚠️ **ISSUE**: No request/response type definitions |
| `src/styles/` | Global styles | `globals.css` with Tailwind imports, CSS variables, theme definitions | ✅ **GOOD**: Single global stylesheet<br>✅ **GOOD**: CSS variables for theming<br>⚠️ **ISSUE**: Large file (250+ lines) - could split into `tokens.css`, `base.css`, `utilities.css` |
| `public/` | Static assets | Images, SVGs, brand assets | ✅ **GOOD**: Standard Next.js public folder<br>⚠️ **ISSUE**: No organization by type (all images in one folder) |

---

## C) Key Components & Usage

### Component Groups

1. **UI Primitives** (`src/core/components/ui/`):
   - `Button.tsx` - Primary button component with variants
   - `SearchBar.tsx` - Search input component
   - `CategoryPills.tsx` - Category filter pills
   - `IconCircleButton.tsx` - Icon button variant
   - `TopicCard.tsx` - Topic display card
   - `AnimatedBackground.tsx` - Background animation component

2. **Domain Components** (organized by role):
   - **Admin**: `AdminNavbar`, `AdminDashboardHeader`, `AdminStatsRow`, `AdminUserTable`, `AdminCourseApprovalList`
   - **Instructor**: `InstructorNavbar`, `InstructorDashboardHeader`, `StatsRow`, `RevenueChart`, `CoursesTable`
   - **Learner**: `LearnerNavbar`, `DashboardHeader`, `CourseHero`, `CoursePlayerShell`, `QuizPlayerShell`
   - **Public**: `Navbar`, `Footer`, `Popup`, `AssistantWidget`

3. **Shared Course Components** (`src/core/components/course/`):
   - `CourseCard.tsx` - Course display card
   - `CourseGrid.tsx` - Grid layout for courses
   - `CourseHoverCard.tsx` - Hover variant
   - `SkillCourseCard.tsx` - Skill-specific variant

4. **Layout Components**:
   - `Navbar.tsx` (public)
   - `Footer.tsx`
   - Role-specific navbars (`LearnerNavbar`, `InstructorNavbar`, `AdminNavbar`)

5. **Form Components**:
   - ❌ **MISSING**: No dedicated form components (Input, Select, Textarea, Form wrapper)

6. **Modal/Dialog Components**:
   - `Popup.tsx` - Generic popup component
   - `AssistantPopup.tsx` - Assistant-specific popup
   - ❌ **MISSING**: No reusable Modal/Dialog component

### Top 10 Most-Used Components (by import frequency)

| Component | Path | Props | Responsibilities | Where Used |
|-----------|------|-------|-------------------|------------|
| **Popup** | `src/core/components/public/Popup.tsx` | `type`, `title`, `message`, `actions`, `open`, `onClose` | Generic popup/modal for notifications, confirmations | Login, Signup, Forgot Password, Reset Password, Verify Email pages |
| **CourseCard** | `src/core/components/course/CourseCard.tsx` | `Course` type (title, teacher, image, rating, price, etc.) | Display course information in card format | Explore pages, Catalog, Landing page carousels |
| **Button** | `src/core/components/ui/Button.tsx` | `variant`, `size`, `className`, standard button props | Primary button component with variants (primary, outline, soft, ghost, icon) | Landing page, Hero sections, CTAs |
| **Navbar** (various) | `src/core/components/{role}/navbar/*Navbar.tsx` | Role-specific props | Navigation bars for each role | All authenticated pages via layouts |
| **CourseGrid** | `src/core/components/course/CourseGrid.tsx` | `courses` array | Grid layout for displaying multiple courses | Catalog page, Courses listing page |
| **DashboardHeader** | `src/core/components/{role}/dashboard/*DashboardHeader.tsx` | User info, stats | Dashboard page headers | All dashboard pages |
| **CoursePlayerShell** | `src/core/components/learner/player/CoursePlayerShell.tsx` | Course/lesson data | Video player container with sidebar | Course learning pages (`/courses/[slug]/learn`) |
| **QuizPlayerShell** | `src/core/components/learner/quiz/QuizPlayerShell.tsx` | Quiz data | Quiz interface container | Quiz pages (`/quiz/[id]`) |
| **StatsRow** | `src/core/components/{role}/dashboard/StatsRow.tsx` | Stats data object | Display statistics cards | Dashboard pages (instructor, admin) |
| **FilterBar** | `src/core/components/learner/catalog/FilterBar.tsx` | Filter state, onChange | Course filtering controls | Catalog page |

---

## D) Routes/Screens Map

| Screen/Route | Feature Module | Data Flow | State Management | Main Child Components |
|--------------|----------------|-----------|------------------|----------------------|
| `/` (landing) | Public | Static/mock data | Local (useState) | `Hero`, `BannerCarousel`, `FeaturedSkills`, `ReviewsSection` |
| `/login` | Auth | `auth.services.ts` → `loginUser()` | Local (form state) | `Popup` (for errors/success) |
| `/signup` | Auth | `auth.services.ts` → `registerUser()` | Local (form state) | `Popup` |
| `/[username]/dashboard` | Unified Dashboard | `auth.services.ts` → `getCurrentUserInfo()` | Local (useState) | Routes to role-specific dashboards |
| `/learner/dashboard` | Learner Dashboard | Mock data (`INSTRUCTOR_DASHBOARD_MOCK` - **WRONG!**) | Local | `DashboardHeader`, `DashboardStatsRow`, `MyCoursesSection`, `RecommendedCarousel` |
| `/instructor/dashboard` | Instructor Dashboard | Mock data (`INSTRUCTOR_DASHBOARD_MOCK`) | Local | `InstructorDashboardHeader`, `StatsRow`, `RevenueChart`, `CoursesPerformanceTable` |
| `/admin/dashboard` | Admin Dashboard | Mock data (`ADMIN_MOCK_DATA`) | Local | `AdminDashboardHeader`, `AdminStatsRow`, `AdminDashboardCharts` |
| `/learner/catalog` | Course Catalog | Mock data (`COURSE_CATALOG_MOCK`) | Local (filter state) | `CatalogHeader`, `CategoryTabs`, `FilterBar`, `CourseGrid` |
| `/learner/courses/[slug]` | Course Detail | ❌ **NO API CALL** | Local | `CourseHero`, `CourseWhatYouWillLearn`, `CourseIncludes`, `CourseContentOutline` |
| `/learner/courses/[slug]/learn` | Course Player | ❌ **NO API CALL** | Local | `CoursePlayerShell`, `LessonSidebar`, `LessonContent` |
| `/admin/manage/users` | User Management | Mock data (`ADMIN_MOCK_DATA.users`) | Local (filter state) | `AdminUserFilters`, `AdminUserTable` |
| `/admin/manage/courses/approval` | Course Approval | Mock data (`ADMIN_MOCK_DATA.courseApprovals`) | Local | `AdminCourseApprovalList` |
| `/instructor/course_ins/[id]/manage` | Course Management | Mock data (`MOCK_INSTRUCTOR_COURSE_MANAGE`) | Local | `CourseManagementShell`, `CurriculumEditor`, `ItemInspector` |

**Critical Issues:**
- ❌ **ALL dashboards use mock data** - No real API integration
- ❌ **Course pages have no data fetching** - Static/mock only
- ❌ **No loading states** - Components assume data is available
- ❌ **No error handling** - No error boundaries or fallbacks

---

## E) Data Layer Analysis

### API Client Organization

**File**: `src/services/core/api.ts`

**Structure:**
- Base URL: `process.env.NEXT_PUBLIC_API_BASE_URL`
- Function: `apiClient(path, options)` - Wrapper around native `fetch`
- Auth: Reads `accessToken` from `localStorage`, adds `Authorization: Bearer <token>` header
- Error handling: Throws errors with `status` and `response` properties

**Issues:**
1. ❌ **No interceptors** - Cannot handle token refresh automatically
2. ❌ **No request/response interceptors** - Cannot add global headers, transform responses
3. ❌ **No retry logic** - Failed requests are not retried
4. ❌ **No timeout** - Requests can hang indefinitely
5. ❌ **No request cancellation** - Cannot cancel in-flight requests
6. ❌ **Hardcoded Content-Type** - Always sets `application/json`, breaks file uploads (though fixed for avatar)

### Auth Flow

**Token Storage:**
- `localStorage.getItem("accessToken")` - Access token
- `localStorage.getItem("refreshToken")` - Refresh token (stored but not used)
- `localStorage.getItem("user")` - User object (JSON stringified)
- `localStorage.getItem("teacherId")` - Teacher ID (for TEACHER role)

**Auth Service**: `src/services/public/auth.services.ts`
- Functions: `loginUser()`, `registerUser()`, `getCurrentUserInfo()`, `changePassword()`, etc.
- All use `apiClient()` with appropriate methods

**Issues:**
1. ❌ **No token refresh** - `refreshToken` is stored but never used
2. ❌ **No auth guards** - No route protection middleware
3. ❌ **No token expiration check** - Tokens may be expired but still used
4. ❌ **No automatic logout** - User stays "logged in" even if token is invalid
5. ❌ **Manual token management** - Each page manually checks `localStorage`

### Caching Strategy

**Current State:**
- ❌ **NO caching library** - No React Query, SWR, or Redux caching
- ❌ **Manual caching** - `localStorage` used for user data (not proper cache)
- ❌ **No cache invalidation** - Data never refreshes automatically
- ❌ **No request deduplication** - Same request can fire multiple times

**Recommendation:**
- Implement React Query or SWR for:
  - Automatic caching
  - Request deduplication
  - Background refetching
  - Cache invalidation
  - Optimistic updates

---

## F) State Management

### Library: Zustand

**File**: `src/core/components/public/store.ts`

**Current Stores:**
1. **AssistantStore** - Controls assistant popup open/close state
   ```typescript
   interface AssistantStore {
     open: boolean;
     openPopup: () => void;
     closePopup: () => void;
   }
   ```

**Issues:**
1. ❌ **Only ONE store** - Minimal state management usage
2. ❌ **Store location wrong** - Should be in `src/store/` or `src/core/store/`, not inside `components/`
3. ❌ **No auth store** - Auth state managed via `localStorage` + local component state
4. ❌ **No global UI state** - Loading, error states managed locally
5. ❌ **No feature stores** - No stores for courses, users, assignments, etc.

**Recommendation:**
- Create proper store structure:
  ```
  src/store/
    ├── auth.store.ts      # Auth state (user, tokens)
    ├── ui.store.ts        # Global UI state (loading, modals, notifications)
    ├── courses.store.ts   # Course data cache
    └── index.ts           # Store exports
  ```

---

## G) Styling

### Framework: Tailwind CSS v4.1.13

**Configuration**: `tailwind.config.js`
- Content paths: `./src/app/**/*`, `./src/components/**/*`
- Custom colors: `brand-*`, `brand-primary`, `brand-secondary`, `brand-accent`
- Custom shadows: `glow` effect

**Global Styles**: `src/styles/globals.css`
- Tailwind imports: `@import "tailwindcss"`
- CSS variables: Design tokens for colors, spacing, themes
- Dark theme: Default dark mode with CSS variables
- Light theme: Optional light mode class

**Utility**: `src/lib/cn.ts`
- Combines `clsx` + `tailwind-merge` for className merging
- Prevents Tailwind class conflicts

**Conventions:**
- ✅ Uses Tailwind utility classes throughout
- ✅ CSS variables for theming
- ✅ `cn()` utility for conditional classes
- ⚠️ **ISSUE**: No component-level CSS modules or styled-components
- ⚠️ **ISSUE**: Some inline styles in components (should use Tailwind)

---

## H) Types

### Type Organization

**Location**: `src/lib/{feature}/types.ts`

**Structure:**
- `src/lib/admin/types.ts` - Admin types
- `src/lib/instructor/{feature}/types.ts` - Instructor types by feature
- `src/lib/learner/{feature}/types.ts` - Learner types by feature

**Issues:**

1. **Duplicated Types:**
   - `Course` type defined in:
     - `src/core/components/course/CourseCard.tsx` (exported)
     - `src/lib/learner/catalog/types.ts` as `CourseSummary` (similar but different)
     - Likely duplicated in other feature types
   
2. **Mock Data Mixed with Types:**
   - `INSTRUCTOR_DASHBOARD_MOCK` in `types.ts` - Should be in separate `mocks.ts` or `fixtures.ts`
   - `COURSE_CATALOG_MOCK` in `types.ts` - Same issue
   - `ADMIN_MOCK_DATA` in `types.ts` - Same issue

3. **No Shared Types:**
   - No `src/lib/shared/types.ts` for common types (User, Course, etc.)
   - Each feature defines its own variants

4. **Type Naming Inconsistency:**
   - `Course` vs `CourseSummary` vs `CourseResponse` - Unclear which to use

**Recommendation:**
```
src/lib/
  ├── shared/
  │   ├── types.ts          # Common types (User, Course, etc.)
  │   └── api.types.ts      # API request/response types
  ├── admin/
  │   └── types.ts          # Admin-specific types
  └── {feature}/
      ├── types.ts          # Feature types
      └── mocks.ts          # Mock data (separate from types)
```

---

## I) Problems Found (8+ Concrete Issues)

### 1. **Mock Data Everywhere - No Real API Integration**
   - **Evidence**: `src/app/instructor/dashboard/page.tsx` uses `INSTRUCTOR_DASHBOARD_MOCK`
   - **Evidence**: `src/app/learner/catalog/page.tsx` uses `COURSE_CATALOG_MOCK`
   - **Impact**: Application is not functional - all data is hardcoded

### 2. **Incorrect Store Location**
   - **Evidence**: `src/core/components/public/store.ts` - Store should not be inside components folder
   - **Impact**: Confusing structure, violates separation of concerns

### 3. **Hooks in Components Folder**
   - **Evidence**: `src/core/components/hooks/` and `src/core/components/gsap/` contain hooks, not components
   - **Impact**: Misleading folder structure

### 4. **Missing API Services**
   - **Evidence**: Only 3 service files (`auth.services.ts`, `teacher.services.ts`, `api.ts`)
   - **Impact**: No services for courses, students, assignments, quizzes, etc.

### 5. **No Token Refresh Mechanism**
   - **Evidence**: `localStorage.getItem("refreshToken")` stored but never used in `src/services/core/api.ts`
   - **Impact**: Users will be logged out when access token expires

### 6. **No Route Protection**
   - **Evidence**: No middleware or guards in `src/app/` routes
   - **Impact**: Unauthenticated users can access protected routes

### 7. **Type Duplication**
   - **Evidence**: `Course` type in `CourseCard.tsx` vs `CourseSummary` in `lib/learner/catalog/types.ts`
   - **Impact**: Type inconsistencies, maintenance burden

### 8. **Mock Data Mixed with Types**
   - **Evidence**: `INSTRUCTOR_DASHBOARD_MOCK` defined in `src/lib/instructor/dashboard/types.ts`
   - **Impact**: Types file contains runtime data, violates separation

### 9. **No Error Boundaries**
   - **Evidence**: No error boundary components in `src/app/` or `src/core/components/`
   - **Impact**: Unhandled errors crash entire app

### 10. **No Loading States**
   - **Evidence**: Dashboard pages assume data is available immediately
   - **Impact**: Poor UX, potential crashes if data is slow to load

### 11. **Inconsistent Route Structure**
   - **Evidence**: Mix of role-based (`/admin/`, `/instructor/`) and dynamic (`/[username]/`) routes
   - **Impact**: Confusing navigation, unclear routing strategy

### 12. **Missing UI Components**
   - **Evidence**: Only 6 UI primitives in `src/core/components/ui/`
   - **Impact**: Missing Input, Select, Modal, Card, Toast, etc. - components likely duplicated or using native HTML

---

## J) Proposed Improved Structure

```
frontend/
├── public/                    # Static assets (unchanged)
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── (auth)/           # Auth routes group
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── layout.tsx
│   │   ├── (public)/         # Public routes
│   │   │   ├── explore/
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   ├── (dashboard)/      # Protected routes group
│   │   │   ├── [username]/
│   │   │   │   └── dashboard/
│   │   │   ├── admin/
│   │   │   ├── instructor/
│   │   │   ├── learner/
│   │   │   └── layout.tsx    # Auth guard + role-based layout
│   │   └── layout.tsx        # Root layout
│   ├── components/            # Renamed from core/components
│   │   ├── ui/               # UI primitives (expanded)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx     # NEW
│   │   │   ├── Select.tsx    # NEW
│   │   │   ├── Modal.tsx     # NEW
│   │   │   ├── Card.tsx      # NEW
│   │   │   ├── Toast.tsx     # NEW
│   │   │   └── index.ts      # Barrel exports
│   │   ├── layout/           # Layout components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── features/         # Feature components (domain-specific)
│   │   │   ├── auth/
│   │   │   ├── courses/
│   │   │   ├── dashboard/
│   │   │   └── admin/
│   │   └── shared/           # Shared components
│   │       ├── ErrorBoundary.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── EmptyState.tsx
│   ├── hooks/                # Custom hooks (moved from components/)
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useLocalStorage.ts
│   │   └── animations/       # Animation hooks
│   │       ├── useGsapFadeIn.ts
│   │       └── useHoverFloat.ts
│   ├── services/             # API services
│   │   ├── api/              # Base API client
│   │   │   ├── client.ts     # Renamed from api.ts
│   │   │   ├── interceptors.ts
│   │   │   └── types.ts
│   │   ├── auth/
│   │   │   └── auth.service.ts
│   │   ├── courses/
│   │   │   └── courses.service.ts
│   │   ├── teachers/
│   │   │   └── teachers.service.ts
│   │   └── index.ts          # Service exports
│   ├── store/                # Zustand stores (moved from components/)
│   │   ├── auth.store.ts
│   │   ├── ui.store.ts
│   │   ├── courses.store.ts
│   │   └── index.ts
│   ├── types/                # Renamed from lib/ (clearer purpose)
│   │   ├── shared/           # Common types
│   │   │   ├── api.types.ts
│   │   │   ├── user.types.ts
│   │   │   └── course.types.ts
│   │   ├── admin/
│   │   ├── instructor/
│   │   └── learner/
│   ├── lib/                  # Utilities only (not types)
│   │   ├── cn.ts
│   │   ├── format.ts
│   │   └── validation.ts
│   ├── constants/            # NEW: App constants
│   │   ├── routes.ts
│   │   ├── roles.ts
│   │   └── api.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── tokens.css       # Design tokens
│   │   └── utilities.css    # Custom utilities
│   └── middleware.ts         # NEW: Next.js middleware for auth
├── package.json
└── tailwind.config.js
```

### Migration Steps (in order)

1. **Create new folder structure** (empty folders first)
2. **Move hooks** from `src/core/components/hooks/` → `src/hooks/`
3. **Move store** from `src/core/components/public/store.ts` → `src/store/`
4. **Rename `lib/` to `types/`** and separate types from mocks
5. **Expand UI components** - Add Input, Select, Modal, etc.
6. **Create API services** for all features (courses, students, etc.)
7. **Add interceptors** to API client for token refresh
8. **Create auth middleware** for route protection
9. **Add error boundaries** to app layout
10. **Integrate React Query** for data fetching/caching
11. **Replace mock data** with real API calls
12. **Add loading/error states** to all pages
13. **Consolidate duplicate types** into shared types
14. **Remove `.txt` files** from app directory

---

## Summary

**Current State:**
- ✅ Good: Next.js App Router structure, Tailwind CSS, TypeScript
- ⚠️ Needs Work: Component organization, state management, API integration
- ❌ Critical: No real API integration (all mock data), no auth guards, no error handling

**Priority Fixes:**
1. **Immediate**: Add API services for all features
2. **Immediate**: Implement token refresh mechanism
3. **High**: Add route protection middleware
4. **High**: Replace mock data with real API calls
5. **Medium**: Reorganize folder structure (hooks, store, types)
6. **Medium**: Add error boundaries and loading states
7. **Low**: Expand UI component library

