# API Integration Guide

## Service Layer Architecture

```
Component → Service → Core API Client → Backend
```

## Adding a New Service

1. **Create service file:** `src/features/{feature}/services/{feature}.service.ts`

2. **Import core API client:**
```typescript
import { apiClient, type ApiResponse, type PageResponse } from "@/services/core/api";
import { unwrapApiResponse, unwrapPage } from "@/services/core/unwrap";
```

3. **Define types:** `src/features/{feature}/types/{feature}.types.ts`

4. **Implement service functions:**
```typescript
export async function getItems(): Promise<Item[]> {
  const response = await apiClient.get<ApiResponse<Item[]>>("/items");
  return unwrapApiResponse(response.data);
}

export async function getItemsPaginated(page: number, size: number): Promise<PageResponse<Item>> {
  const response = await apiClient.get<ApiResponse<PageResponse<Item>>>("/items", {
    params: { page, size },
  });
  return unwrapPage(response.data);
}
```

5. **Add mock toggle (optional):**
```typescript
import { USE_MOCK } from "@/config/runtime";
import { MOCK_ITEMS } from "../mocks/items.mocks";

export async function getItems(): Promise<Item[]> {
  if (USE_MOCK) {
    return Promise.resolve(MOCK_ITEMS);
  }
  // ... real API call
}
```

## Endpoint Mapping

| Feature | Endpoint Pattern | Service File |
|---------|-----------------|--------------|
| Auth | `/auth/*` | `features/auth/services/auth.service.ts` |
| Courses | `/courses/*` | `features/courses/services/courses.service.ts` |
| Categories | `/categories/*` | `features/courses/services/courses.service.ts` |
| Instructor | `/teachers/*` | `features/instructor/services/instructor.service.ts` |
| Learner | `/students/*` | `features/learner/services/learner.service.ts` |
| Profile | `/accounts/*` | `features/profile/services/profile.service.ts` |
| Cart | Local (Zustand) | `features/cart/services/cart.service.ts` |
| Payment | Mock (backend not ready) | `features/payment/services/payment.service.ts` |
| Community | `/courses/*/comments`, `/notifications/*` | `features/community/services/community.service.ts` |
| Recommendations | `/students/*/recommendations` | `features/recommendation/services/recommendation.service.ts` |

## Response Handling

### Standard API Response

Backend returns:
```json
{
  "success": true,
  "status": 200,
  "message": "OK",
  "data": { ... }
}
```

Use `unwrapApiResponse()`:
```typescript
const response = await apiClient.get<ApiResponse<User>>("/users/me");
const user = unwrapApiResponse(response.data); // Returns User directly
```

### Paginated Response

Backend returns:
```json
{
  "success": true,
  "status": 200,
  "message": "OK",
  "data": {
    "items": [...],
    "page": 0,
    "size": 10,
    "totalItems": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

Use `unwrapPage()`:
```typescript
const response = await apiClient.get<ApiResponse<PageResponse<Course>>>("/courses");
const page = unwrapPage(response.data); // Returns PageResponse<Course>
const courses = page.items;
```

## Error Handling

API errors are automatically converted to `ApiError`:
```typescript
try {
  const user = await getUser();
} catch (error) {
  if (error instanceof ApiError) {
    // error.status, error.message, error.traceId
    useToastStore.getState().error(error.message);
  }
}
```

## Authentication

Tokens are automatically injected via request interceptor. No need to manually add headers.

## Base URL

Configured in `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

**Important:** Base URL must include `/api/v1`. Service paths should NOT include `/api/v1`.

Example:
- Base URL: `http://localhost:8080/api/v1`
- Service path: `/auth/login`
- Final URL: `http://localhost:8080/api/v1/auth/login`

