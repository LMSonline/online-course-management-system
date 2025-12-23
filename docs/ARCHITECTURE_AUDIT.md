# Frontend Architecture Audit Report
**Date:** 2025-01-27  
**Framework:** Next.js 15.5.9 (App Router)  
**Language:** TypeScript 5

---

## A) Repository Inventory

### Directory Structure (Depth 4-6)

```
frontend/src/
├── app/                    # Next.js App Router (28 pages)
│   ├── (public)/          # Public routes (11 pages)
│   ├── [username]/        # Dynamic user routes (2 pages)
│   ├── admin/            # Admin routes (4 pages)
│   ├── instructor/       # Instructor routes (2 pages)
│   └── learner/          # Learner routes (8 pages)
├── components/
│   └── shared/           # Shared components (1: SafeImage)
├── core/
│   └── components/        # Domain-specific components (50+ files)
│       ├── admin/
│       ├── instructor/
│       ├── learner/
│       ├── public/
│       └── ui/           # UI primitives (6 components)
├── features/              # Feature modules (7 features)
│   ├── auth/
│   ├── courses/
│   ├── instructor/
│   ├── learner/
│   ├── profile/
│   ├── community/
│   └── recommendation/
├── services/
│   ├── core/             # Core API client (5 files)
│   ├── auth.ts          # Auth entrypoint
│   └── teacher/
├── store/                # Zustand stores (1 store)
├── hooks/                # Custom hooks (6 hooks)
├── lib/                  # Utilities & types
└── config/              # Runtime config
```

### Route Inventory (28 routes)

| Route | Type | Auth Required | Evidence |
|-------|------|---------------|----------|
| `/` | Public | ❌ | `app/(public)/page.tsx` |
| `/explore` | Public | ❌ | `app/(public)/explore/page.tsx` |
| `/login` | Public | ❌ | `app/(public)/login/page.tsx` |
| `/signup` | Public | ❌ | `app/(public)/signup/page.tsx` |
| `/search` | Public | ❌ | `app/(public)/search/page.tsx` |
| `/categories/[slug]` | Public | ❌ | `app/(public)/categories/[slug]/page.tsx` |
| `/forgot-password` | Public | ❌ | `app/(public)/forgot-password/page.tsx` |
| `/reset-password` | Public | ❌ | `app/(public)/reset-password/page.tsx` |
| `/verify-email` | Public | ❌ | `app/(public)/verify-email/page.tsx` |
| `/[username]/dashboard` | Protected | ✅ | `app/[username]/dashboard/page.tsx` |
| `/[username]/profile` | Protected | ✅ | `app/[username]/profile/page.tsx` |
| `/learner/dashboard` | Protected | ✅ | `app/learner/dashboard/page.tsx` |
| `/learner/courses` | Protected | ✅ | `app/learner/courses/page.tsx` |
| `/learner/courses/[slug]` | Protected | ✅ | `app/learner/courses/[slug]/page.tsx` |
| `/learner/courses/[slug]/learn` | Protected | ✅ | `app/learner/courses/[slug]/learn/page.tsx` |
| `/learner/catalog` | Protected | ✅ | `app/learner/catalog/page.tsx` |
| `/learner/certificates` | Protected | ✅ | `app/learner/certificates/page.tsx` |
| `/learner/assignments` | Protected | ✅ | `app/learner/assignments/page.tsx` |
| `/learner/quiz/[id]` | Protected | ✅ | `app/learner/quiz/[id]/page.tsx` |
| `/instructor/dashboard` | Protected | ✅ | `app/instructor/dashboard/page.tsx` |
| `/instructor/course_ins/[id]/manage` | Protected | ✅ | `app/instructor/course_ins/[id]/manage/page.tsx` |
| `/admin/dashboard` | Protected | ✅ | `app/admin/dashboard/page.tsx` |
| `/admin/manage/users` | Protected | ✅ | `app/admin/manage/users/page.tsx` |
| `/admin/manage/courses/approval` | Protected | ✅ | `app/admin/manage/courses/approval/page.tsx` |
| `/admin/manage/reports` | Protected | ✅ | `app/admin/manage/reports/page.tsx` |
| `/notifications` | Protected | ✅ | `app/notifications/page.tsx` |

