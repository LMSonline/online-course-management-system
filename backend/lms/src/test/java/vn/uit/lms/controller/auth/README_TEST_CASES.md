# Test Cases - Authentication & Account Management Module

## Tổng quan
Tài liệu này mô tả các test cases đã được triển khai cho module Auth và Account Management, bao gồm:
- **UC-01**: Đăng ký tài khoản
- **UC-02**: Đăng nhập
- **UC-03**: Khóa / Mở khóa tài khoản
- **UC-04**: Cập nhật thông tin cá nhân
- **UC-05**: Quên mật khẩu / Reset password

## Cấu trúc Test Files

### 1. AuthControllerTest.java
Test controller cho các chức năng xác thực và quản lý mật khẩu.

### 2. AccountControllerTest.java
Test controller cho các chức năng quản lý tài khoản và profile.

---

## Chi tiết Test Cases

## UC-01: Đăng ký tài khoản

### Test Class: `AuthControllerTest.AccountRegistrationTests`

| Test ID | Tên Test | Mô tả | Kết quả mong đợi |
|---------|----------|-------|------------------|
| UC-01.1 | `testRegisterStudent_Success` | Đăng ký thành công vai trò Học viên với email hợp lệ chưa tồn tại | - HTTP 201 CREATED<br>- Account status: PENDING_EMAIL<br>- Role: STUDENT<br>- Email verification được gửi |
| UC-01.2 | `testRegisterTeacher_Success_PendingApproval` | Đăng ký thành công vai trò Giảng viên | - HTTP 201 CREATED<br>- Account status: PENDING_APPROVAL<br>- Role: TEACHER |
| UC-01.3 | `testRegister_Fail_MissingRequiredFields` | Đăng ký thất bại do thiếu thông tin bắt buộc | - InvalidRequestException<br>- Message: "Email is required" |
| UC-01.4 | `testRegister_Fail_DuplicateEmail` | Đăng ký thất bại do trùng Email | - InvalidRequestException<br>- Message: "Email already exists" |
| UC-01.4 | `testRegister_Fail_DuplicateUsername` | Đăng ký thất bại do trùng Username | - InvalidRequestException<br>- Message: "Username already exists" |
| UC-01.5 | `testRegister_EmailVerificationSent` | Kiểm tra nhận email xác thực sau đăng ký | - Account được tạo<br>- Status: PENDING_EMAIL<br>- Email verification được trigger |

---

## UC-02: Đăng nhập

### Test Class: `AuthControllerTest.LoginTests`

| Test ID | Tên Test | Mô tả | Kết quả mong đợi |
|---------|----------|-------|------------------|
| UC-02.1 | `testLogin_Success_ActiveAccount` | Đăng nhập thành công với tài khoản active | - HTTP 200 OK<br>- Access token được trả về<br>- Refresh token được trả về |
| UC-02.2 | `testLogin_Fail_WrongUsername` | Đăng nhập thất bại do sai username | - InvalidRequestException<br>- Message: "Invalid username or password" |
| UC-02.2 | `testLogin_Fail_WrongPassword` | Đăng nhập thất bại do sai password | - InvalidRequestException<br>- Message: "Invalid username or password" |
| UC-02.3 | `testLogin_Fail_AccountSuspended` | Đăng nhập thất bại do tài khoản bị khóa | - InvalidRequestException<br>- Message: "Account is suspended" |
| UC-02.4 | `testLogin_Fail_TeacherNotApproved` | Đăng nhập thất bại do giảng viên chưa được duyệt | - InvalidRequestException<br>- Message: "Account is pending approval" |
| UC-02.5 | `testLogin_RememberMe_RefreshTokenIssued` | Kiểm tra tính năng ghi nhớ đăng nhập | - Refresh token được cấp<br>- Token có thể dùng để refresh |
| UC-02 | `testLogin_WithEmail` | Đăng nhập bằng email thay vì username | - HTTP 200 OK<br>- Đăng nhập thành công |

### Additional Authentication Tests

