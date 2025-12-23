# Teacher Management API Documentation

## Overview

This document describes the Spring Boot backend implementation of Teacher Management APIs. All endpoints are secured with JWT Bearer authentication (`@SecurityRequirement(name = "bearerAuth")`).

---

## High-Level Architecture Flow

```
Controller (TeacherController)
    ↓
Service (TeacherService)
    ↓
Repository (TeacherRepository) + AccountRepository
    ↓
Domain Entities (Teacher, Account)
    ↓
Database (teachers, accounts tables)
```

**Security Layer:**
- JWT authentication via `SecurityUtils.getCurrentUserId()` extracts `userId` from JWT claims
- Role-based authorization checks in service methods
- Account status validation (ACTIVE required for updates)

---

## What `{id}` Means

**CRITICAL:** The `{id}` path parameter in `/api/v1/teachers/{id}` refers to the **Teacher ID** (primary key of `teachers` table), NOT the `accountId`.

- **Teacher ID** (`Teacher.id`): Primary key, auto-generated, unique per teacher record
- **Account ID** (`Account.id`): Foreign key in `Teacher.account`, links to `accounts` table
- **Relationship:** `Teacher` has a `@OneToOne` relationship with `Account` via `account_id` column

**How to get Teacher ID from Account ID:**
- Use `TeacherRepository.findByAccount(Account account)` to find teacher by account
- Or query: `SELECT t.id FROM Teacher t WHERE t.account.id = :accountId`

---

## Teacher Record Creation

Teachers are created in **two scenarios**:

### 1. Email Verification (Normal Registration Flow)
**File:** `backend/lms/src/main/java/vn/uit/lms/service/EmailVerificationService.java:verifyToken()`

- When user registers with `role=TEACHER` and verifies email:
  - Account status set to `PENDING_APPROVAL`
  - Teacher entity created with:
    - `account` = verified Account
    - `teacherCode` = auto-generated (via `TeacherCodeGenerator`)
    - `fullName` = "User" + accountId (temporary)
    - `approved` = false
  - Teacher must later request approval or be approved by admin

### 2. Initializer (Default Demo Account)
**File:** `backend/lms/src/main/java/vn/uit/lms/config/init/Initializer.java:createTeacherProfile()`

- On application startup, creates default teacher account if missing
- Teacher is **pre-approved** (`approved = true`)
- Used for development/testing

---

## Endpoint Details

### 1. GET `/api/v1/teachers/{id}` - Get Teacher by ID

**Controller:** `TeacherController.getTeacherById(Long id)`
**Service:** `TeacherService.getTeacherById(Long id)`

**Input:**
- Path param: `id` (Long) - Teacher ID

**Auth & Authorization:**
- ✅ Requires JWT Bearer token
- **TEACHER:** Can only view their own profile (`teacher.account.id == currentUserId`)
- **ADMIN:** Can view any teacher
- **STUDENT:** Can view approved teachers teaching their courses (enrollment check TODO)

**Business Logic:**
1. Load teacher with account via `TeacherRepository.findByIdWithAccount(id)`
2. If not found → `ResourceNotFoundException("Teacher not found with id: " + id)`
3. Call `validateTeacherAccess(teacher)` for authorization
4. Map to DTO via `TeacherMapper.toTeacherDetailResponse(teacher)`

**Error Conditions:**
- `404 Not Found`: Teacher not found → `ResourceNotFoundException`
- `401 Unauthorized`: Not authenticated or access denied → `UnauthorizedException`

**Output DTO:** `TeacherDetailResponse`
- Fields: `id`, `accountId`, `teacherCode`, `fullName`, `email`, `username`, `phone`, `birthDate`, `gender`, `bio`, `specialty`, `degree`, `avatarUrl`, `approved`, `approvedBy`, `approvedAt`, `rejectReason`, `accountStatus`, `role`, `lastLoginAt`, `createdAt`, `updatedAt`

---

### 2. GET `/api/v1/teachers/code/{code}` - Get Teacher by Code

**Controller:** `TeacherController.getTeacherByCode(String code)`
**Service:** `TeacherService.getTeacherByCode(String code)`

**Input:**
- Path param: `code` (String) - Teacher code (e.g., "GV2024001")

**Auth & Authorization:**
- ✅ Requires JWT Bearer token
- Same rules as GET by ID (TEACHER own, ADMIN any, STUDENT approved)