**Route Protection:** Client-side only via `useEffect` checks in layouts (`app/[username]/layout.tsx`)

### Service Inventory (7 services)

| Service | Location | Endpoints | Uses Core API |
|---------|----------|-----------|---------------|
| Auth | `features/auth/services/auth.service.ts` | `/auth/*` (10 endpoints) | ✅ |
| Courses | `features/courses/services/courses.service.ts` | `/courses/*`, `/categories/*` | ✅ |
| Instructor | `features/instructor/services/instructor.service.ts` | `/teachers/*` | ✅ |
| Learner | `features/learner/services/learner.service.ts` | `/students/*` | ✅ |
| Profile | `features/profile/services/profile.service.ts` | `/accounts/*` | ✅ |
| Community | `features/community/services/community.service.ts` | `/courses/*/comments`, `/notifications/*` | ✅ |
| Recommendation | `features/recommendation/services/recommendation.service.ts` | `/students/*/recommendations` | ⚠️ (uses axios directly) |

### State Management Inventory

**Global State:**
- **Zustand:** 1 store (`store/assistant.store.ts`) - Assistant popup state only
- **localStorage:** Used for auth state (tokens, user, teacherId)
- **Component State:** Manual `useState`/`useEffect` for server data (119 instances)

**No:**
- React Query / SWR
- Redux / Context API for global state
- Auth store (uses localStorage + manual checks)

---

## B) Scorecard Table

| Category | Score | Evidence Paths | Key Gaps |
|----------|-------|----------------|----------|
| **(0) State Management** | **2/5** | `store/assistant.store.ts`, `services/core/token.ts`, `app/[username]/dashboard/page.tsx` | No auth store, no server data caching, manual useState everywhere |
| **(1) Architecture Patterns** | **3/5** | `features/*/services/*.ts`, `services/core/api.ts`, `config/runtime.ts` | Feature modularization good, but duplicate hooks, inconsistent service patterns |
| **(2) Routing & Navigation** | **2/5** | `app/**/page.tsx`, `app/[username]/layout.tsx` | No middleware, no error.tsx/loading.tsx, client-side guards only |
| **(3) Data Layer** | **3/5** | `services/core/api.ts`, `services/core/unwrap.ts`, `features/*/services/*.ts` | Good API client, but no caching, no request dedupe, no retry strategy |
| **(4) Auth & Session** | **3/5** | `services/core/auth-refresh.ts`, `services/core/token.ts`, `app/[username]/layout.tsx` | Token refresh works, but no middleware, client-side guards only |
| **(5) Component System** | **2/5** | `core/components/ui/*`, `components/shared/SafeImage.tsx`, `styles/globals.css` | Minimal UI primitives, no design system docs, inconsistent styling |
| **(6) Error Handling** | **2/5** | `services/core/errors.ts`, `app/**/page.tsx` | Standardized errors exist, but no error boundaries, no global error handler |
| **(7) Performance & UX** | **2/5** | `components/shared/SafeImage.tsx`, `app/**/page.tsx` | Basic loading states, no skeletons, no virtualization, no lazy loading |
| **(8) Security & Hardening** | **2/5** | `services/core/token.ts`, `services/core/api.ts` | Tokens in localStorage, no XSS protection visible, no input validation layer |
| **(9) Consistency & Conventions** | **3/5** | `tsconfig.json`, `features/*/types/*`, `features/*/mocks/*` | Good path aliases, types separated, but duplicate hooks, inconsistent naming |
| **(10) Testing Strategy** | **0/5** | N/A | No tests found, no test setup, no test scripts |
| **(11) Build/Deploy & Env** | **3/5** | `package.json`, `README.md`, `.env.example` (missing) | Basic scripts, no env validation, no CI config |
| **(12) Documentation** | **2/5** | `README.md` | Basic README, no ADRs, no dev guides, no API docs |

**Overall Score: 2.3/5 (Acceptable but needs improvement)**

---

## C) Detailed Findings by Category

### (0) State Management — Score: 2/5

