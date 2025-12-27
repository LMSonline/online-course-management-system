# ⚡ Quick Reference Card

## 🎯 Core Patterns (Copy-Paste Ready)

### Pattern 1: Server Page with Suspense

```tsx
// app/teacher/[route]/page.tsx
import { Suspense } from "react";
import { AsyncDataSection } from "@/components/...";
import { Skeleton } from "@/components/skeletons";

export default async function Page() {
  return (
    <div className="p-6">
      <h1>Static Header</h1>

      <Suspense fallback={<Skeleton />}>
        <AsyncDataSection />
      </Suspense>
    </div>
  );
}
```

### Pattern 2: Client Page with React Query

```tsx
// app/teacher/[route]/page.tsx
import { Suspense } from "react";
import { PageClient } from "@/components/...";
import { Skeleton } from "@/components/skeletons";

export default function Page() {
  return (
    <div className="p-6">
      <h1>Static Header</h1>

      <Suspense fallback={<Skeleton />}>
        <PageClient />
      </Suspense>
    </div>
  );
}

// components/PageClient.tsx
("use client");
import { useQuery } from "@tanstack/react-query";

export function PageClient() {
  const { data, isLoading } = useQuery({
    queryKey: ["key"],
    queryFn: () => service.fetch(),
    staleTime: 30000,
  });

  if (isLoading) return <Skeleton />;
  return <div>{/* Your UI */}</div>;
}
```

### Pattern 3: Loading State

```tsx
// app/teacher/[route]/loading.tsx
import { Skeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="p-6 animate-pulse">
      <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded w-48 mb-6" />
      <Skeleton />
    </div>
  );
}
```

---

## 🔑 Key Rules

### ✅ DO

- ✅ Use Server Components by default
- ✅ Add "use client" only when needed (hooks, events)
- ✅ Wrap async sections in Suspense
- ✅ Create loading.tsx for every route
- ✅ Pass serializable data only (JSON, strings, numbers)
- ✅ Keep layout as Server Component
- ✅ Use Context for persistent state

### ❌ DON'T

- ❌ Add "use client" to layout.tsx
- ❌ Pass functions as props from Server to Client
- ❌ Forget Suspense around async components
- ❌ Block page render with single fetch
- ❌ Put state in layout component
- ❌ Use hooks in Server Components

---

## 📝 Checklists

### New Page Checklist

- [ ] Determine if Server or Client heavy
- [ ] Create page.tsx (Server shell)
- [ ] Create loading.tsx
- [ ] Add Suspense boundaries
- [ ] Create async sections OR client component
- [ ] Test navigation (layout persists?)
- [ ] Test loading state (shows immediately?)

### Component Checklist

- [ ] Need hooks/events? → Add "use client"
- [ ] Fetching data? → Server Component OR useQuery
- [ ] Passing to parent? → Only serializable data
- [ ] Heavy computation? → Server Component
- [ ] Interactive UI? → Client Component

### Performance Checklist

- [ ] Layout doesn't re-render on navigation
- [ ] Loading states show instantly
- [ ] No blank screens
- [ ] Skeletons match content layout
- [ ] No layout shift
- [ ] Console has no errors

---

## 🎨 Skeleton Quick Pick

```tsx
// Stats Cards
<div className="grid gap-4 md:grid-cols-4">
  {[...Array(4)].map((_, i) => (
    <StatCardSkeleton key={i} />
  ))}
</div>

// Charts
<div className="grid gap-4 lg:grid-cols-2">
  <ChartSkeleton />
  <ChartSkeleton />
</div>

// Table
<TableSkeleton rows={10} />

// Card Grid
<CardGridSkeleton count={6} />

// Custom
<div className="animate-pulse">
  <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-48" />
</div>
```

---

## 🐛 Quick Fixes

### "Cannot find module"

```bash
rm -rf .next
rm -rf node_modules/.cache
# Restart TS server in VS Code
```

### Layout re-renders

```tsx
// ❌ Wrong
"use client";
export default function Layout() {
  const [state, setState] = useState();
  return <div>...</div>;
}

// ✅ Right
export default function Layout() {
  return (
    <Provider>
      <Content>{children}</Content>
    </Provider>
  );
}
```

