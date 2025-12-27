# 🔄 Quick Start Migration Guide

## Step-by-Step: Migrate Existing Teacher Pages

### Option 1: Migrate Page with Heavy Client Interactivity

**Use when page needs:**

- Real-time search/filtering
- Complex client state
- Mutations with optimistic updates
- Form handling

**Example: Students Page**

#### Before (All Client):

```tsx
// app/teacher/students/page.tsx
"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["students", search],
    queryFn: () => studentService.getAll(search),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Students</h1>
      <input value={search} onChange={(e) => setSearch(e.target.value)} />
      <StudentList students={data} />
    </div>
  );
}
```

#### After (Hybrid):

```tsx
// app/teacher/students/page.tsx (Server Component)
import { Suspense } from "react";
import { TableSkeleton } from "@/core/components/teacher/skeletons";
import { StudentsListClient } from "@/core/components/teacher/students/StudentsListClient";

export default function StudentsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Static header - renders immediately */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Students
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage and view all enrolled students
          </p>
        </div>

        {/* Dynamic content - shows skeleton while loading */}
        <Suspense fallback={<TableSkeleton rows={10} />}>
          <StudentsListClient />
        </Suspense>
      </div>
    </div>
  );
}

// app/teacher/students/loading.tsx
import { TableSkeleton } from "@/core/components/teacher/skeletons";

export default function StudentsLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-48"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-96"></div>
        </div>
        <TableSkeleton rows={10} />
      </div>
    </div>
  );
}

// core/components/teacher/students/StudentsListClient.tsx
("use client");
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export function StudentsListClient() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useQuery({
    queryKey: ["students", search],
    queryFn: () => studentService.getAll(search),
    staleTime: 30000, // Cache 30s
  });

  if (isLoading) return <TableSkeleton rows={10} />;

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students..."
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      {/* Student List */}
      <StudentList students={data} />
    </div>
  );
}
```

**Benefits:**

- ✅ Header visible immediately
- ✅ Skeleton while data loads
- ✅ Layout persists (no re-render)
- ✅ React Query caching works

---

### Option 2: Migrate Page with Server Data Fetching

**Use when page has:**

- Heavy data requirements
- No real-time filtering
- Mostly read-only data
- SEO importance

**Example: Question Banks Page**

#### Before (All Client):

```tsx
// app/teacher/question-banks/page.tsx
"use client";
import { useQuery } from "@tanstack/react-query";

export default function QuestionBanksPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["question-banks"],
    queryFn: () => questionBankService.getAll(),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Question Banks</h1>
      <QuestionBankList banks={data} />
    </div>
  );
}
```

#### After (Server + Suspense):

```tsx
// app/teacher/question-banks/page.tsx (Server Component)
import { Suspense } from "react";
import { QuestionBanksSection } from "@/core/components/teacher/question-banks/async-sections";
import { CardGridSkeleton } from "@/core/components/teacher/skeletons";

export default async function QuestionBanksPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header - static */}
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Question Banks
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Manage your question collections
          </p>
        </div>

        {/* Data section - server fetched */}
        <Suspense fallback={<CardGridSkeleton count={6} />}>
          <QuestionBanksSection />
        </Suspense>
      </div>
    </div>
  );
}

// core/components/teacher/question-banks/async-sections.tsx
import { questionBankService } from "@/services/...";
import { QuestionBankList } from "./QuestionBankList";

async function getQuestionBanks() {
  // Server-side fetch
  const data = await questionBankService.getAll();
  return data;
}

export async function QuestionBanksSection() {
  const banks = await getQuestionBanks();

  // Pass data to Client Component for rendering
  return <QuestionBankList banks={banks} />;
}

// core/components/teacher/question-banks/QuestionBankList.tsx
("use client"); // Only for interactivity (modals, buttons)

export function QuestionBankList({ banks }) {
  const handleEdit = (id) => {
    // ... client-side logic
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {banks.map((bank) => (
        <QuestionBankCard key={bank.id} bank={bank} onEdit={handleEdit} />
      ))}
    </div>
  );
}
```

**Benefits:**