**Business Logic:**
1. Load teacher via `TeacherRepository.findByTeacherCodeWithAccount(code)`
2. If not found → `ResourceNotFoundException("Teacher not found with code: " + code)`
3. Call `validateTeacherAccess(teacher)`
4. Map to `TeacherDetailResponse`

**Error Conditions:**
- `404 Not Found`: Teacher not found
- `401 Unauthorized`: Access denied

**Output DTO:** `TeacherDetailResponse`

---

### 3. PUT `/api/v1/teachers/{id}` - Update Teacher Information

**Controller:** `TeacherController.updateTeacher(Long id, UpdateTeacherRequest request)`
**Service:** `TeacherService.updateTeacher(Long id, UpdateTeacherRequest request)`

**Input:**
- Path param: `id` (Long) - Teacher ID
- Body: `UpdateTeacherRequest` (validated with `@Valid`)
  - `fullName` (String, 2-255 chars, required)
  - `birthDate` (LocalDate, must be past)
  - `gender` (Gender enum)
  - `phone` (String, 10-15 digits, regex: `^[0-9]{10,15}$`)
  - `bio` (String, max 1000 chars)
  - `specialty` (String, max 255 chars)
  - `degree` (String, max 128 chars)
  - `teacherCode` (String, max 50 chars, optional)

**Auth & Authorization:**
- ✅ Requires JWT Bearer token
- **TEACHER:** Can only update their own profile (`teacher.account.id == currentUserId`)
- **ADMIN:** Can update any teacher
- Account must be `ACTIVE` status

**Business Logic:**
1. Load teacher with account
2. Check account status is `ACTIVE` → else `InvalidStatusException("Cannot update inactive teacher account")`
3. Authorization check:
   - If current user is TEACHER → must match teacher's account ID
   - If ADMIN → allowed
4. If `teacherCode` changed → validate uniqueness → else `InvalidRequestException("Teacher code already exists")`
5. Update fields (only non-null/non-blank from request)
6. Save via `TeacherRepository.save(teacher)`
7. Return `TeacherDetailResponse`

**Error Conditions:**
- `404 Not Found`: Teacher not found
- `400 Bad Request`: Validation errors (Jakarta Validation), duplicate teacher code, inactive account
- `401 Unauthorized`: Not authenticated or not own profile (for TEACHER)

**Output DTO:** `TeacherDetailResponse`

**Audit:** `@Audit(table = "teachers", action = AuditAction.UPDATE)`

---

### 4. PUT `/api/v1/teachers/{id}/avatar` - Upload Teacher Avatar

**Controller:** `TeacherController.uploadAvatar(Long id, MultipartFile file)`
**Service:** `TeacherService.uploadTeacherAvatar(Long id, MultipartFile file)`

**Input:**
- Path param: `id` (Long) - Teacher ID
- Form data: `file` (MultipartFile) - Image file
  - Content-Type: `multipart/form-data`
  - Allowed types: `image/jpeg`, `image/png`, `image/webp`
  - Max size: Configurable via `app.avatar.max-size-bytes` (default not shown, but validated)

**Auth & Authorization:**
- ✅ Requires JWT Bearer token
- **TEACHER:** Can only upload their own avatar (`teacher.account.id == currentUserId`)
- Account must be `ACTIVE`

**Business Logic:**
1. Validate file:
   - Not null/empty → else `InvalidFileException("File is empty")`
   - Content-Type in allowed set → else `InvalidFileException("Only JPG, PNG, WEBP are allowed")`
   - Size <= maxSizeBytes → else `InvalidFileException("File size exceeds XMB")`
2. Load teacher with account
3. Check account status is `ACTIVE`
4. Authorization: TEACHER must match own account ID
5. Get old avatar `publicId` from account
6. Upload to Cloudinary via `CloudinaryStorageService.uploadAvatar(file, accountId, oldPublicId)`
7. Delete old avatar from Cloudinary if different publicId
8. Update account: `avatarUrl`, `avatarPublicId`
9. Return `UploadAvatarResponse` with `avatarUrl` and `thumbnailUrl`

**Error Conditions:**
- `404 Not Found`: Teacher not found
- `400 Bad Request`: Invalid file (empty, wrong type, too large), inactive account
- `401 Unauthorized`: Not authenticated or not own avatar

**Output DTO:** `UploadAvatarResponse`
- Fields: `avatarUrl`, `thumbnailUrl`

---

### 5. POST `/api/v1/teachers/{id}/request-approval` - Request Approval

**Controller:** `TeacherController.requestApproval(Long id)`
**Service:** `TeacherService.requestApproval(Long id)`