**Evidence:**
- `store/assistant.store.ts` - Single Zustand store for assistant popup
- `services/core/token.ts` - Token utilities (localStorage)
- `app/[username]/dashboard/page.tsx:29-47` - Manual localStorage caching
- `app/learner/dashboard/page.tsx:15-55` - Manual useState for server data
- 119 `useState`/`useEffect` instances across pages

**What Works:**
- ✅ Zustand available for global state
- ✅ Token utilities centralized
- ✅ Feature-based service organization

**Risks:**
- ❌ **No auth store** - Auth state scattered (localStorage + component state)
- ❌ **No server data caching** - Every page refetches on mount
- ❌ **No request deduplication** - Same request can fire multiple times
- ❌ **No cache invalidation** - Stale data persists
- ❌ **Manual state management** - 119 useState/useEffect instances = maintenance burden

**Recommendations:**
1. **Create auth store** (`store/auth.store.ts`) - Centralize user state, token state, role
2. **Add React Query** - For server data caching, deduplication, background refetch
3. **Migrate 3 key pages** - Dashboard, course list, course detail to use React Query

---

### (1) Architecture Patterns — Score: 3/5

**Evidence:**
- `features/*/services/*.ts` - Feature-based service organization (7 services)
- `services/core/api.ts` - Centralized API client
- `services/core/unwrap.ts` - Response normalization
- `config/runtime.ts` - Mock toggle (`USE_MOCK`)
- `features/*/types/*` - Types separated from mocks
- `features/*/mocks/*` - Mocks separated from types

**What Works:**
- ✅ Feature modularization (auth, courses, instructor, learner, etc.)
- ✅ Service layer pattern
- ✅ Mock toggle for development
- ✅ Types and mocks separated

**Risks:**
- ⚠️ **Duplicate hooks** - Hooks exist in both `hooks/` and `core/components/hooks/`
- ⚠️ **Inconsistent service patterns** - Recommendation service uses axios directly
- ⚠️ **Legacy compat file** - `services/public/auth.services.ts` still exists (deprecated)

**Recommendations:**
1. **Remove duplicate hooks** - Consolidate `hooks/` and `core/components/hooks/`
2. **Fix recommendation service** - Use `apiClient` instead of direct axios
3. **Remove legacy auth file** - After confirming no imports

---

### (2) Routing & Navigation — Score: 2/5

**Evidence:**
- `app/**/page.tsx` - 28 routes defined
- `app/[username]/layout.tsx:22-44` - Client-side auth check
- `app/(public)/layout.tsx` - Public layout
- `app/learner/layout.tsx` - Learner layout
- No `middleware.ts` found
- No `error.tsx` or `loading.tsx` files

**What Works:**
- ✅ Route groups for organization (`(public)`, `[username]`)
- ✅ Layout separation by role
- ✅ Dynamic routes (`[slug]`, `[id]`, `[username]`)

**Risks:**
- ❌ **No middleware** - No server-side route protection
- ❌ **No error boundaries** - No `error.tsx` files
- ❌ **No loading states** - No `loading.tsx` files
- ❌ **Client-side guards only** - Auth checks in `useEffect` (flash of content)
- ❌ **Inconsistent route structure** - Mix of role-based (`/admin/`) and dynamic (`/[username]/`)

**Recommendations:**
1. **Add middleware.ts** - Server-side route protection, token validation
2. **Add error.tsx** - Global error boundary for each route group
3. **Add loading.tsx** - Loading skeletons for better UX

---

### (3) Data Layer — Score: 3/5

**Evidence:**
- `services/core/api.ts` - Axios client with interceptors
- `services/core/unwrap.ts` - Response normalization utilities
- `services/core/errors.ts` - Standardized error classes
- `services/core/auth-refresh.ts` - Token refresh with single-flight lock
- `features/*/services/*.ts` - Domain services use core API client

**What Works:**
- ✅ Centralized API client with interceptors
- ✅ Automatic token injection
- ✅ Token refresh on 401
- ✅ Response normalization (`unwrapApiResponse`, `unwrapPage`)
- ✅ Standardized error handling

**Risks:**
- ❌ **No request caching** - Every request hits network
- ❌ **No request deduplication** - Same request can fire multiple times
- ❌ **No retry strategy** - Failed requests not retried
- ❌ **No request cancellation** - Cannot cancel in-flight requests
- ❌ **No debouncing** - Search requests fire on every keystroke