- ✅ Server fetches data (faster, no client wait)
- ✅ SEO-friendly (data in initial HTML)
- ✅ Smaller JavaScript bundle
- ✅ Progressive rendering

---

### Option 3: Complex Page with Mixed Patterns

**Example: Course Details Page**

```tsx
// app/teacher/courses/[slug]/page.tsx
import { Suspense } from "react";
import { CourseHeader } from "@/core/components/teacher/course-details/CourseHeader";
import {
  CourseStatsSection,
  CourseContentSection,
  CourseStudentsSection,
} from "@/core/components/teacher/course-details/async-sections";
import { CourseActionBar } from "@/core/components/teacher/course-details/CourseActionBar";
import {
  StatCardSkeleton,
  TableSkeleton,
} from "@/core/components/teacher/skeletons";

export default async function CourseDetailsPage({ params }) {
  const { slug } = params;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with basic info - could be server-fetched */}
        <Suspense
          fallback={
            <div className="h-32 bg-white dark:bg-slate-900 rounded-xl animate-pulse" />
          }
        >
          <CourseHeader slug={slug} />
        </Suspense>

        {/* Action buttons - client component for mutations */}
        <CourseActionBar slug={slug} />

        {/* Stats - server fetched */}
        <Suspense
          fallback={
            <div className="grid gap-4 md:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <StatCardSkeleton key={i} />
              ))}
            </div>
          }
        >
          <CourseStatsSection slug={slug} />
        </Suspense>

        {/* Content - server fetched */}
        <Suspense
          fallback={
            <div className="h-96 bg-white dark:bg-slate-900 rounded-xl animate-pulse" />
          }
        >
          <CourseContentSection slug={slug} />
        </Suspense>

        {/* Students - server fetched */}
        <Suspense fallback={<TableSkeleton rows={10} />}>
          <CourseStudentsSection slug={slug} />
        </Suspense>
      </div>
    </div>
  );
}

// async-sections.tsx
import { courseService } from "@/services/...";

export async function CourseHeader({ slug }) {
  const course = await courseService.getBySlug(slug);
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-6">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <p>{course.description}</p>
    </div>
  );
}

export async function CourseStatsSection({ slug }) {
  const stats = await courseService.getStats(slug);
  return <StatsRow stats={stats} />;
}

export async function CourseStudentsSection({ slug }) {
  const students = await courseService.getStudents(slug);
  return <StudentsTable students={students} />;
}

// CourseActionBar.tsx
("use client");
import { useRouter } from "next/navigation";

export function CourseActionBar({ slug }) {
  const router = useRouter();

  const handlePublish = async () => {
    await courseService.publish(slug);
    router.refresh(); // Revalidate server data
  };

  return (
    <div className="flex gap-4">
      <button onClick={handlePublish}>Publish</button>
      <button onClick={() => router.push(`/teacher/courses/${slug}/edit`)}>
        Edit
      </button>
    </div>
  );
}
```

**Benefits:**

- ✅ Multiple Suspense boundaries (parallel loading)
- ✅ Each section streams independently
- ✅ Header shows first, then stats, then content, then students
- ✅ Client actions trigger server refetch

---

## 🎯 Decision Matrix

| Scenario                 | Pattern                         | Reason                 |
| ------------------------ | ------------------------------- | ---------------------- |
| Heavy filtering/search   | Client + React Query            | Fast UX, caching       |
| Read-only dashboard      | Server + Suspense               | SEO, smaller bundle    |
| Form with validation     | Client Component                | Interactive validation |
| Data tables with sorting | Server initial + Client sorting | Best of both           |
| Real-time updates        | Client + React Query            | Polling/refetch        |
| Public-facing pages      | Server Components               | SEO critical           |
| Admin mutations          | Client actions                  | Optimistic updates     |

---

## 🔥 Quick Wins

### 1. Add loading.tsx to Every Route

**5 minutes per route**

```tsx
// Copy template:
import { DashboardSkeleton } from "@/core/components/teacher/skeletons";

export default function Loading() {
  return <DashboardSkeleton />;
}
```

### 2. Wrap Heavy Sections in Suspense

**10 minutes per section**

