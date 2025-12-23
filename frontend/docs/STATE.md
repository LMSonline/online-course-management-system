# State Management Guide

## When to Use What

### Zustand Stores (Global State)

Use for:
- ✅ Authentication state (`auth.store.ts`)
- ✅ UI state that needs to be shared across routes (`assistant.store.ts`, `toast.store.ts`)
- ✅ User preferences/settings
- ✅ Global loading/error states

**Location:** `src/store/*.store.ts`

**Example:**
```typescript
import { create } from "zustand";

interface MyStore {
  value: string;
  setValue: (value: string) => void;
}

export const useMyStore = create<MyStore>((set) => ({
  value: "",
  setValue: (value) => set({ value }),
}));
```

### Component State (useState)

Use for:
- ✅ Form inputs
- ✅ Local UI state (modals, dropdowns, etc.)
- ✅ Component-specific loading/error states
- ✅ Temporary calculations

**Example:**
```typescript
const [search, setSearch] = useState("");
const [isOpen, setIsOpen] = useState(false);
```

### Server State (useState + useEffect)

Currently using manual `useState`/`useEffect` for server data.

**Example:**
```typescript
const [courses, setCourses] = useState<Course[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function loadCourses() {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  }
  loadCourses();
}, []);
```

**Future:** Consider React Query for:
- Automatic caching
- Request deduplication
- Background refetching
- Optimistic updates

### Derived State (useMemo)

Use for:
- ✅ Expensive calculations
- ✅ Filtered/sorted lists
- ✅ Computed values from props/state

**Example:**
```typescript
const filteredCourses = useMemo(() => {
  return courses.filter(c => c.category === selectedCategory);
}, [courses, selectedCategory]);
```

## Current Stores

### `auth.store.ts`

Manages authentication state:
- `status`: "unknown" | "authenticated" | "guest"
- `user`: Current user object
- `loading`: Loading state
- `error`: Error message

**Usage:**
```typescript
import { useAuth } from "@/features/auth/hooks/useAuth";

const { user, role, isAuthenticated, loading } = useAuth();
```

### `assistant.store.ts`

Manages assistant popup state:
- `open`: Boolean
- `openPopup()`: Open popup
- `closePopup()`: Close popup

### `toast.store.ts` (via `lib/toast.ts`)

Manages toast notifications:
- `show(type, message, duration)`: Show toast
- `success(message)`: Show success toast
- `error(message)`: Show error toast
- `info(message)`: Show info toast
- `warning(message)`: Show warning toast

**Usage:**
```typescript
import { useToastStore } from "@/lib/toast";

useToastStore.getState().success("Operation successful!");
useToastStore.getState().error("Something went wrong");
```

## Best Practices

1. **Keep stores focused** - One store per domain (auth, UI, etc.)
2. **Avoid prop drilling** - Use stores for deeply nested state
3. **Server state** - Consider React Query for complex server state
4. **Local state** - Use `useState` for component-specific state
5. **Derived state** - Use `useMemo` for expensive computations

