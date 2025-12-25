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

**Source of Truth:** `ENDPOINT_TO_CONTRACT_MAP.md`

Use **UPPER_SNAKE_CASE** for contract keys. These are used for:
- API endpoint constants
- Error code mappings
- Feature flags
- Cache keys

### Contract Keys (Source: ENDPOINT_TO_CONTRACT_MAP.md)

All contract keys listed below are extracted from `ENDPOINT_TO_CONTRACT_MAP.md`. Do not use keys not present in the map.

#### AUTH Domain
```typescript
export const AUTH_REGISTER = 'AUTH_REGISTER';
export const AUTH_LOGIN = 'AUTH_LOGIN';
export const AUTH_REFRESH = 'AUTH_REFRESH';
export const AUTH_LOGOUT = 'AUTH_LOGOUT';
export const AUTH_ME = 'AUTH_ME';
```

#### ACCOUNT Domain
```typescript
export const ACCOUNT_GET_PROFILE = 'ACCOUNT_GET_PROFILE';
export const ACCOUNT_UPDATE_PROFILE = 'ACCOUNT_UPDATE_PROFILE';
export const ACCOUNT_UPLOAD_AVATAR = 'ACCOUNT_UPLOAD_AVATAR';
```

#### STUDENT Domain
```typescript
export const STUDENT_GET_ME = 'STUDENT_GET_ME';
export const STUDENT_GET_BY_ID = 'STUDENT_GET_BY_ID';
export const STUDENT_GET_COURSES = 'STUDENT_GET_COURSES';
```

#### TEACHER Domain
```typescript
export const TEACHER_GET_ME = 'TEACHER_GET_ME';
export const TEACHER_GET_BY_ID = 'TEACHER_GET_BY_ID';
export const TEACHER_GET_COURSES = 'TEACHER_GET_COURSES';
export const TEACHER_GET_STATS = 'TEACHER_GET_STATS';
export const TEACHER_GET_REVENUE = 'TEACHER_GET_REVENUE';
```

#### COURSE Domain
```typescript
export const COURSE_CREATE = 'COURSE_CREATE';
export const COURSE_GET_DETAIL = 'COURSE_GET_DETAIL';
export const COURSE_GET_LIST = 'COURSE_GET_LIST';
export const COURSE_UPDATE = 'COURSE_UPDATE';
export const COURSE_DELETE = 'COURSE_DELETE';
export const COURSE_CLOSE_ACTION = 'COURSE_CLOSE_ACTION';
export const COURSE_OPEN_ACTION = 'COURSE_OPEN_ACTION';
```

#### CATEGORY Domain
```typescript
export const CATEGORY_GET_TREE = 'CATEGORY_GET_TREE';
export const CATEGORY_GET_BY_SLUG = 'CATEGORY_GET_BY_SLUG';
export const CATEGORY_GET_BY_ID = 'CATEGORY_GET_BY_ID';
export const CATEGORY_CREATE = 'CATEGORY_CREATE';
export const CATEGORY_UPDATE = 'CATEGORY_UPDATE';
export const CATEGORY_DELETE = 'CATEGORY_DELETE';
```

#### ENROLLMENT Domain
```typescript
export const ENROLLMENT_CREATE = 'ENROLLMENT_CREATE';
export const ENROLLMENT_GET_STUDENT_LIST = 'ENROLLMENT_GET_STUDENT_LIST';
export const ENROLLMENT_GET_COURSE_LIST = 'ENROLLMENT_GET_COURSE_LIST';
export const ENROLLMENT_GET_DETAIL = 'ENROLLMENT_GET_DETAIL';
export const ENROLLMENT_CANCEL_ACTION = 'ENROLLMENT_CANCEL_ACTION';
```

#### PROGRESS Domain
```typescript
export const PROGRESS_GET_STUDENT_OVERVIEW = 'PROGRESS_GET_STUDENT_OVERVIEW';
export const PROGRESS_GET_COURSE = 'PROGRESS_GET_COURSE';
export const PROGRESS_MARK_VIEWED_ACTION = 'PROGRESS_MARK_VIEWED_ACTION';
export const PROGRESS_MARK_COMPLETED_ACTION = 'PROGRESS_MARK_COMPLETED_ACTION';
```

#### REVIEW Domain
```typescript
export const REVIEW_CREATE = 'REVIEW_CREATE';
export const REVIEW_GET_COURSE_LIST = 'REVIEW_GET_COURSE_LIST';
export const REVIEW_UPDATE = 'REVIEW_UPDATE';
export const REVIEW_DELETE = 'REVIEW_DELETE';
export const REVIEW_GET_RATING_SUMMARY = 'REVIEW_GET_RATING_SUMMARY';
```