| Test | Mô tả | Kết quả mong đợi |
|------|-------|------------------|
| `testVerifyEmail_Success` | Xác thực email thành công | - HTTP 200 OK<br>- Email được verify |
| `testVerifyEmail_InvalidToken` | Xác thực email với token không hợp lệ | - InvalidRequestException |
| `testRefreshToken_Success` | Refresh access token thành công | - Token mới được cấp |
| `testLogout_Success` | Đăng xuất thành công | - HTTP 200 OK<br>- Refresh token bị revoke |
| `testGetCurrentUserInfo_Success` | Lấy thông tin user hiện tại | - HTTP 200 OK<br>- Thông tin user đầy đủ |

---

## UC-03: Khóa / Mở khóa tài khoản

### Test Class: `AccountControllerTest.LockUnlockAccountTests`

| Test ID | Tên Test | Mô tả | Kết quả mong đợi |
|---------|----------|-------|------------------|
| UC-03.1 | `testSuspendAccount_Success` | Admin khóa tài khoản user (Active → Suspended) | - HTTP 200 OK<br>- Status: SUSPENDED<br>- Reason được ghi nhận |
| UC-03.2 | `testUnlockAccount_Success` | Admin mở khóa tài khoản (Suspended → Active) | - HTTP 200 OK<br>- Status: ACTIVE<br>- Reason được ghi nhận |
| UC-03.3 | `testSuspendAccount_UserCannotLogin` | Kiểm tra user bị khóa không thể đăng nhập | - Account được suspend<br>- Login bị block (tested in AuthService) |
| UC-03.4 | `testSuspendAccount_CannotSuspendAdmin` | Admin cố tình khóa tài khoản Admin khác | - InvalidRequestException<br>- Message: "Cannot suspend admin account" |
| UC-03 | `testSuspendAccount_AccountNotFound` | Khóa tài khoản không tồn tại | - ResourceNotFoundException |
| UC-03 | `testUnlockAccount_AccountNotSuspended` | Mở khóa tài khoản không bị khóa | - InvalidRequestException |
| UC-03 | `testDeactivateAccount_Success` | Deactivate tài khoản | - Status: DEACTIVATED |
| UC-03 | `testChangeAccountStatus_Success` | Thay đổi status tài khoản | - Status được cập nhật |

---

## UC-04: Cập nhật thông tin cá nhân

### Test Class: `AccountControllerTest.UpdateProfileTests`

| Test ID | Tên Test | Mô tả | Kết quả mong đợi |
|---------|----------|-------|------------------|
| UC-04.1 | `testUpdateProfile_Success` | Cập nhật thông tin hợp lệ (Tên, Bio, SĐT) | - HTTP 200 OK<br>- Thông tin được cập nhật<br>- FullName, Bio, Phone đúng |
| UC-04.2 | `testUpdateProfile_InvalidPhoneNumber` | Cập nhật SĐT chứa chữ | - InvalidRequestException<br>- Message về phone format |
| UC-04.2 | `testUpdateProfile_InvalidEmail` | Cập nhật email sai định dạng | - InvalidRequestException<br>- Message về email format |
| UC-04.3 | `testGetProfile_AfterUpdate` | Kiểm tra hiển thị thông tin sau cập nhật | - HTTP 200 OK<br>- Dữ liệu mới được hiển thị |
| UC-04 | `testUploadAvatar_Success` | Upload avatar thành công | - HTTP 200 OK<br>- Avatar URL được trả về |
| UC-04 | `testUploadAvatar_InvalidFileType` | Upload file không phải ảnh | - InvalidRequestException |
| UC-04 | `testUpdateProfile_NameTooLong` | Cập nhật tên quá dài | - InvalidRequestException |
| UC-04 | `testGetProfile_NotAuthenticated` | Get profile khi chưa đăng nhập | - UnauthorizedException |
| UC-04 | `testUpdateProfile_UpdateBioOnly` | Cập nhật chỉ bio | - HTTP 200 OK<br>- Bio được update |

---

## UC-05: Quên mật khẩu / Reset Password

### Test Class: `AuthControllerTest.ForgotPasswordTests`

