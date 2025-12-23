# Code Conventions

## Folder Structure Rules

### Components

- **`components/ui/`** - UI primitives only (Button, Input, Toast, Skeleton, etc.)
- **`components/shared/`** - Shared composite components (SafeImage, etc.)
- **`core/components/`** - Domain-specific components organized by role (admin, instructor, learner, public)

**Rule:** UI primitives should be reusable and style-agnostic. Domain components can be feature-specific.

### Features

Each feature module should be self-contained:
```
features/auth/
├── services/
│   └── auth.service.ts
├── types/
│   └── auth.types.ts
├── hooks/
│   └── useAuth.ts
└── components/ (optional)
```

### Services

- **`services/core/`** - Core infrastructure (API client, token management, errors)
- **`services/auth.ts`** - Canonical entrypoint for auth (re-exports from features)
- **`features/*/services/`** - Domain-specific services

**Rule:** All services should use `apiClient` from `services/core/api.ts`. No direct axios calls.

## Naming Conventions

### Files

- **Components:** PascalCase (`Button.tsx`, `CourseCard.tsx`)
- **Services:** camelCase with `.service.ts` suffix (`auth.service.ts`)
- **Hooks:** camelCase with `use` prefix (`useAuth.ts`, `useDebounce.ts`)
- **Stores:** camelCase with `.store.ts` suffix (`auth.store.ts`)
- **Types:** camelCase with `.types.ts` suffix (`auth.types.ts`)
- **Tests:** Same as source with `.test.ts` or `.test.tsx` suffix

### Variables & Functions

- **Components:** PascalCase
- **Functions:** camelCase
- **Constants:** UPPER_SNAKE_CASE
- **Types/Interfaces:** PascalCase

## Import Order

1. React/Next.js imports
2. Third-party libraries
3. Internal imports (using `@/` aliases)
4. Types
5. Styles

Example:
```typescript
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { CourseSummary } from "@/features/courses/types/catalog.types";
```

## Path Aliases

Use path aliases defined in `tsconfig.json`:
- `@/*` - `src/*`
- `@/components/*` - `src/components/*`
- `@/features/*` - `src/features/*`
- `@/services/*` - `src/services/*`
- `@/store/*` - `src/store/*`
- `@/lib/*` - `src/lib/*`
- `@/hooks/*` - `src/hooks/*`
- `@/config/*` - `src/config/*`

## Type Safety

- Always use TypeScript types
- Separate types from mocks (`types/` vs `mocks/`)
- Use `ApiResponse<T>` and `PageResponse<T>` for API responses
- Use `unwrapApiResponse()` and `unwrapPage()` to normalize responses

## Error Handling

- Use `ApiError` class for API errors
- Use `logger` utility for logging
- Use `useToastStore` for user-facing error messages
- Always handle errors in try/catch blocks

## State Management

- **Global State:** Use Zustand stores (`store/*.store.ts`)
- **Server State:** Use `useState`/`useEffect` (consider React Query for future)
- **Form State:** Use `useState` or form libraries
- **Derived State:** Use `useMemo` for expensive computations

## Testing

- Unit tests for services and utilities
- Component tests for UI components
- Use Vitest + React Testing Library
- Tests should be in `__tests__/` folders next to source files

