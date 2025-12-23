# Frontend Architecture Overview

## Tech Stack

- **Framework:** Next.js 15.5.9 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **State Management:** Zustand
- **HTTP Client:** Axios
- **Testing:** Vitest + React Testing Library

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (public)/          # Public routes (no auth required)
│   ├── [username]/        # Dynamic user routes
│   ├── admin/             # Admin routes
│   ├── instructor/        # Instructor routes
│   └── learner/           # Learner routes
├── components/
│   ├── ui/                # UI primitives (Button, Toast, Skeleton, etc.)
│   └── shared/             # Shared composite components
├── core/
│   └── components/         # Domain-specific components (admin, instructor, learner, public)
├── features/               # Feature modules
│   ├── auth/
│   ├── courses/
│   ├── instructor/
│   ├── learner/
│   └── ...
├── services/
│   ├── core/              # Core API client, token management, errors
│   └── auth.ts            # Auth service entrypoint
├── store/                 # Zustand stores (auth, assistant, toast)
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities (logger, validation, toast)
└── config/                # Configuration (env, runtime)
```

## Key Patterns

### 1. Feature-Based Architecture

Each feature module contains:
- `services/` - API service layer
- `types/` - TypeScript types
- `mocks/` - Mock data (for development)
- `components/` - Feature-specific components (optional)
- `hooks/` - Feature-specific hooks (optional)

### 2. Service Layer

All API calls go through:
1. **Core API Client** (`services/core/api.ts`) - Axios instance with interceptors
2. **Domain Services** (`features/*/services/*.ts`) - Feature-specific API calls
3. **Response Unwrapping** (`services/core/unwrap.ts`) - Normalize API responses

### 3. State Management

- **Global State:** Zustand stores (`store/*.store.ts`)
  - `auth.store.ts` - Authentication state
  - `assistant.store.ts` - Assistant popup state
  - `toast.store.ts` - Toast notifications (via `lib/toast.ts`)
- **Server State:** Manual `useState`/`useEffect` (consider React Query for future)

### 4. Authentication Flow

1. User logs in → `auth.service.ts` stores tokens
2. Tokens mirrored to cookies for middleware
3. `auth.store.ts` manages auth state
4. `useAuth()` hook provides auth state to components
5. `middleware.ts` protects routes server-side

### 5. Error Handling

- **API Errors:** `ApiError` class in `services/core/errors.ts`
- **Error Boundaries:** `app/error.tsx` and route-group error boundaries
- **Toast Notifications:** `lib/toast.ts` for user-friendly error messages
- **Logger:** `lib/logger.ts` for development logging

## Routing

- **Public Routes:** `app/(public)/*` - No authentication required
- **Protected Routes:** `app/learner/*`, `app/instructor/*`, `app/admin/*` - Require authentication
- **Dynamic Routes:** `app/[username]/*` - User-specific routes
- **Route Protection:** `middleware.ts` for server-side, `useAuth()` for client-side

## Environment Variables

See `.env.example` for required variables:
- `NEXT_PUBLIC_API_BASE_URL` - Must include `/api/v1`
- `NEXT_PUBLIC_USE_MOCK` - Toggle between mock and real API

## Testing

- **Unit Tests:** `src/**/__tests__/*.test.ts`
- **Component Tests:** `src/components/**/__tests__/*.test.tsx`
- **Run Tests:** `npm test`, `npm run test:watch`, `npm run test:ci`

## Development Modes

- **Mock Mode:** `NEXT_PUBLIC_USE_MOCK=true` - Uses mock data, no backend required
- **Real API Mode:** `NEXT_PUBLIC_USE_MOCK=false` - Connects to real backend