| Test ID | Tên Test | Mô tả | Kết quả mong đợi |
|---------|----------|-------|------------------|
| UC-05.1 | `testForgotPassword_Success_ValidEmail` | Yêu cầu reset password với email đúng | - HTTP 200 OK<br>- Email reset được gửi |
| UC-05.2 | `testForgotPassword_EmailNotFound` | Yêu cầu reset với email không tồn tại | - ResourceNotFoundException<br>- Message: "Email not found" |
| UC-05.3 | `testResetPassword_Success_ValidToken` | Đặt lại mật khẩu thành công qua token | - HTTP 200 OK<br>- Password được reset |
| UC-05.4 | `testResetPassword_Fail_ExpiredToken` | Sử dụng token đã hết hạn | - InvalidRequestException<br>- Message: "Reset token has expired" |
| UC-05.4 | `testResetPassword_Fail_InvalidToken` | Sử dụng token không hợp lệ | - InvalidRequestException<br>- Message: "Invalid reset token" |
| UC-05 | `testResetPassword_Fail_WeakPassword` | Reset password với mật khẩu yếu | - InvalidRequestException<br>- Message về password requirements |

---

## Additional Admin Tests

### Test Class: `AccountControllerTest.AdminAccountManagementTests`

| Test | Mô tả | Kết quả mong đợi |
|------|-------|------------------|
| `testGetAccountById_Success` | Admin lấy thông tin account theo ID | - HTTP 200 OK<br>- Account details |
| `testGetAccountById_NotFound` | Admin lấy account không tồn tại | - ResourceNotFoundException |
| `testDeleteAccount_Success` | Admin xóa account | - HTTP 204 NO CONTENT |
| `testApproveTeacherAccount_Success` | Admin duyệt tài khoản giảng viên | - Status: ACTIVE<br>- Teacher approved |
| `testRejectTeacherAccount_Success` | Admin từ chối tài khoản giảng viên | - Status: REJECTED<br>- Reason được lưu |

---

## Cách chạy tests

### Chạy tất cả tests trong module auth:
```bash
./gradlew test --tests "vn.uit.lms.controller.auth.*Test"
```

### Chạy test cho AuthController:
```bash
./gradlew test --tests "vn.uit.lms.controller.auth.AuthControllerTest"
```

### Chạy test cho AccountController:
```bash
./gradlew test --tests "vn.uit.lms.controller.auth.AccountControllerTest"
```

### Chạy một test case cụ thể:
```bash
./gradlew test --tests "vn.uit.lms.controller.auth.AuthControllerTest.testLogin_Success_ActiveAccount"
```

---

## Framework & Libraries sử dụng

- **JUnit 5**: Testing framework
- **Mockito**: Mocking framework
- **MockitoExtension**: JUnit 5 extension cho Mockito
- **Spring Boot Test**: Testing utilities

---

## Test Coverage

### AuthControllerTest
- **Total Test Cases**: 27 tests
- **Coverage**:
  - UC-01 (Đăng ký): 6 tests
  - UC-02 (Đăng nhập): 7 tests
  - UC-05 (Reset password): 6 tests
  - Additional: 8 tests

### AccountControllerTest
- **Total Test Cases**: 24 tests
- **Coverage**:
  - UC-03 (Lock/Unlock): 8 tests
  - UC-04 (Update profile): 9 tests
  - Admin management: 5 tests
  - Additional: 2 tests

### Tổng cộng: 51 test cases

---

## Notes

1. Tất cả tests đều sử dụng **mocking** để tách biệt controller layer khỏi service layer
2. Tests cover cả **happy path** và **error scenarios**
3. Assertions bao gồm:
   - HTTP status codes
   - Response body content
   - Exception types và messages
   - Service method invocations (verify)
4. Tests tuân theo **AAA pattern** (Arrange-Act-Assert)
5. Tên test rõ ràng, mô tả chính xác behavior đang test

---

## Tác giả
Test cases được tạo dựa trên tài liệu đặc tả Use Case của hệ thống LMS.

**Ngày tạo**: January 13, 2026

