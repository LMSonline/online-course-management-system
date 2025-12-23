# Testing Guide

## Setup

Tests use **Vitest** + **React Testing Library**.

**Configuration:** `vitest.config.ts`  
**Setup:** `src/test/setup.ts`

## Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# CI mode (with coverage)
npm run test:ci
```

## Writing Tests

### Unit Tests

Test utilities and services:

```typescript
// src/services/core/__tests__/unwrap.test.ts
import { describe, it, expect } from "vitest";
import { unwrapApiResponse } from "../unwrap";

describe("unwrapApiResponse", () => {
  it("should unwrap ApiResponse structure", () => {
    const response = {
      success: true,
      status: 200,
      message: "OK",
      data: { name: "Test" },
    };
    const result = unwrapApiResponse(response);
    expect(result).toEqual({ name: "Test" });
  });
});
```

### Component Tests

Test UI components:

```typescript
// src/components/shared/__tests__/SafeImage.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SafeImage } from "../SafeImage";

describe("SafeImage", () => {
  it("should render image with provided src", () => {
    render(<SafeImage src="/test.jpg" alt="Test" width={100} height={100} />);
    const img = screen.getByAltText("Test");
    expect(img).toHaveAttribute("src", "/test.jpg");
  });
});
```

## Test Structure

- **Location:** `src/**/__tests__/*.test.ts` or `*.test.tsx`
- **Naming:** Same as source file with `.test` suffix
- **Organization:** Co-locate tests with source files

## Mocking

### Mock API Calls

```typescript
import { vi } from "vitest";
import { apiClient } from "../api";

vi.mock("../api");

describe("MyService", () => {
  it("should fetch data", async () => {
    vi.mocked(apiClient.get).mockResolvedValue({
      data: { success: true, data: { id: 1 } },
    });
    // ... test
  });
});
```

### Mock Next.js

```typescript
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));
```

## Best Practices

1. **Test behavior, not implementation** - Test what users see/do
2. **Use descriptive test names** - "should do X when Y"
3. **Keep tests isolated** - Each test should be independent
4. **Mock external dependencies** - Don't make real API calls in tests
5. **Test edge cases** - Empty states, error states, loading states

## Coverage Goals

- **Services:** 80%+ coverage
- **Utilities:** 90%+ coverage
- **Components:** 60%+ coverage (focus on critical paths)

