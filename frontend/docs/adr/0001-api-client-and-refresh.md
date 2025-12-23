# ADR 0001: API Client and Token Refresh Strategy

## Status

Accepted

## Context

We need a centralized API client that:
- Handles authentication automatically
- Refreshes tokens on 401 errors
- Normalizes API responses
- Provides consistent error handling

## Decision

Use **Axios** as the HTTP client with:
- Single axios instance (`apiClient`) in `services/core/api.ts`
- Request interceptor to inject `Authorization` header
- Response interceptor to handle 401 and refresh tokens
- Single-flight lock for token refresh (prevents multiple simultaneous refresh requests)
- Standardized error classes (`ApiResponse`, `ApiError`, `NetworkError`)

## Implementation

- **API Client:** `src/services/core/api.ts`
- **Token Refresh:** `src/services/core/auth-refresh.ts`
- **Token Management:** `src/services/core/token.ts`
- **Error Classes:** `src/services/core/errors.ts`
- **Response Unwrapping:** `src/services/core/unwrap.ts`

## Consequences

### Positive

- ✅ Consistent API calls across the app
- ✅ Automatic token refresh prevents user disruption
- ✅ Single-flight lock prevents refresh storms
- ✅ Standardized error handling

### Negative

- ⚠️ Cookie mirroring for middleware (not ideal, but works)
- ⚠️ No request caching (consider React Query for future)

## Alternatives Considered

1. **Fetch API** - Rejected: Less feature-rich, more boilerplate
2. **React Query** - Considered for future: Would add caching, but adds complexity
3. **httpOnly Cookies** - Preferred for security, but requires backend changes

