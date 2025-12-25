# Frontend Naming Conventions

**Generated:** 2025-12-25  
**Purpose:** Define consistent naming conventions for frontend integration with the LMS backend API.

---

## Table of Contents

1. [Screen Names](#screen-names)
2. [API Service Methods](#api-service-methods)
3. [React Query Hooks](#react-query-hooks)
4. [Contract Keys](#contract-keys)
5. [Domain Groups](#domain-groups)
6. [Type Definitions](#type-definitions)
7. [Error Handling](#error-handling)

---

## Screen Names

Use **PascalCase** for screen/component names.

### Examples

- `CourseList` - Course listing page
- `CourseDetail` - Course detail page
- `StudentDashboard` - Student dashboard
- `TeacherDashboard` - Teacher dashboard
- `EnrollmentForm` - Enrollment form
- `ProfileSettings` - Profile settings page
- `CategoryExplorer` - Category explorer page
- `ProgressTracker` - Progress tracking page
- `ReviewEditor` - Review editor component

### Pattern

```
<Domain><Action/Purpose>
```

Examples:
- `Course` + `List` = `CourseList`
- `Student` + `Dashboard` = `StudentDashboard`
- `Enrollment` + `Form` = `EnrollmentForm`

---

## API Service Methods

Use **camelCase** for service method names. Follow the pattern: `<action><Resource>`.

### Actions

- `get` - Fetch single resource
- `list` - Fetch paginated list
- `create` - Create new resource
- `update` - Update existing resource
- `delete` - Delete resource
- `upload` - Upload file
- `mark` - Mark/update status

### Examples

```typescript
// Single resource
getCourseBySlug(slug: string): Promise<CourseDetail>
getStudentById(id: number): Promise<StudentDetail>
getCategoryTree(): Promise<Category[]>

// Paginated lists
listCourses(params?: CourseListParams): Promise<PageResponse<Course>>
listEnrollments(studentId: number, page: number, size: number): Promise<PageResponse<Enrollment>>

// Create
createCourse(request: CourseRequest): Promise<CourseDetail>
createReview(courseId: number, request: ReviewRequest): Promise<Review>

// Update
updateProfile(request: UpdateProfileRequest): Promise<Profile>
updateCourse(id: number, request: CourseUpdateRequest): Promise<CourseDetail>

// Delete
deleteCourse(id: number): Promise<void>
deleteReview(courseId: number, reviewId: number): Promise<void>

// Upload
uploadAvatar(file: File): Promise<UploadAvatarResponse>
uploadFile(file: File): Promise<FileStorageResponse>

// Status actions
markLessonAsViewed(lessonId: number): Promise<LessonProgress>
markLessonAsCompleted(lessonId: number): Promise<LessonProgress>
markNotificationRead(id: number): Promise<void>
```

### Service File Structure

```
src/features/{domain}/services/{domain}.service.ts
```

Examples:
- `src/features/courses/services/courses.service.ts`
- `src/features/auth/services/auth.service.ts`
- `src/features/enrollment/services/enrollment.service.ts`

---

## React Query Hooks

Use **camelCase** with `use` prefix. Follow the pattern: `use<Action><Resource>`.

### Query Hooks (GET)

```typescript
// Single resource
useCourse(slug: string)
useStudent(id: number)
useCategory(id: number)
useEnrollment(id: number)

// Lists
useCourses(params?: CourseListParams)
useStudentCourses(studentId: number, page?: number, size?: number)
useCourseReviews(courseId: number, page?: number, size?: number)
useNotifications(page?: number, size?: number)

// Trees/Collections
useCategoryTree()
useStudentProgress(studentId: number)
useCourseProgress(studentId: number, courseId: number)
```

### Mutation Hooks (POST/PUT/DELETE)

```typescript
// Create
useCreateCourse()
useCreateReview()
useCreateEnrollment()
useCreateComment()

// Update
useUpdateCourse()
useUpdateProfile()
useUpdateReview()

// Delete
useDeleteCourse()
useDeleteReview()
useDeleteComment()

// Status actions
useMarkLessonViewed()
useMarkLessonCompleted()
useMarkNotificationRead()
useCancelEnrollment()

// Upload
useUploadAvatar()
useUploadFile()
```

### Hook Implementation Pattern

```typescript
// Query hook example
export function useCourse(slug: string) {
  return useQuery({
    queryKey: ['course', slug],
    queryFn: () => getCourseBySlug(slug),
    enabled: !!slug,
  });
}

// Mutation hook example
export function useCreateCourse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (request: CourseRequest) => createCourse(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}
```

---

## Contract Keys

Use **UPPER_SNAKE_CASE** for contract keys. These are used for:
- API endpoint constants
- Error code mappings
- Feature flags
- Cache keys

### Endpoint Contract Keys

```typescript
// Auth
export const AUTH_REGISTER = 'AUTH_REGISTER';
export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_REFRESH = 'AUTH_REFRESH';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_ME = 'AUTH_ME';
export const AUTH_VERIFY_EMAIL = 'AUTH_VERIFY_EMAIL';
export const AUTH_FORGOT_PASSWORD = 'AUTH_FORGOT_PASSWORD';
export const AUTH_RESET_PASSWORD = 'AUTH_RESET_PASSWORD';
export const AUTH_CHANGE_PASSWORD = 'AUTH_CHANGE_PASSWORD';

// Account
export const ACCOUNT_GET_PROFILE = 'ACCOUNT_GET_PROFILE';
export const ACCOUNT_UPDATE_PROFILE = 'ACCOUNT_UPDATE_PROFILE';
export const ACCOUNT_UPLOAD_AVATAR = 'ACCOUNT_UPLOAD_AVATAR';

// Student
export const STUDENT_GET_BY_ID = 'STUDENT_GET_BY_ID';
export const STUDENT_GET_BY_CODE = 'STUDENT_GET_BY_CODE';
export const STUDENT_UPDATE = 'STUDENT_UPDATE';
export const STUDENT_GET_COURSES = 'STUDENT_GET_COURSES';
export const STUDENT_GET_CERTIFICATES = 'STUDENT_GET_CERTIFICATES';
export const STUDENT_GET_ME = 'STUDENT_GET_ME';

// Teacher
export const TEACHER_GET_BY_ID = 'TEACHER_GET_BY_ID';
export const TEACHER_GET_BY_CODE = 'TEACHER_GET_BY_CODE';
export const TEACHER_UPDATE = 'TEACHER_UPDATE';
export const TEACHER_GET_COURSES = 'TEACHER_GET_COURSES';
export const TEACHER_GET_STUDENTS = 'TEACHER_GET_STUDENTS';
export const TEACHER_GET_REVENUE = 'TEACHER_GET_REVENUE';
export const TEACHER_GET_STATS = 'TEACHER_GET_STATS';
export const TEACHER_GET_ME = 'TEACHER_GET_ME';

// Course
export const COURSE_CREATE = 'COURSE_CREATE';
export const COURSE_GET_BY_SLUG = 'COURSE_GET_BY_SLUG';
export const COURSE_LIST = 'COURSE_LIST';
export const COURSE_UPDATE = 'COURSE_UPDATE';
export const COURSE_DELETE = 'COURSE_DELETE';
export const COURSE_CLOSE = 'COURSE_CLOSE';
export const COURSE_OPEN = 'COURSE_OPEN';
export const COURSE_RESTORE = 'COURSE_RESTORE';
export const COURSE_GET_MY_COURSES = 'COURSE_GET_MY_COURSES';

// Category
export const CATEGORY_CREATE = 'CATEGORY_CREATE';
export const CATEGORY_GET_BY_ID = 'CATEGORY_GET_BY_ID';
export const CATEGORY_GET_BY_SLUG = 'CATEGORY_GET_BY_SLUG';
export const CATEGORY_GET_TREE = 'CATEGORY_GET_TREE';
export const CATEGORY_UPDATE = 'CATEGORY_UPDATE';
export const CATEGORY_DELETE = 'CATEGORY_DELETE';
export const CATEGORY_RESTORE = 'CATEGORY_RESTORE';

// Enrollment
export const ENROLLMENT_CREATE = 'ENROLLMENT_CREATE';
export const ENROLLMENT_GET_STUDENT_ENROLLMENTS = 'ENROLLMENT_GET_STUDENT_ENROLLMENTS';
export const ENROLLMENT_GET_COURSE_ENROLLMENTS = 'ENROLLMENT_GET_COURSE_ENROLLMENTS';
export const ENROLLMENT_GET_DETAIL = 'ENROLLMENT_GET_DETAIL';
export const ENROLLMENT_CANCEL = 'ENROLLMENT_CANCEL';
export const ENROLLMENT_COMPLETE = 'ENROLLMENT_COMPLETE';
export const ENROLLMENT_GET_STATS = 'ENROLLMENT_GET_STATS';

// Progress
export const PROGRESS_GET_STUDENT_OVERVIEW = 'PROGRESS_GET_STUDENT_OVERVIEW';
export const PROGRESS_GET_COURSE = 'PROGRESS_GET_COURSE';
export const PROGRESS_GET_LESSON = 'PROGRESS_GET_LESSON';
export const PROGRESS_MARK_VIEWED = 'PROGRESS_MARK_VIEWED';
export const PROGRESS_MARK_COMPLETED = 'PROGRESS_MARK_COMPLETED';
export const PROGRESS_GET_COURSE_STATS = 'PROGRESS_GET_COURSE_STATS';

// Review
export const REVIEW_CREATE = 'REVIEW_CREATE';
export const REVIEW_GET_COURSE_REVIEWS = 'REVIEW_GET_COURSE_REVIEWS';
export const REVIEW_UPDATE = 'REVIEW_UPDATE';
export const REVIEW_DELETE = 'REVIEW_DELETE';
export const REVIEW_GET_RATING_SUMMARY = 'REVIEW_GET_RATING_SUMMARY';

// Recommendation
export const RECOMMENDATION_GET = 'RECOMMENDATION_GET';
export const RECOMMENDATION_SUBMIT_FEEDBACK = 'RECOMMENDATION_SUBMIT_FEEDBACK';
export const RECOMMENDATION_GET_STATS = 'RECOMMENDATION_GET_STATS';

// Comment
export const COMMENT_CREATE_COURSE = 'COMMENT_CREATE_COURSE';
export const COMMENT_CREATE_LESSON = 'COMMENT_CREATE_LESSON';
export const COMMENT_REPLY = 'COMMENT_REPLY';
export const COMMENT_GET_COURSE = 'COMMENT_GET_COURSE';
export const COMMENT_GET_LESSON = 'COMMENT_GET_LESSON';
export const COMMENT_GET_REPLIES = 'COMMENT_GET_REPLIES';
export const COMMENT_UPDATE = 'COMMENT_UPDATE';
export const COMMENT_DELETE = 'COMMENT_DELETE';

// Notification
export const NOTIFICATION_GET = 'NOTIFICATION_GET';
export const NOTIFICATION_GET_UNREAD_COUNT = 'NOTIFICATION_GET_UNREAD_COUNT';
export const NOTIFICATION_MARK_READ = 'NOTIFICATION_MARK_READ';
export const NOTIFICATION_MARK_ALL_READ = 'NOTIFICATION_MARK_ALL_READ';
export const NOTIFICATION_DELETE = 'NOTIFICATION_DELETE';

// Quiz/Assessment
export const QUIZ_CREATE = 'QUIZ_CREATE';
export const QUIZ_GET_BY_LESSON = 'QUIZ_GET_BY_LESSON';
export const QUIZ_GET_BY_ID = 'QUIZ_GET_BY_ID';
export const QUIZ_UPDATE = 'QUIZ_UPDATE';
export const QUIZ_DELETE = 'QUIZ_DELETE';
export const QUIZ_ADD_QUESTIONS = 'QUIZ_ADD_QUESTIONS';
export const QUIZ_REMOVE_QUESTION = 'QUIZ_REMOVE_QUESTION';
```

### Usage in Code

```typescript
// constants/api-contracts.ts
export const API_CONTRACTS = {
  AUTH_LOGIN: '/api/v1/auth/login',
  AUTH_REFRESH: '/api/v1/auth/refresh',
  COURSE_LIST: '/api/v1/courses',
  COURSE_GET_BY_SLUG: '/api/v1/courses/{slug}',
  // ...
} as const;

// Usage
const response = await apiClient.post(API_CONTRACTS.AUTH_LOGIN, credentials);
```

---

## Domain Groups

Organize code by **domain/feature**. Each domain should have:
- `services/` - API service methods
- `hooks/` - React Query hooks
- `types/` - TypeScript types
- `components/` - UI components
- `mocks/` - Mock data (if needed)

### Domain Structure

```
src/features/
├── auth/
│   ├── services/
│   │   └── auth.service.ts
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── types/
│   │   └── auth.types.ts
│   └── components/
│       └── LoginForm.tsx
├── courses/
│   ├── services/
│   │   └── courses.service.ts
│   ├── hooks/
│   │   └── useCourses.ts
│   ├── types/
│   │   ├── course.types.ts
│   │   └── catalog.types.ts
│   └── components/
│       ├── CourseCard.tsx
│       └── CourseList.tsx
├── enrollment/
│   ├── services/
│   │   └── enrollment.service.ts
│   ├── hooks/
│   │   └── useEnrollment.ts
│   └── types/
│       └── enrollment.types.ts
├── progress/
│   ├── services/
│   │   └── progress.service.ts
│   ├── hooks/
│   │   └── useProgress.ts
│   └── types/
│       └── progress.types.ts
└── ...
```

### Domain List

1. **auth** - Authentication, login, registration, password management
2. **account** - User account management, profile, avatar
3. **student** - Student-specific operations
4. **teacher** - Teacher-specific operations
5. **courses** - Course management, listing, detail
6. **categories** - Category management, tree structure
7. **enrollment** - Course enrollment, cancellation
8. **progress** - Learning progress tracking
9. **reviews** - Course reviews and ratings
10. **recommendations** - Course recommendations
11. **comments** - Comments on courses/lessons
12. **notifications** - User notifications
13. **assessment** - Quizzes, questions, attempts
14. **assignment** - Assignments and submissions
15. **billing** - Payments, revenue, payouts
16. **admin** - Admin-only operations

---

## Type Definitions

Use **PascalCase** for type/interface names. Follow the pattern: `<Resource><Suffix>`.

### Suffixes

- No suffix - Main entity type
- `Request` - Request DTO
- `Response` - Response DTO
- `Detail` - Detailed view
- `Summary` - Summary view
- `Params` - Query/path parameters

### Examples

```typescript
// Entities
interface Course { ... }
interface Student { ... }
interface Enrollment { ... }

// Request DTOs
interface CourseRequest { ... }
interface UpdateProfileRequest { ... }
interface EnrollCourseRequest { ... }

// Response DTOs
interface CourseResponse { ... }
interface CourseDetailResponse { ... }
interface StudentDetailResponse { ... }
interface EnrollmentResponse { ... }

// Parameters
interface CourseListParams {
  page?: number;
  size?: number;
  category?: string;
  search?: string;
}

// Pagination
interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

### Type File Naming

```
src/features/{domain}/types/{domain}.types.ts
```

Examples:
- `src/features/courses/types/course.types.ts`
- `src/features/auth/types/auth.types.ts`
- `src/features/enrollment/types/enrollment.types.ts`

---

## Error Handling

### Error Type Names

Use **PascalCase** with `Error` suffix.

```typescript
class ApiError extends Error { ... }
class NetworkError extends Error { ... }
class ValidationError extends Error { ... }
class UnauthorizedError extends Error { ... }
class NotFoundError extends Error { ... }
```

### Error Code Constants

Use **UPPER_SNAKE_CASE** matching backend error codes.

```typescript
export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  // ...
} as const;
```

### Error Handling Pattern

```typescript
try {
  const course = await getCourseBySlug(slug);
  return course;
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.code) {
      case ERROR_CODES.NOT_FOUND:
        // Handle 404
        break;
      case ERROR_CODES.UNAUTHORIZED:
        // Handle 401 - redirect to login
        break;
      case ERROR_CODES.FORBIDDEN:
        // Handle 403 - show access denied
        break;
      default:
        // Handle other errors
    }
  }
  throw error;
}
```

---

## Summary

### Naming Patterns

| Type | Pattern | Example |
|------|---------|---------|
| Screen/Component | `PascalCase` | `CourseList`, `StudentDashboard` |
| Service Method | `camelCase` | `getCourseBySlug`, `listCourses` |
| React Hook | `use` + `camelCase` | `useCourse`, `useCreateCourse` |
| Contract Key | `UPPER_SNAKE_CASE` | `AUTH_LOGIN`, `COURSE_LIST` |
| Type/Interface | `PascalCase` | `Course`, `CourseRequest`, `CourseResponse` |
| Error Type | `PascalCase` + `Error` | `ApiError`, `NetworkError` |

### File Structure

```
src/features/{domain}/
├── services/
│   └── {domain}.service.ts
├── hooks/
│   └── use{Resource}.ts
├── types/
│   └── {domain}.types.ts
├── components/
│   └── {Component}.tsx
└── mocks/
    └── {domain}.mocks.ts
```

---

**Last Updated:** 2025-12-25  
**Maintained By:** Frontend Team

