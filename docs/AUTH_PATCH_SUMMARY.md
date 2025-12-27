# Auth + API Layer Patch Summary

**Date:** 2025-01-XX  
**Purpose:** Chuẩn hóa auth flow và API layer theo yêu cầu backend (accountId ≠ studentId ≠ teacherId)

---

## 📋 Danh sách File Changed

### ✅ TASK A — PATCH src/lib/api/

#### 1. `src/lib/api/api.error.ts` (UPDATED)
- ✅ Thêm field `contractKey?: string` vào `AppError` class
- ✅ Constructor nhận thêm parameter `contractKey`

#### 2. `src/lib/api/axios.ts` (UPDATED)
- ✅ Verify baseURL: Tự động đảm bảo baseURL có `/api/v1`
- ✅ Update refresh path: Sử dụng `/auth/refresh` (baseURL đã có `/api/v1`)
- ✅ Thêm support contractKey trong request config:
  - Extend `AxiosRequestConfig` với `contractKey?: ContractKey`
  - Request interceptor attach `X-Contract-Key` header nếu có
  - Response interceptor include contractKey vào `AppError`

### ✅ TASK B — CREATE New Files

#### 1. `src/lib/auth/roleMap.ts` (NEW)
- ✅ Map backend roles (USER, CREATOR, ADMIN) → internal roles (STUDENT, TEACHER, ADMIN)
- ✅ Helper functions: `mapBackendRoleToInternal`, `isStudentRole`, `isTeacherRole`, `isAdminRole`

#### 2. `src/lib/auth/authStore.ts` (NEW)
- ✅ Zustand store với persist middleware
- ✅ State: `accountId`, `role`, `email`, `fullName`, `username`, `avatarUrl`, `studentId`, `teacherId`
- ✅ Actions: `setAuth`, `setStudentId`, `setTeacherId`, `clear`
- ✅ Getters: `isAuthenticated`, `isStudent`, `isTeacher`, `isAdmin`

#### 3. `src/services/student/student.service.ts` (NEW)
- ✅ `getMe()` - STUDENT_GET_ME endpoint
- ✅ `getById(id)` - STUDENT_GET_BY_ID endpoint
- ✅ Sử dụng contract keys và unwrapResponse

#### 4. `src/services/teacher/teacher.service.ts` (NEW)
- ✅ `getMe()` - TEACHER_GET_ME endpoint
- ✅ `getById(id)` - TEACHER_GET_BY_ID endpoint
- ✅ `getStats(teacherId)` - TEACHER_GET_STATS endpoint (note: dùng teacherId, không phải accountId)
- ✅ `getRevenue(teacherId, range?)` - TEACHER_GET_REVENUE endpoint (note: dùng teacherId, không phải accountId)
- ✅ Sử dụng contract keys và unwrapResponse

#### 5. `src/hooks/auth/useAuthBootstrap.ts` (NEW)
- ✅ 2-step hydration flow:
  1. `AUTH_ME` → lấy accountId + role
  2. `STUDENT_GET_ME` / `TEACHER_GET_ME` → lấy studentId / teacherId (theo role)
- ✅ Return: `{ isLoading, isReady, error, accountData, studentData, teacherData }`
- ✅ Tự động update authStore khi data arrive

#### 6. `src/components/auth/AuthBootstrapGate.tsx` (NEW)
- ✅ Client component wrapper cho auth bootstrap
- ✅ Public routes render ngay lập tức
- ✅ Protected routes chờ bootstrap complete
- ✅ Show loading state khi đang bootstrap

### ✅ TASK C — PATCH src/hooks/useAuth.ts

#### 1. `useLogin` (UPDATED)
- ✅ `onSuccess`: 
  - Set tokens
  - Set auth minimal vào authStore (accountId, role, email, fullName)
  - Invalidate `AUTH_ME` query để trigger bootstrap
  - Redirect theo role enum đã map (admin→/admin, teacher→/teacher/courses, student→/my-learning)

#### 2. `useCurrentUser` (UPDATED)
- ✅ QueryKey: Dùng `CONTRACT_KEYS.AUTH_ME` thay vì `["currentUser"]`
- ✅ `onSuccess`: Update authStore.setAuth khi data fetch thành công

#### 3. `useLogout` (UPDATED)
- ✅ Clear authStore (accountId, role, studentId, teacherId)
- ✅ Clear tokenStorage
- ✅ Clear queryClient cache

### ✅ TASK D — PATCH src/app/layout.tsx

- ✅ Thêm `<AuthBootstrapGate>` component bọc children
- ✅ Đặt trong `ReactQueryProvider` để có access đến React Query

### ✅ BONUS — PATCH src/services/auth/auth.service.ts

- ✅ Thêm contractKey vào `login()` và `getCurrentUser()` methods

---

## 🔄 Auth Bootstrap Flow

```
1. User login
   ↓
2. useLogin.onSuccess:
   - Set tokens
   - Set authStore minimal (accountId, role, email, fullName)
   - Invalidate AUTH_ME query
   ↓
3. AuthBootstrapGate (trong layout):
   - useAuthBootstrap() hook chạy
   ↓
4. Step 1: AUTH_ME query
   - Fetch account info
   - Update authStore.setAuth()
   ↓
5. Step 2 (conditional):
   - Nếu role = STUDENT → STUDENT_GET_ME → setStudentId()
   - Nếu role = TEACHER → TEACHER_GET_ME → setTeacherId()
   - Nếu role = ADMIN → skip (chỉ cần accountId)
   ↓
6. isReady = true → render children
```

---

## 📝 Important Notes

1. **Domain ID Separation:**
   - ❌ KHÔNG BAO GIỜ dùng `accountId` thay cho `studentId` hoặc `teacherId`
   - ✅ Luôn lấy `studentId` từ `STUDENT_GET_ME`
   - ✅ Luôn lấy `teacherId` từ `TEACHER_GET_ME`
   - ✅ Routes như `/teachers/:id/stats` phải dùng `teacherId` (từ authStore), KHÔNG phải `accountId`

2. **Contract Keys:**
   - ✅ Tất cả endpoints phải dùng `CONTRACT_KEYS.*` từ `contractKeys.ts`
   - ✅ Contract keys là source of truth, không được hardcode strings

3. **Role Mapping:**
   - Backend: `USER`, `CREATOR`, `ADMIN`
   - Internal FE: `STUDENT`, `TEACHER`, `ADMIN`
   - Luôn dùng `mapBackendRoleToInternal()` khi nhận role từ backend

4. **Error Handling:**
   - `AppError` giờ có field `contractKey` để debug
   - Request interceptor attach `X-Contract-Key` header nếu có

---

## ✅ Testing Checklist

- [ ] Test login flow → verify authStore được set
- [ ] Test student login → verify studentId được hydrate
- [ ] Test teacher login → verify teacherId được hydrate
- [ ] Test admin login → verify chỉ cần accountId
- [ ] Test logout → verify authStore clear
- [ ] Test refresh token flow → verify không mất domain IDs
- [ ] Test protected routes → verify AuthBootstrapGate show loading
- [ ] Test public routes → verify render ngay lập tức
- [ ] Test teacher stats route → verify dùng teacherId (không phải accountId)

---

## 🚀 Next Steps

1. Update các service khác để dùng contract keys
2. Tạo route guards (requireStudent, requireCreator, requireAdmin) sử dụng authStore
3. Update các hooks khác để dùng contract keys trong queryKey
4. Add testId attributes theo Interactive_Elements_List.md

---

**End of Summary**

