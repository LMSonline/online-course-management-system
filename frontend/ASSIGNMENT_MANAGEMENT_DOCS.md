# Teacher Assignment Management System - Documentation

## Overview

This is a comprehensive Teacher Assignment Management UI with **strict type binding** to backend APIs. All components follow TypeScript best practices and maintain perfect alignment with the backend data models.

## Architecture

### 1. Type System (`assignment.types.ts`)

All TypeScript interfaces strictly map to backend DTOs:

```typescript
// Core Types
- AssignmentType: "PRACTICE" | "HOMEWORK" | "PROJECT" | "FINAL_REPORT"
- SubmissionStatus: "PENDING" | "GRADED" | "REJECTED"

// Request/Response Types
- AssignmentRequest: For creating/updating assignments
- AssignmentResponse: Assignment details from backend
- SubmissionResponse: Submission details with student info
- GradeSubmissionRequest: For grading submissions
```

### 2. Validation Layer (`assignment.validation.ts`)

Zod schemas ensure type safety at runtime:

```typescript
- assignmentRequestSchema: Backend API validation
- assignmentFormSchema: Form input validation with coercion
- gradeSubmissionSchema: Grading form validation

// Helper Functions
- assignmentFormToRequest(): Converts form values to API request
- assignmentResponseToForm(): Converts API response to form values
```

### 3. Data Layer (`useTeacherAssignment.ts`)

React Query hooks for all API operations:

**Assignment Management:**

- `useAllIndependentAssignments()`: Get assignment library
- `useAssignmentById(id)`: Get single assignment
- `useCreateIndependentAssignment()`: Create new assignment
- `useUpdateAssignment()`: Update assignment
- `useDeleteAssignment()`: Delete assignment
- `useCloneAssignment()`: Clone assignment to another lesson

**Submission Management:**

- `useAssignmentSubmissions(assignmentId)`: Get all submissions
- `useSubmissionById(submissionId)`: Get single submission
- `useGradeSubmission()`: Grade a submission
- `useRejectSubmission()`: Reject a submission
- `useBulkGradeSubmissions()`: Grade multiple submissions

**Statistics:**

- `useAssignmentStatistics(assignmentId)`: Get submission stats
- `usePassingRate(assignmentId)`: Get passing rate
- `usePendingSubmissions(assignmentId)`: Get pending submissions

## Components

### 1. AssignmentFormModal

**Purpose:** Create or edit assignments with full validation

**Props:**

```typescript
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: AssignmentRequest) => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
  initialData?: AssignmentResponse;
}
```

**Features:**

- ✅ React Hook Form with Zod validation
- ✅ All fields map to `AssignmentRequest` interface
- ✅ Assignment type dropdown with enum values
- ✅ Date picker with time selection (ISO 8601 conversion)
- ✅ Numeric field validation with coercion
- ✅ Auto-populate form in edit mode

**Usage:**

```tsx
import { AssignmentFormModal } from "@/core/components/teacher/assignment";
import { useCreateIndependentAssignment } from "@/hooks/teacher/useTeacherAssignment";

const createMutation = useCreateIndependentAssignment();

<AssignmentFormModal
  open={showModal}
  onOpenChange={setShowModal}
  onSubmit={(data) => createMutation.mutate(data)}
  isLoading={createMutation.isPending}
  mode="create"
/>;
```

### 2. CreateAssignmentDialog

**Purpose:** Simplified dialog for quick assignment creation

**Updated Features:**

- ✅ Uses new validation schema
- ✅ Proper enum handling for AssignmentType
- ✅ Strict type binding
- ✅ ISO 8601 date format conversion

### 3. GradingModal

**Purpose:** Grade student submissions with file viewing

**Props:**

```typescript
{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: SubmissionResponse | null;
  assignment: AssignmentResponse | null;
  onGrade: (data: GradeSubmissionValues) => void;
  onReject: (feedback: string) => void;
  isLoading?: boolean;
  // Navigation
  hasNext?: boolean;
  hasPrevious?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
}
```

**Features:**

- ✅ Split view: Submission content + Grading form
- ✅ File download with proper URL handling
- ✅ Score validation against assignment max score
- ✅ Feedback text area
- ✅ Reject option with reason
- ✅ Navigation between submissions

### 4. AssignmentCard

**Purpose:** Display assignment in card format with actions

**Features:**

- ✅ Badge with proper enum colors
- ✅ Due date formatting with overdue detection
- ✅ Dropdown menu: Edit, Clone, Delete
- ✅ Hover effects and animations

## Pages

### 1. Assignment Library (`/teacher/assignments`)

**Data Source:** `useAllIndependentAssignments()`

**Features:**

- Search by title/description
- Statistics cards (total assignments)
- Grid of assignment cards
- Create/Edit/Delete actions

### 2. Assignment Dashboard (`/teacher/assignments/[assignmentId]`)

**Data Sources:**

- `useAssignmentById(id)`
- `useAssignmentStatistics(id)`
- `usePassingRate(id)`

**Tabs:**

- **Overview:** Statistics, charts, recent submissions
- **Submissions:** Full list with grading interface
- **Settings:** Edit assignment details

### 3. Grading Interface (`/teacher/assignments/[assignmentId]/submissions/[submissionId]`)

**Features:**