```tsx
// Before:
<HeavyDataTable data={data} />

// After:
<Suspense fallback={<TableSkeleton />}>
  <HeavyDataTable data={data} />
</Suspense>
```

### 3. Move Data Fetching to Server

**15 minutes per page**

```tsx
// Before:
"use client";
const { data } = useQuery(...);

// After:
// page.tsx (Server)
const data = await fetch(...);
return <ClientComponent data={data} />;
```

---

## 🧪 Testing Checklist

After migrating a page:

- [ ] Navigate to page - shows loading state?
- [ ] Navigate away and back - instant?
- [ ] Refresh page - still works?
- [ ] Dark mode toggle - no flicker?
- [ ] Sidebar collapse - persists on navigation?
- [ ] Mobile - sidebar works?
- [ ] Slow 3G - progressive loading?
- [ ] Error state - shows error boundary?
- [ ] TypeScript - no errors?
- [ ] Console - no warnings?

---

## 🚨 Common Pitfalls

### 1. Mixing Server/Client Incorrectly

❌ **Wrong:**

```tsx
// Server Component
export default async function Page() {
  const [state, setState] = useState(); // ❌ Can't use hooks!
  return <div>...</div>;
}
```

✅ **Right:**

```tsx
// Server Component
export default async function Page() {
  return <ClientWrapper />; // ✅ Delegate to client
}

// Client Component
("use client");
export function ClientWrapper() {
  const [state, setState] = useState();
  return <div>...</div>;
}
```

### 2. Forgetting "use client" Directive

❌ **Wrong:**

```tsx
// Missing "use client"
import { useState } from "react";

export function Component() {
  const [state, setState] = useState(); // ❌ Error!
  return <div>...</div>;
}
```

✅ **Right:**

```tsx
"use client"; // ✅ Add at top

import { useState } from "react";

export function Component() {
  const [state, setState] = useState();
  return <div>...</div>;
}
```

### 3. Not Using Suspense Boundaries

❌ **Wrong:**

```tsx
export default async function Page() {
  const data = await fetch(...); // ❌ Blocks entire page
  return <div>{data}</div>;
}
```

✅ **Right:**

```tsx
export default function Page() {
  return (
    <div>
      <Header /> {/* Shows immediately */}
      <Suspense fallback={<Skeleton />}>
        <DataSection /> {/* Streams in */}
      </Suspense>
    </div>
  );
}
```

### 4. Passing Non-Serializable Props

❌ **Wrong:**

```tsx
// Server Component
export default async function Page() {
  const handleClick = () => {}; // ❌ Function not serializable
  return <ClientComponent onClick={handleClick} />;
}
```

✅ **Right:**

```tsx
// Server Component
export default async function Page() {
  const data = await fetch(...); // ✅ Serializable data only
  return <ClientComponent data={data} />;
}

// Client Component
"use client";
export function ClientComponent({ data }) {
  const handleClick = () => {}; // ✅ Define in client
  return <button onClick={handleClick}>{data}</button>;
}
```

---

## 📚 Templates

### Page Template (Hybrid)

```tsx
// app/teacher/[route]/page.tsx
import { Suspense } from "react";
import { PageSkeleton } from "@/core/components/teacher/skeletons";
import { PageClient } from "@/core/components/teacher/[route]/PageClient";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Page Title
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Description</p>
        </div>

        <Suspense fallback={<PageSkeleton />}>
          <PageClient />
        </Suspense>
      </div>
    </div>
  );
}
```

### Loading Template

```tsx
// app/teacher/[route]/loading.tsx
import { PageSkeleton } from "@/core/components/teacher/skeletons";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-lg w-48"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-96"></div>
        </div>
        <PageSkeleton />
      </div>
    </div>
  );
}
```

### Client Component Template

```tsx
// core/components/teacher/[route]/PageClient.tsx
"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

export function PageClient() {
  const [filter, setFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["data", filter],
    queryFn: () => service.getData(filter),
    staleTime: 30000,
  });

  if (isLoading) return <div>Loading...</div>;

  return <div>{/* Your content */}</div>;
}
```

---

**Ready to migrate? Start with one page, test thoroughly, then scale!** 🚀