**Input:**
- Path param: `id` (Long) - Teacher ID
- No request body

**Auth & Authorization:**
- ✅ Requires JWT Bearer token
- **TEACHER:** Can only request approval for themselves (`teacher.account.id == currentUserId`)

**Business Logic:**
1. Load teacher with account
2. Authorization: Must be own account
3. Check if already approved → else `InvalidRequestException("Teacher is already approved")`
4. **TODO:** Full approval workflow not implemented:
   - Should create `ApprovalRequest` entity
   - Send notification to admin
   - Set pending approval status
   - Validate profile completeness
5. Currently just returns teacher detail (no state change)

**Error Conditions:**
- `404 Not Found`: Teacher not found
- `400 Bad Request`: Already approved
- `401 Unauthorized`: Not authenticated or not own account

**Output DTO:** `TeacherDetailResponse`

**Audit:** `@Audit(table = "teachers", action = AuditAction.UPDATE)`

**Note:** Implementation is incomplete (TODO comments in code).

---

### 6. POST `/api/v1/teachers/{id}/approve` - Approve Teacher (Admin Only)

**Controller:** `TeacherController.approveTeacher(Long id, ApproveTeacherRequest request)`
**Service:** `TeacherService.approveTeacher(Long id, String note)`

**Input:**
- Path param: `id` (Long) - Teacher ID
- Body: `ApproveTeacherRequest` (optional)
  - `note` (String, max 500 chars, optional)

**Auth & Authorization:**
- ✅ Requires JWT Bearer token
- **ADMIN only:** `currentAccount.role == Role.ADMIN`

**Business Logic:**
1. Verify admin role → else `UnauthorizedException("Only admins can approve teachers")`
2. Load teacher with account
3. Check if already approved → else `InvalidRequestException("Teacher is already approved")`
4. Update teacher:
   - `approved = true`
   - `approvedBy = currentUserId` (admin ID)
   - `approvedAt = Instant.now()`
   - `rejectReason = null` (clear rejection)
5. Save teacher
6. **TODO:** Send approval notification email
7. Return `TeacherDetailResponse`

**Error Conditions:**
- `404 Not Found`: Teacher not found
- `400 Bad Request`: Already approved
- `401 Unauthorized`: Not authenticated or not admin

**Output DTO:** `TeacherDetailResponse`

**Audit:** `@Audit(table = "teachers", action = AuditAction.UPDATE)`

---

### 7. POST `/api/v1/teachers/{id}/reject` - Reject Teacher (Admin Only)

**Controller:** `TeacherController.rejectTeacher(Long id, RejectTeacherRequest request)`
**Service:** `TeacherService.rejectTeacher(Long id, String reason)`

**Input:**
- Path param: `id` (Long) - Teacher ID
- Body: `RejectTeacherRequest` (required, validated)
  - `reason` (String, 10-1000 chars, required, `@NotBlank`)

**Auth & Authorization:**
- ✅ Requires JWT Bearer token
- **ADMIN only:** `currentAccount.role == Role.ADMIN`

**Business Logic:**
1. Verify admin role → else `UnauthorizedException("Only admins can reject teachers")`
2. Load teacher with account
3. Update teacher:
   - `approved = false`
   - `rejectReason = reason`
   - `approvedBy = null`
   - `approvedAt = null`
4. Save teacher
5. **TODO:** Send rejection notification email with reason
6. Return `TeacherDetailResponse`

**Error Conditions:**
- `404 Not Found`: Teacher not found
- `400 Bad Request`: Validation errors (reason required, 10-1000 chars)
- `401 Unauthorized`: Not authenticated or not admin

**Output DTO:** `TeacherDetailResponse`

**Audit:** `@Audit(table = "teachers", action = AuditAction.UPDATE)`

---

### 8. DELETE `/api/v1/teachers/{id}` - Delete Teacher (Admin Only)

**Controller:** `TeacherController.deleteTeacher(Long id, HttpServletRequest request)`
**Service:** `TeacherService.deleteTeacher(Long id, String ipAddress)`

**Input:**
- Path param: `id` (Long) - Teacher ID
- Request: Used to extract `ipAddress` for audit logging

**Auth & Authorization:**
- ✅ Requires JWT Bearer token
- **ADMIN only:** Verified in `AccountService.deleteAccountById()`

**Business Logic:**
1. Load teacher with account
2. Call `AccountService.deleteAccountById(teacher.account.id, ipAddress)`
3. `AccountService`:
   - Verifies admin role
   - Sets account status to `DEACTIVATED` (soft delete)
   - Logs action via `AccountActionLogService`
   - Publishes `AccountStatusChangeEvent`