- View submission files
- Grade with feedback
- Navigate between submissions
- Reject option

## Type Safety Guarantees

### ✅ Date Handling

```typescript
// Frontend Form: Date object
dueDate: Date | null;

// API Request: ISO 8601 string
dueDate: "2026-01-13T10:09:00Z" | null;

// Conversion handled by: assignmentFormToRequest()
```

### ✅ Enum Handling

```typescript
// Dropdown values strictly typed
<Select value={assignmentType}>
  <SelectItem value="PRACTICE">Practice</SelectItem>
  <SelectItem value="HOMEWORK">Homework</SelectItem>
  <SelectItem value="PROJECT">Project</SelectItem>
  <SelectItem value="FINAL_REPORT">Final Report</SelectItem>
</Select>;

// Backend receives exact enum value
assignmentType: "HOMEWORK"; // ✅ Type-safe
```

### ✅ Number Coercion

```typescript
// Form inputs are strings
totalPoints: string = "100"

// Zod transforms to number
.transform((val) => val === "" ? null : Number(val))

// API receives proper type
totalPoints: number | null = 100
```

## Best Practices

### 1. Always Use Hooks

```tsx
// ✅ Good
const createMutation = useCreateIndependentAssignment();
createMutation.mutate(payload);

// ❌ Bad
await assignmentService.createIndependentAssignment(payload);
```

### 2. Handle Loading States

```tsx
if (isLoading) return <Skeleton />;
if (error) return <ErrorView />;
return <Content data={data} />;
```

### 3. Validate Before Submit

```tsx
const form = useForm<AssignmentFormValues>({
  resolver: zodResolver(assignmentFormSchema), // ✅ Validation enforced
});
```

### 4. Type-Safe API Calls

```tsx
// All parameters are type-checked
const { data } = useAssignmentById(id); // id must be number
const mutation = useGradeSubmission();
mutation.mutate({
  id: submissionId,
  payload: { grade: 8.5, feedback: "Good work" },
});
```

## Common Patterns

### Creating an Assignment

```tsx
const createMutation = useCreateIndependentAssignment();

const handleSubmit = (formValues: AssignmentFormValues) => {
  const payload = assignmentFormToRequest(formValues);
  createMutation.mutate(payload, {
    onSuccess: (data) => {
      router.push(`/teacher/assignments/${data.id}`);
    },
  });
};
```

### Grading a Submission

```tsx
const gradeMutation = useGradeSubmission();

const handleGrade = (values: GradeSubmissionValues) => {
  gradeMutation.mutate({
    id: submission.id,
    payload: {
      grade: values.grade,
      feedback: values.feedback || null,
    },
  });
};
```

### Fetching with Auto-Refresh

```tsx
const { data: submissions, refetch } = useAssignmentSubmissions(assignmentId);

// Refetch after grading
onSuccess: () => {
  refetch();
  toast.success("Graded successfully");
};
```

## Troubleshooting

### Issue: "Type X is not assignable to type Y"

**Solution:** Check that you're using the correct interface (`AssignmentRequest` vs `AssignmentResponse`)

### Issue: Date not saving correctly

**Solution:** Ensure you're using `assignmentFormToRequest()` helper to convert Date to ISO string

### Issue: Enum value not accepted

**Solution:** Use exact string literals: `"PRACTICE"`, `"HOMEWORK"`, etc. (not lowercase)

### Issue: Form validation failing

**Solution:** Check Zod schema in `assignment.validation.ts` - ensure field names match

## File Structure

```
src/
├── services/assignment/
│   ├── assignment.types.ts          # TypeScript interfaces
│   └── assignment.service.ts        # API service methods
├── lib/validations/
│   └── assignment.validation.ts     # Zod schemas
├── hooks/teacher/
│   └── useTeacherAssignment.ts      # React Query hooks
├── core/components/teacher/assignment/
│   ├── AssignmentFormModal.tsx      # Create/Edit form
│   ├── CreateAssignmentDialog.tsx   # Quick create dialog
│   ├── GradingModal.tsx             # Grading interface
│   ├── AssignmentCard.tsx           # Card component
│   ├── SubmissionsTab.tsx           # Submissions list
│   └── index.ts                     # Exports
└── app/teacher/assignments/
    ├── page.tsx                     # Assignment library
    ├── [assignmentId]/
    │   ├── page.tsx                 # Assignment dashboard
    │   └── submissions/
    │       └── [submissionId]/
    │           └── page.tsx         # Grading page
    └── create/
        └── page.tsx                 # Create page
```

## Testing Checklist

### Assignment CRUD

- [ ] Create assignment with all fields
- [ ] Create assignment with minimal fields (only title + type)
- [ ] Edit assignment - check form pre-population
- [ ] Delete assignment
- [ ] Clone assignment

### Submission Grading

- [ ] Grade with score only
- [ ] Grade with score + feedback
- [ ] Reject with reason
- [ ] Re-grade existing submission
- [ ] Navigate between submissions

### Validation

- [ ] Try submitting empty form
- [ ] Try invalid score (negative, > max)
- [ ] Try invalid date (past date)
- [ ] Check all error messages display

### Type Safety

- [ ] No TypeScript errors in build
- [ ] All API responses match interfaces
- [ ] Date conversion works correctly
- [ ] Enums are handled properly