**Recommendations:**
1. **Add request debouncing** - For search inputs (300ms debounce)
2. **Add retry strategy** - Exponential backoff for network errors
3. **Consider React Query** - For caching, deduplication, cancellation

---

### (4) Auth & Session — Score: 3/5

**Evidence:**
- `services/core/auth-refresh.ts:19-60` - Token refresh with single-flight lock
- `services/core/token.ts` - Token storage utilities
- `services/core/api.ts:44-61` - 401 interceptor with refresh
- `app/[username]/layout.tsx:22-44` - Client-side auth check
- `features/auth/utils/requireAuth.ts` - Auth guard utility

**What Works:**
- ✅ Token refresh with single-flight lock (prevents multiple refresh requests)
- ✅ Automatic token refresh on 401
- ✅ Token utilities centralized
- ✅ Auth guard utility exists

**Risks:**
- ❌ **No middleware** - No server-side auth validation
- ❌ **Client-side guards only** - Flash of content before redirect
- ❌ **Tokens in localStorage** - XSS vulnerability (consider httpOnly cookies)
- ❌ **No token expiration check** - Tokens may be expired but still used
- ❌ **No role-based route protection** - Routes not protected by role

**Recommendations:**
1. **Add middleware.ts** - Server-side route protection, role-based access
2. **Add token expiration check** - Validate token before API calls
3. **Consider httpOnly cookies** - For better XSS protection (requires backend change)

---

### (5) Component System / Design System — Score: 2/5

**Evidence:**
- `core/components/ui/` - 6 UI primitives (Button, SearchBar, CategoryPills, etc.)
- `components/shared/SafeImage.tsx` - Image wrapper with fallback
- `styles/globals.css` - CSS variables for theming
- `tailwind.config.js` - Tailwind configuration

**What Works:**
- ✅ Some UI primitives exist
- ✅ CSS variables for theming
- ✅ Tailwind for styling
- ✅ SafeImage component for error handling

**Risks:**
- ❌ **Minimal UI primitives** - Missing Input, Select, Modal, Toast, Card, etc.
- ❌ **No design system docs** - No component library documentation
- ❌ **Inconsistent styling** - Mix of inline styles and Tailwind
- ❌ **No accessibility audit** - No aria labels, focus states unclear

**Recommendations:**
1. **Add missing UI primitives** - Input, Select, Modal, Toast, Card (5 components)
2. **Create design system doc** - Component usage guide
3. **Add accessibility attributes** - aria-labels, focus states, keyboard navigation

---

### (6) Error Handling & Observability — Score: 2/5

**Evidence:**
- `services/core/errors.ts` - Standardized error classes (ApiError, NetworkError, AuthError)
- `services/core/api.ts:70-75` - Error normalization in interceptor
- `app/**/page.tsx` - Manual try/catch in components
- No error boundaries found

**What Works:**
- ✅ Standardized error classes
- ✅ Error normalization in API client
- ✅ Manual error handling in components

**Risks:**
- ❌ **No error boundaries** - Unhandled errors crash entire app
- ❌ **No global error handler** - No centralized error logging
- ❌ **No traceId support** - Cannot correlate errors with backend logs
- ❌ **No error reporting** - No Sentry/LogRocket integration

**Recommendations:**
1. **Add error.tsx** - Error boundaries for each route group
2. **Add global error handler** - Log errors to console/service
3. **Add traceId support** - Extract traceId from API errors for correlation

---

### (7) Performance & UX — Score: 2/5

**Evidence:**
- `components/shared/SafeImage.tsx` - Image optimization with fallback
- `app/**/page.tsx` - Basic loading states (`if (loading) return <p>Loading...</p>`)
- No lazy loading found
- No virtualization found

**What Works:**
- ✅ SafeImage component for image optimization
- ✅ Basic loading states exist
- ✅ Next.js Image component used

**Risks:**
- ❌ **No loading skeletons** - Plain text "Loading..." instead of skeletons
- ❌ **No lazy loading** - All components loaded upfront
- ❌ **No virtualization** - Long lists not virtualized (performance issue)
- ❌ **No empty states** - Missing empty state components
- ❌ **No layout stability** - Layout shifts on data load