4. Returns `204 No Content`

**Error Conditions:**
- `404 Not Found`: Teacher or account not found
- `401 Unauthorized`: Not authenticated or not admin

**Output:** `204 No Content` (void)

**Note:** This is a **soft delete** - account status set to `DEACTIVATED`, not physically deleted.

---

### 9. GET `/api/v1/teachers/{id}/courses` - Get Teacher's Courses

**Controller:** `TeacherController.getTeacherCourses(Long id, Pageable pageable)`
**Service:** `TeacherService.getTeacherCourses(Long id, Pageable pageable)`

**Input:**
- Path param: `id` (Long) - Teacher ID
- Query params: Standard Spring `Pageable` (page, size, sort)

**Auth & Authorization:**
- ✅ Requires JWT Bearer token
- **TEACHER:** Can view own courses
- **ADMIN:** Can view any teacher's courses
- **STUDENT:** Can view approved teacher's published courses

**Business Logic:**
1. Load teacher (without account join)
2. Call `validateTeacherAccess(teacher)`
3. **TODO:** Actual course query not implemented
   - Should query `CourseRepository.findByTeacher(teacher, pageable)`
   - Map to `CourseResponse` via `CourseMapper`
4. Currently returns empty page: `PageResponse<CourseResponse>` with empty list

**Error Conditions:**
- `404 Not Found`: Teacher not found
- `401 Unauthorized`: Access denied

**Output DTO:** `PageResponse<CourseResponse>`
- Fields: `content` (List<CourseResponse>), `page`, `size`, `totalElements`, `totalPages`, `hasNext`, `hasPrevious`

**Note:** Implementation is incomplete (returns empty list, TODO in code).

---

### 10. GET `/api/v1/teachers/{id}/students` - Get Teacher's Students

**Controller:** `TeacherController.getTeacherStudents(Long id, Pageable pageable)`
**Service:** `TeacherService.getTeacherStudents(Long id, Pageable pageable)`

**Input:**
- Path param: `id` (Long) - Teacher ID
- Query params: Standard Spring `Pageable`

**Auth & Authorization:**
- ✅ Requires JWT Bearer token
- **TEACHER:** Can only view own students
- **ADMIN:** Can view any teacher's students
- Uses `validateTeacherOwnershipOrAdmin(teacher)` (stricter than `validateTeacherAccess`)

**Business Logic:**
1. Load teacher
2. Authorization: TEACHER must match own account, or ADMIN
3. **TODO:** Actual student enrollment query not implemented
   - Should query distinct students enrolled in teacher's courses
   - Include enrollment count per student
   - Add filters (course, enrollment status, search)
4. Currently returns empty page: `PageResponse<StudentResponse>` with empty list

**Error Conditions:**
- `404 Not Found`: Teacher not found
- `401 Unauthorized`: Access denied (not own students for TEACHER, not admin)

**Output DTO:** `PageResponse<StudentResponse>`

**Note:** Implementation is incomplete (returns empty list, TODO in code).

---

### 11. GET `/api/v1/teachers/{id}/revenue` - Get Teacher Revenue Statistics

**Controller:** `TeacherController.getTeacherRevenue(Long id)`
**Service:** `TeacherService.getTeacherRevenue(Long id)`

**Input:**
- Path param: `id` (Long) - Teacher ID

**Auth & Authorization:**
- ✅ Requires JWT Bearer token
- **TEACHER:** Can only view own revenue
- **ADMIN:** Can view any teacher's revenue
- Uses `validateTeacherOwnershipOrAdmin(teacher)`

**Business Logic:**
1. Load teacher
2. Authorization check
3. **TODO:** Actual revenue calculation not implemented
   - Should query enrollments with payment information
   - Calculate total, monthly, yearly revenue
   - Break down by course
   - Consider platform fees/commission
4. Currently returns mock data:
   - `totalRevenue = 0.0`
   - `monthlyRevenue = 0.0`
   - `yearlyRevenue = 0.0`
   - `totalEnrollments = 0L`
   - `monthlyEnrollments = 0L`
   - `revenueByCourse = []` (empty list)
   - `lastUpdated = Instant.now()`

**Error Conditions:**
- `404 Not Found`: Teacher not found
- `401 Unauthorized`: Access denied