#### RECOMMENDATION Domain
```typescript
export const RECOMMENDATION_GET = 'RECOMMENDATION_GET';
export const RECOMMENDATION_SUBMIT_FEEDBACK_ACTION = 'RECOMMENDATION_SUBMIT_FEEDBACK_ACTION';
```

#### COMMENT Domain
```typescript
export const COMMENT_CREATE_COURSE = 'COMMENT_CREATE_COURSE';
export const COMMENT_CREATE_LESSON = 'COMMENT_CREATE_LESSON';
export const COMMENT_GET_COURSE_LIST = 'COMMENT_GET_COURSE_LIST';
export const COMMENT_GET_LESSON_LIST = 'COMMENT_GET_LESSON_LIST';
export const COMMENT_UPDATE = 'COMMENT_UPDATE';
export const COMMENT_DELETE = 'COMMENT_DELETE';
```

#### NOTIFICATION Domain
```typescript
export const NOTIFICATION_GET_LIST = 'NOTIFICATION_GET_LIST';
export const NOTIFICATION_GET_UNREAD_COUNT = 'NOTIFICATION_GET_UNREAD_COUNT';
export const NOTIFICATION_MARK_READ_ACTION = 'NOTIFICATION_MARK_READ_ACTION';
export const NOTIFICATION_MARK_ALL_READ_ACTION = 'NOTIFICATION_MARK_ALL_READ_ACTION';
export const NOTIFICATION_DELETE = 'NOTIFICATION_DELETE';
```

#### QUIZ Domain
```typescript
export const QUIZ_CREATE = 'QUIZ_CREATE';
export const QUIZ_GET_BY_LESSON = 'QUIZ_GET_BY_LESSON';
export const QUIZ_GET_BY_ID = 'QUIZ_GET_BY_ID';
export const QUIZ_UPDATE = 'QUIZ_UPDATE';
export const QUIZ_DELETE = 'QUIZ_DELETE';
export const QUIZ_START_ACTION = 'QUIZ_START_ACTION';
export const QUIZ_SUBMIT_ANSWER_ACTION = 'QUIZ_SUBMIT_ANSWER_ACTION';
export const QUIZ_FINISH_ACTION = 'QUIZ_FINISH_ACTION';
```

#### ASSIGNMENT Domain
```typescript
export const ASSIGNMENT_CREATE = 'ASSIGNMENT_CREATE';
export const ASSIGNMENT_GET_BY_LESSON = 'ASSIGNMENT_GET_BY_LESSON';
export const ASSIGNMENT_GET_BY_ID = 'ASSIGNMENT_GET_BY_ID';
export const ASSIGNMENT_UPDATE = 'ASSIGNMENT_UPDATE';
export const ASSIGNMENT_DELETE = 'ASSIGNMENT_DELETE';
```

#### SUBMISSION Domain
```typescript
export const SUBMISSION_CREATE = 'SUBMISSION_CREATE';
export const SUBMISSION_GET_BY_ASSIGNMENT = 'SUBMISSION_GET_BY_ASSIGNMENT';
export const SUBMISSION_GET_BY_ID = 'SUBMISSION_GET_BY_ID';
export const SUBMISSION_GRADE_ACTION = 'SUBMISSION_GRADE_ACTION';
export const SUBMISSION_FEEDBACK_ACTION = 'SUBMISSION_FEEDBACK_ACTION';
```

#### CHAPTER Domain
```typescript
export const CHAPTER_CREATE = 'CHAPTER_CREATE';
export const CHAPTER_GET_LIST = 'CHAPTER_GET_LIST';
export const CHAPTER_GET_DETAIL = 'CHAPTER_GET_DETAIL';
export const CHAPTER_UPDATE = 'CHAPTER_UPDATE';
export const CHAPTER_DELETE = 'CHAPTER_DELETE';
export const CHAPTER_REORDER_ACTION = 'CHAPTER_REORDER_ACTION';
```

#### LESSON Domain
```typescript
export const LESSON_CREATE = 'LESSON_CREATE';
export const LESSON_GET_BY_CHAPTER = 'LESSON_GET_BY_CHAPTER';
export const LESSON_GET_BY_ID = 'LESSON_GET_BY_ID';
export const LESSON_UPDATE = 'LESSON_UPDATE';
export const LESSON_DELETE = 'LESSON_DELETE';
export const LESSON_GET_VIDEO_UPLOAD_URL = 'LESSON_GET_VIDEO_UPLOAD_URL';
export const LESSON_VIDEO_UPLOAD_COMPLETE_ACTION = 'LESSON_VIDEO_UPLOAD_COMPLETE_ACTION';
export const LESSON_GET_VIDEO_STREAM_URL = 'LESSON_GET_VIDEO_STREAM_URL';
```