### Data not loading

```tsx
// ✅ Async Server Component
export async function Section() {
  const data = await fetch(...);
  return <UI data={data} />;
}

// ✅ Client Component
"use client";
export function Section() {
  const { data } = useQuery(...);
  return <UI data={data} />;
}
```

### Skeleton doesn't match

- Copy actual component structure
- Replace content with skeleton divs
- Keep same spacing/layout
- Add `animate-pulse`

---

## 💡 Decision Tree

```
Need to add functionality?
  ├─ Static content → Server Component
  ├─ Data fetching → Server Component + Suspense
  ├─ User interaction → Client Component
  ├─ Forms → Client Component
  ├─ Real-time updates → Client Component + React Query
  └─ Mixed → Server shell + Client islands
```

---

## 🎯 Common Scenarios

### Scenario: List page with filters

**Solution:** Pattern 2 (Client + React Query)

```tsx
// Server shell
export default function Page() {
  return (
    <>
      <Header />
      <Suspense>
        <ListClient />
      </Suspense>
    </>
  );
}
```

### Scenario: Dashboard with stats

**Solution:** Pattern 1 (Server + Suspense)

```tsx
export default function Page() {
  return (
    <>
      <Header />
      <Suspense>
        <StatsSection />
      </Suspense>
      <Suspense>
        <ChartsSection />
      </Suspense>
    </>
  );
}
```

### Scenario: Detail page

**Solution:** Pattern 3 (Hybrid)

```tsx
export default function Page({ params }) {
  return (
    <>
      <Suspense>
        <Header id={params.id} />
      </Suspense>
      <ActionBar id={params.id} /> {/* Client */}
      <Suspense>
        <Content id={params.id} />
      </Suspense>
    </>
  );
}
```

---

## 📊 Performance Targets

| Metric           | Before    | After  | Target |
| ---------------- | --------- | ------ | ------ |
| Layout persist   | ❌ No     | ✅ Yes | ✅ Yes |
| Time to skeleton | ~500ms    | <50ms  | <100ms |
| Time to content  | ~1000ms   | ~200ms | <300ms |
| Bundle size      | 300KB     | 90KB   | <150KB |
| Re-renders       | Every nav | Never  | Never  |

---

## 🎓 Learning Resources

### Understanding Server Components

- Server = No JS bundle
- Client = Interactive
- Mix both for best results

### Understanding Suspense

- Shows fallback immediately
- Resolves when data ready
- Prevents blocking
- Enables streaming

### Understanding Persistent Layouts

- State above layout
- Context provides state
- Layout consumes context
- Children can be Server/Client

---

## 🚀 Migration Priority

1. **High Impact, Low Effort** (Do First)

   - Add loading.tsx to all routes
   - Remove "use client" from layout
   - Add layout provider

2. **High Impact, Medium Effort** (Do Second)

   - Refactor dashboard pages
   - Split Server/Client sections
   - Add Suspense boundaries

3. **Medium Impact, High Effort** (Do Later)
   - Migrate complex forms
   - Add Server Actions
   - Optimize bundles

---

## ✅ Success Indicators

### Visual

- ✅ Sidebar doesn't flash on navigation
- ✅ Content area shows skeleton immediately
- ✅ No blank white screen
- ✅ Smooth transitions

### Technical

- ✅ Layout component has no "use client"
- ✅ Console has no errors
- ✅ TypeScript compiles
- ✅ Bundle size reduced

### UX

- ✅ Navigation feels instant
- ✅ Loading states consistent
- ✅ No perceived lag
- ✅ Professional polish

---

## 📞 Need Help?

1. Check `TEACHER_ARCHITECTURE_REFACTOR.md` - Full explanation
2. Check `MIGRATION_GUIDE.md` - Step-by-step examples
3. Check `ARCHITECTURE_DIAGRAMS.md` - Visual guides
4. Check code comments in new files
5. Look at dashboard/page.tsx example

---

**Keep this card handy while refactoring!** 📌