**Output DTO:** `TeacherRevenueResponse`
- Fields: `totalRevenue`, `monthlyRevenue`, `yearlyRevenue`, `totalEnrollments`, `monthlyEnrollments`, `revenueByCourse` (List<CourseRevenueDetail>), `lastUpdated`
- `CourseRevenueDetail`: `courseId`, `courseTitle`, `enrollmentCount`, `revenue`

**Note:** Implementation is incomplete (returns zeros, TODO in code).

---

### 12. GET `/api/v1/teachers/{id}/stats` - Get Teacher Statistics

**Controller:** `TeacherController.getTeacherStats(Long id)`
**Service:** `TeacherService.getTeacherStats(Long id)`

**Input:**
- Path param: `id` (Long) - Teacher ID

**Auth & Authorization:**
- ✅ Requires JWT Bearer token
- **TEACHER:** Can view own stats
- **ADMIN:** Can view any teacher's stats
- Uses `validateTeacherAccess(teacher)`

**Business Logic:**
1. Load teacher
2. Authorization check
3. **TODO:** Actual statistics calculation not implemented
   - Should count courses by status (DRAFT, PUBLISHED, ARCHIVED)
   - Count total students
   - Calculate average rating
   - Count total reviews
   - Add caching for performance
4. Currently returns mock data:
   - `totalCourses = 0L`
   - `publishedCourses = 0L`
   - `draftCourses = 0L`
   - `totalStudents = 0L`
   - `totalReviews = 0L`
   - `averageRating = 0.0`
   - `totalRevenue = 0.0`

**Error Conditions:**
- `404 Not Found`: Teacher not found
- `401 Unauthorized`: Access denied

**Output DTO:** `TeacherStatsResponse`
- Fields: `totalCourses`, `publishedCourses`, `draftCourses`, `totalStudents`, `totalReviews`, `averageRating`, `totalRevenue`

**Note:** Implementation is incomplete (returns zeros, TODO in code).

---

## Key Files Reference

### Controllers
- `backend/lms/src/main/java/vn/uit/lms/controller/user/TeacherController.java`
  - All 12 endpoints defined here

### Services
- `backend/lms/src/main/java/vn/uit/lms/service/TeacherService.java`
  - Main business logic for all teacher operations
  - Authorization checks: `validateTeacherAccess()`, `validateTeacherOwnershipOrAdmin()`
- `backend/lms/src/main/java/vn/uit/lms/service/EmailVerificationService.java`
  - Creates Teacher entity during email verification (line 114-121)
- `backend/lms/src/main/java/vn/uit/lms/service/AccountService.java`
  - `deleteAccountById()` - Soft deletes account (used by teacher delete)

### Repositories
- `backend/lms/src/main/java/vn/uit/lms/core/repository/TeacherRepository.java`
  - `findByIdWithAccount(Long id)` - Loads teacher with account (JOIN FETCH)
  - `findByTeacherCodeWithAccount(String code)` - Loads by code with account
  - `findByAccount(Account account)` - Find teacher by account
  - `findByTeacherCode(String code)` - Check code uniqueness

### Domain Entities
- `backend/lms/src/main/java/vn/uit/lms/core/domain/Teacher.java`
  - Entity with `id`, `account` (OneToOne), `teacherCode`, `specialty`, `degree`, `approved`, `approvedBy`, `approvedAt`, `rejectReason`
  - Rich domain methods: `requireApproved()`, `approve()`, `reject()`, `hasBeenReviewed()`, `isPendingApproval()`
- `backend/lms/src/main/java/vn/uit/lms/core/domain/Account.java`
  - Entity with `id`, `username`, `email`, `role`, `status`, `avatarUrl`, `avatarPublicId`
  - Status management: `activate()`, `deactivate()`, `setPendingApproval()`, etc.
- `backend/lms/src/main/java/vn/uit/lms/shared/entity/PersonBase.java`
  - Base class for Teacher (inherits: `fullName`, `birthDate`, `gender`, `phone`, `bio`)

### DTOs
- Request DTOs:
  - `backend/lms/src/main/java/vn/uit/lms/shared/dto/request/teacher/UpdateTeacherRequest.java`
  - `backend/lms/src/main/java/vn/uit/lms/shared/dto/request/teacher/ApproveTeacherRequest.java`
  - `backend/lms/src/main/java/vn/uit/lms/shared/dto/request/teacher/RejectTeacherRequest.java`