#### RESOURCE Domain
```typescript
export const RESOURCE_CREATE_LINK = 'RESOURCE_CREATE_LINK';
export const RESOURCE_CREATE_FILE = 'RESOURCE_CREATE_FILE';
export const RESOURCE_GET_BY_LESSON = 'RESOURCE_GET_BY_LESSON';
export const RESOURCE_GET_BY_ID = 'RESOURCE_GET_BY_ID';
export const RESOURCE_UPDATE = 'RESOURCE_UPDATE';
export const RESOURCE_DELETE = 'RESOURCE_DELETE';
```

#### FILE Domain
```typescript
export const FILE_UPLOAD = 'FILE_UPLOAD';
export const FILE_GET_BY_ID = 'FILE_GET_BY_ID';
export const FILE_GET_DOWNLOAD_URL = 'FILE_GET_DOWNLOAD_URL';
export const FILE_DELETE = 'FILE_DELETE';
```

#### TAG Domain
```typescript
export const TAG_CREATE = 'TAG_CREATE';
export const TAG_GET_LIST = 'TAG_GET_LIST';
export const TAG_UPDATE = 'TAG_UPDATE';
export const TAG_DELETE = 'TAG_DELETE';
```

#### VERSION Domain
```typescript
export const VERSION_CREATE = 'VERSION_CREATE';
export const VERSION_GET_LIST = 'VERSION_GET_LIST';
export const VERSION_GET_DETAIL = 'VERSION_GET_DETAIL';
export const VERSION_SUBMIT_APPROVAL_ACTION = 'VERSION_SUBMIT_APPROVAL_ACTION';
export const VERSION_APPROVE_ACTION = 'VERSION_APPROVE_ACTION';
export const VERSION_REJECT_ACTION = 'VERSION_REJECT_ACTION';
export const VERSION_PUBLISH_ACTION = 'VERSION_PUBLISH_ACTION';
```

#### ADMIN Domain
```typescript
export const ADMIN_GET_USERS = 'ADMIN_GET_USERS';
export const ADMIN_GET_USER_STATS = 'ADMIN_GET_USER_STATS';
export const ADMIN_EXPORT_USERS_ACTION = 'ADMIN_EXPORT_USERS_ACTION';
export const ADMIN_GET_DASHBOARD = 'ADMIN_GET_DASHBOARD';
export const ADMIN_GET_STATISTICS = 'ADMIN_GET_STATISTICS';
export const ADMIN_GET_REVENUE_REPORT = 'ADMIN_GET_REVENUE_REPORT';
export const ADMIN_GET_AUDIT_LOGS = 'ADMIN_GET_AUDIT_LOGS';
export const ADMIN_SEARCH_AUDIT_LOGS = 'ADMIN_SEARCH_AUDIT_LOGS';
export const ADMIN_EXPORT_AUDIT_LOGS_ACTION = 'ADMIN_EXPORT_AUDIT_LOGS_ACTION';
export const ADMIN_GET_SETTINGS = 'ADMIN_GET_SETTINGS';
export const ADMIN_CREATE_SETTING = 'ADMIN_CREATE_SETTING';
export const ADMIN_UPDATE_SETTING = 'ADMIN_UPDATE_SETTING';
export const ADMIN_DELETE_SETTING = 'ADMIN_DELETE_SETTING';
```

#### REPORT Domain
```typescript
export const REPORT_CREATE = 'REPORT_CREATE';
export const REPORT_GET_MY_LIST = 'REPORT_GET_MY_LIST';
export const REPORT_GET_ALL_LIST = 'REPORT_GET_ALL_LIST';
export const REPORT_GET_DETAIL = 'REPORT_GET_DETAIL';
```

### Usage in Code

```typescript
// constants/api-contracts.ts
export const API_CONTRACTS = {
  AUTH_LOGIN: '/api/v1/auth/login',
  AUTH_REFRESH: '/api/v1/auth/refresh',
  COURSE_GET_LIST: '/api/v1/courses',
  COURSE_GET_DETAIL: '/api/v1/courses/{slug}',
  // ... (all keys must match ENDPOINT_TO_CONTRACT_MAP.md)
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

Domains are derived from `ENDPOINT_TO_CONTRACT_MAP.md`. Only domains present in the map are listed:

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
15. **admin** - Admin-only operations
16. **chapters** - Course chapters (course.content)
17. **lessons** - Lessons (course.content)
18. **resources** - Lesson resources (course.content)
19. **files** - File storage (course.content)
20. **tags** - Course tags
21. **versions** - Course versions
22. **reports** - Violation reports

**Note:** Billing/payment domains are not present in the current endpoint map and should not be used until endpoints are implemented.

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
| Contract Key | `UPPER_SNAKE_CASE` | `AUTH_LOGIN`, `COURSE_GET_LIST` |
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