**Recommendations:**
1. **Add loading skeletons** - For course cards, dashboards, lists
2. **Add lazy loading** - Use `next/dynamic` for heavy components
3. **Add empty states** - Empty state components for no data scenarios

---

### (8) Security & Hardening — Score: 2/5

**Evidence:**
- `services/core/token.ts` - Tokens stored in localStorage
- `services/core/api.ts:24-28` - Authorization header injection
- No input validation layer found
- No XSS protection visible

**What Works:**
- ✅ Tokens not logged (no leaks in console)
- ✅ Authorization header properly injected

**Risks:**
- ❌ **Tokens in localStorage** - XSS vulnerability (malicious scripts can access)
- ❌ **No input validation** - No client-side validation layer
- ❌ **No XSS protection** - User content rendered without sanitization
- ❌ **No rate limiting** - No debouncing on client (can spam API)

**Recommendations:**
1. **Add input validation** - Use Zod or Yup for form validation
2. **Sanitize user content** - Use DOMPurify for rendered user content
3. **Add request debouncing** - Prevent API spam (especially search)

---

### (9) Consistency & Conventions — Score: 3/5

**Evidence:**
- `tsconfig.json:21-31` - Path aliases configured (`@/*`, `@/features/*`, etc.)
- `features/*/types/*` - Types separated from mocks
- `features/*/mocks/*` - Mocks separated from types
- `services/auth.ts` - Canonical import path for auth

**What Works:**
- ✅ Path aliases configured
- ✅ Types and mocks separated
- ✅ Feature-based organization
- ✅ Canonical import paths

**Risks:**
- ⚠️ **Duplicate hooks** - Hooks in both `hooks/` and `core/components/hooks/`
- ⚠️ **Inconsistent naming** - Mix of camelCase and PascalCase
- ⚠️ **Legacy files** - `services/public/auth.services.ts` still exists

**Recommendations:**
1. **Consolidate duplicate hooks** - Remove duplicates, use single location
2. **Enforce naming conventions** - ESLint rule for consistent naming
3. **Remove legacy files** - After migration complete

---

### (10) Testing Strategy — Score: 0/5

**Evidence:**
- No test files found (`.test.ts`, `.spec.ts`)
- No test setup found (`jest.config.js`, `vitest.config.ts`)
- `package.json` has no test scripts

**What Works:**
- ❌ Nothing - No testing infrastructure

**Risks:**
- ❌ **No unit tests** - Services, utilities not tested
- ❌ **No component tests** - UI components not tested
- ❌ **No E2E tests** - Critical flows not tested
- ❌ **No test coverage** - Cannot measure code quality

**Recommendations:**
1. **Add test setup** - Jest + React Testing Library
2. **Add unit tests** - For services, utilities (10-20 tests)
3. **Add component tests** - For key UI components (5-10 tests)

---

### (11) Build/Deploy & Env Management — Score: 3/5

**Evidence:**
- `package.json:5-10` - Basic scripts (dev, build, start, lint)
- `README.md` - Basic setup instructions
- `config/runtime.ts` - Runtime config with env vars
- No `.env.example` found
- No CI config found

**What Works:**
- ✅ Basic npm scripts
- ✅ README with setup instructions
- ✅ Runtime config for env vars

**Risks:**
- ❌ **No .env.example** - Developers don't know required env vars
- ❌ **No env validation** - Missing env vars cause runtime errors
- ❌ **No CI config** - No automated lint/typecheck/test/build
- ❌ **No deployment docs** - No deployment instructions

**Recommendations:**
1. **Add .env.example** - Document all required env vars
2. **Add env validation** - Validate env vars on startup
3. **Add CI config** - GitHub Actions for lint/typecheck/test/build

---

### (12) Documentation — Score: 2/5

**Evidence:**
- `README.md` - Basic setup and project structure
- No ADRs found
- No dev guides found
- No API docs found

**What Works:**
- ✅ Basic README with setup instructions
- ✅ Project structure documented

**Risks:**
- ❌ **No ADRs** - No architecture decision records
- ❌ **No dev guides** - No "how to add a screen/service" guide
- ❌ **No API docs** - No frontend API contract documentation