- Response DTOs:
  - `backend/lms/src/main/java/vn/uit/lms/shared/dto/response/teacher/TeacherDetailResponse.java`
  - `backend/lms/src/main/java/vn/uit/lms/shared/dto/response/teacher/TeacherStatsResponse.java`
  - `backend/lms/src/main/java/vn/uit/lms/shared/dto/response/teacher/TeacherRevenueResponse.java`
  - `backend/lms/src/main/java/vn/uit/lms/shared/dto/response/account/UploadAvatarResponse.java`

### Mappers
- `backend/lms/src/main/java/vn/uit/lms/shared/mapper/TeacherMapper.java`
  - `toTeacherDetailResponse(Teacher)` - Maps Teacher + Account to DTO

### Security & Utilities
- `backend/lms/src/main/java/vn/uit/lms/shared/util/SecurityUtils.java`
  - `getCurrentUserId()` - Extracts `userId` from JWT claims (`USER_ID_CLAIM = "userId"`)
  - JWT contains: `userId`, `user` (object with accountId, username, email, role), `role`

### Exceptions
- `backend/lms/src/main/java/vn/uit/lms/shared/exception/ResourceNotFoundException.java` → 404
- `backend/lms/src/main/java/vn/uit/lms/shared/exception/UnauthorizedException.java` → 401
- `backend/lms/src/main/java/vn/uit/lms/shared/exception/InvalidRequestException.java` → 400
- `backend/lms/src/main/java/vn/uit/lms/shared/exception/InvalidStatusException.java` → 400
- `backend/lms/src/main/java/vn/uit/lms/shared/exception/InvalidFileException.java` → 400

---

## Summary of Implementation Status

### ✅ Fully Implemented
1. GET `/api/v1/teachers/{id}` - Get teacher by ID
2. GET `/api/v1/teachers/code/{code}` - Get teacher by code
3. PUT `/api/v1/teachers/{id}` - Update teacher information
4. PUT `/api/v1/teachers/{id}/avatar` - Upload avatar
5. POST `/api/v1/teachers/{id}/approve` - Approve teacher (admin)
6. POST `/api/v1/teachers/{id}/reject` - Reject teacher (admin)
7. DELETE `/api/v1/teachers/{id}` - Delete teacher (admin)

### ⚠️ Partially Implemented (TODO)
8. POST `/api/v1/teachers/{id}/request-approval` - Request approval (workflow incomplete)
9. GET `/api/v1/teachers/{id}/courses` - Get courses (returns empty list)
10. GET `/api/v1/teachers/{id}/students` - Get students (returns empty list)
11. GET `/api/v1/teachers/{id}/revenue` - Get revenue (returns zeros)
12. GET `/api/v1/teachers/{id}/stats` - Get stats (returns zeros)

---

## Authorization Matrix

| Endpoint | TEACHER | ADMIN | STUDENT |
|----------|---------|-------|---------|
| GET `/teachers/{id}` | Own only | Any | Approved teachers only |
| GET `/teachers/code/{code}` | Own only | Any | Approved teachers only |
| PUT `/teachers/{id}` | Own only | Any | ❌ |
| PUT `/teachers/{id}/avatar` | Own only | ❌ | ❌ |
| POST `/teachers/{id}/request-approval` | Own only | ❌ | ❌ |
| POST `/teachers/{id}/approve` | ❌ | ✅ | ❌ |
| POST `/teachers/{id}/reject` | ❌ | ✅ | ❌ |
| DELETE `/teachers/{id}` | ❌ | ✅ | ❌ |
| GET `/teachers/{id}/courses` | Own only | Any | Approved teachers' published |
| GET `/teachers/{id}/students` | Own only | Any | ❌ |
| GET `/teachers/{id}/revenue` | Own only | Any | ❌ |
| GET `/teachers/{id}/stats` | Own only | Any | ❌ |

---

## Notes for Frontend Integration

1. **Teacher ID vs Account ID:** Frontend must map `accountId` (from JWT/user info) to `teacherId` before calling endpoints. Consider adding a helper endpoint like `/api/v1/teachers/me` that returns current teacher's ID.

2. **Incomplete Endpoints:** Endpoints 9-12 return empty/zero data. Frontend should handle this gracefully (show "No data" or placeholder).

3. **Request Approval:** Currently a no-op (returns teacher without state change). Frontend should show appropriate messaging.

4. **File Upload:** Avatar endpoint expects `multipart/form-data` with field name `file`. Frontend must not set `Content-Type: application/json` for this endpoint.

5. **Pagination:** Courses and students endpoints support Spring `Pageable` (page, size, sort query params).

6. **Error Handling:** All exceptions return standard error DTOs with `message` field. Frontend should check status codes and display messages.

