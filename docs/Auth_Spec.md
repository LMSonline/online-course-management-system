Auth Spec (accountId ≠ studentId ≠ teacherId)
1) Các ID cần giữ trong FE state

accountId: ID danh tính đăng nhập (auth/account service)

studentId: ID domain học viên (dou service)

teacherId: ID domain giảng viên (dou service)

role: USER | CREATOR | ADMIN (tuỳ dự án bạn set)

Rule: FE chỉ dùng accountId cho auth/me. Còn studentId/teacherId phải lấy qua profile.

2) App bootstrap (hydrate) — điểm khác chính

Khi app load (hoặc refresh tab):

Nếu không có session → authState = guest

Nếu có session (access token hoặc refresh cookie):

Call AUTH_ME (hoặc /accounts/me) để lấy:

accountId, role, email, fullName

Sau đó call profile để lấy domain ids:

Nếu role có student → STUDENT_GET_ME trả studentId

Nếu role có teacher → TEACHER_GET_ME trả teacherId

Lưu vào AuthContext:

{ accountId, role, studentId?, teacherId? }

Đây là khác biệt quan trọng: auth hydrate = 2 bước (me → profile), không phải 1.

3) Login flow (Guest → Logged-in)

Khi submit Login:

AUTH_LOGIN → nhận accessToken (+ refreshToken cookie hoặc refreshToken string)

Call AUTH_ME để lấy accountId + role

Call profile theo role:

STUDENT_GET_ME để lấy studentId (nếu USER/student)

TEACHER_GET_ME để lấy teacherId (nếu CREATOR)

Navigate:

nếu có next → next

else:

USER → /my-learning

CREATOR → /teacher/courses

ADMIN → /admin

4) Attach token / refresh token
Attach token

Mọi API cần auth: thêm header
Authorization: Bearer <accessToken>

Refresh on 401 (khác điểm nhỏ)

Nếu request bị 401:

call AUTH_REFRESH

update accessToken

retry request 1 lần

Nếu refresh fail:

clear auth state

redirect /login?next=<currentPath>

Sau refresh thành công không cần fetch lại studentId/teacherId mỗi lần.
Chỉ fetch lại khi:

app boot,

login,

role change (admin update role),

hoặc profile endpoint trả 404 (chưa tạo domain record).

5) Route guards (dựa trên role + domain id)
requireAuth

cần accessToken hợp lệ (hoặc refresh ok)

và AUTH_ME đã hydrate xong

requireRole('creator')

role == CREATOR

và teacherId != null

nếu null: redirect /teachers/me hoặc show “Complete teacher profile” (tuỳ rule)

requireRole('user')

role == USER

và studentId != null

nếu null: show error “Student profile missing” + retry STUDENT_GET_ME

enrolledGuard (cho /learn/:courseSlug/*)

Nếu API trả 403/404 vì chưa enroll:

redirect /courses/:slug hoặc show CTA enroll

6) API calls phải dùng đúng ID (tránh 500/401)

Các endpoint dạng:

/students/{studentId}/enrollments → bắt buộc lấy studentId từ STUDENT_GET_ME

/teachers/{teacherId}/stats|revenue → lấy teacherId từ TEACHER_GET_ME

Tuyệt đối không dùng accountId thay cho studentId/teacherId.

7) Logout

call AUTH_LOGOUT (nếu có)

clear accessToken

clear AuthContext (accountId/studentId/teacherId/role)

clear cache (React Query)

redirect /