**Recommendations:**
1. **Add dev guide** - "How to add a new screen/service" guide
2. **Add API docs** - Document frontend service contracts
3. **Add ADRs** - Document key architecture decisions

---

## D) Top 10 Prioritized Improvements

| Priority | Improvement | Impact | Effort | Files to Create/Modify |
|----------|-------------|--------|--------|------------------------|
| 1 | Add middleware.ts for route protection | High | Low | `src/middleware.ts` |
| 2 | Add error.tsx and loading.tsx | High | Low | `src/app/error.tsx`, `src/app/loading.tsx` |
| 3 | Create auth store (Zustand) | High | Medium | `src/store/auth.store.ts`, update 5 pages |
| 4 | Add .env.example | Medium | Low | `.env.example` |
| 5 | Consolidate duplicate hooks | Medium | Low | Remove `core/components/hooks/`, update imports |
| 6 | Add input validation (Zod) | Medium | Medium | `src/lib/validation.ts`, update 5 forms |
| 7 | Add loading skeletons | Medium | Medium | `src/components/ui/Skeleton.tsx`, update 5 pages |
| 8 | Add error boundaries | High | Medium | `src/app/error.tsx` (3 files), `src/components/ErrorBoundary.tsx` |
| 9 | Add request debouncing | Medium | Low | `src/hooks/useDebounce.ts`, update search pages |
| 10 | Add test setup | High | High | `jest.config.js`, `src/**/*.test.ts` (10-20 tests) |

---

## E) 2-Phase Roadmap

### Phase 1: Stabilize Fundamentals (1-2 days)

**Goal:** Fix critical gaps for production readiness

1. **Add middleware.ts** (2 hours)
   - Server-side route protection
   - Token validation
   - Role-based access control

2. **Add error.tsx and loading.tsx** (2 hours)
   - Global error boundary
   - Loading skeletons for key pages

3. **Create auth store** (4 hours)
   - Zustand store for user state
   - Migrate 3 key pages to use store

4. **Add .env.example** (30 minutes)
   - Document all required env vars

5. **Consolidate duplicate hooks** (1 hour)
   - Remove duplicates, update imports

**Deliverables:**
- ✅ Routes protected server-side
- ✅ Error boundaries in place
- ✅ Auth state centralized
- ✅ Env vars documented

---

### Phase 2: Production Readiness (1-2 weeks)

**Goal:** Improve quality, performance, and developer experience

**Week 1:**
1. **Add input validation** (1 day)
   - Zod schemas for forms
   - Update 5 key forms

2. **Add loading skeletons** (1 day)
   - Skeleton components
   - Update 5 key pages

3. **Add error boundaries** (1 day)
   - Error boundary component
   - Add to route groups

4. **Add request debouncing** (4 hours)
   - useDebounce hook
   - Update search pages

**Week 2:**
5. **Add React Query** (2 days)
   - Setup React Query
   - Migrate 3 key pages (dashboard, course list, course detail)

6. **Add test setup** (2 days)
   - Jest + React Testing Library
   - 10-20 unit tests for services
   - 5-10 component tests

7. **Add documentation** (1 day)
   - Dev guide ("How to add a screen/service")
   - API docs (frontend service contracts)

**Deliverables:**
- ✅ Input validation in place
- ✅ Better UX (skeletons, debouncing)
- ✅ Server data caching (React Query)
- ✅ Test coverage (20-30 tests)
- ✅ Developer documentation

---

## F) Summary

**Current State:** Acceptable (2.3/5) - Functional but needs improvement

**Strengths:**
- ✅ Feature-based architecture
- ✅ Centralized API client
- ✅ Token refresh working
- ✅ Types and mocks separated

**Critical Gaps:**
- ❌ No server-side route protection
- ❌ No error boundaries
- ❌ No auth store (scattered state)
- ❌ No testing infrastructure
- ❌ No request caching

**Next Steps:**
1. Implement Phase 1 (1-2 days) for production readiness
2. Implement Phase 2 (1-2 weeks) for quality improvements
3. Monitor and iterate based on production feedback

---

**Report Generated:** 2025-01-27  
**Auditor:** Senior Frontend Architect  
**Framework:** Next.js 15.5.9 App Router

