# API Config + Refresh Flow Patch Summary

**Date:** 2025-01-XX  
**Purpose:** Fix baseURL duplication và chuẩn hóa refresh flow

---

## 📋 Files Changed

### 1. `src/lib/env.ts` (UPDATED)

**Problem:** 
- `.env.local` có `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1`
- `env.ts` build `BASE_API_URL = BASE_URL + "/" + VERSION` => double `/api/v1`

**Solution:**
- Trim trailing slash từ `BASE_URL`
- Trim leading slash từ `VERSION`
- Build `BASE_API_URL` với logic: `${BASE_URL}/${VERSION}` khi VERSION exists, else `BASE_URL`
- Ensure không có double slashes

**Diff:**
```diff
export const ENV = {
  API: {
    BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "",
    VERSION: process.env.NEXT_PUBLIC_API_VERSION ?? "api/v1",

    get BASE_API_URL() {
      if (!this.BASE_URL) {
        console.warn("Missing NEXT_PUBLIC_API_BASE_URL");
-       return "";
+       return "";
      }
+
+     // Trim trailing slash from BASE_URL
+     let baseUrl = this.BASE_URL.trim().replace(/\/+$/, "");
+     
+     // Trim leading slash from VERSION
+     let version = this.VERSION.trim().replace(/^\/+/, "");
+
+     // Build final URL
+     if (version) {
+       // Ensure no double slashes
+       const url = `${baseUrl}/${version}`;
+       return url.replace(/([^:]\/)\/+/g, "$1");
+     }
+     
+     // If no version, return baseUrl (ensure no trailing slash)
+     return baseUrl;
-     return `${this.BASE_URL}/${this.VERSION}`;
    },
  },
};
```

---

### 2. `src/lib/api/axios.ts` (UPDATED)

**Changes:**

#### a) Simplify `getBaseURL()` function
- Remove logic tự động thêm `/api/v1` (đã handle trong `env.ts`)
- Chỉ return `ENV.API.BASE_API_URL`

**Diff:**
```diff
- // Ensure baseURL includes /api/v1
- const getBaseURL = () => {
-   const baseURL = ENV.API.BASE_API_URL;
-   // If baseURL doesn't end with /api/v1, ensure it does
-   if (!baseURL.endsWith("/api/v1")) {
-     // If it ends with /api, add /v1, otherwise add /api/v1
-     if (baseURL.endsWith("/api")) {
-       return `${baseURL}/v1`;
-     }
-     return baseURL.endsWith("/") ? `${baseURL}api/v1` : `${baseURL}/api/v1`;
-   }
-   return baseURL;
- };
+ // Get baseURL from ENV (already handles /api/v1 correctly)
+ const getBaseURL = () => {
+   return ENV.API.BASE_API_URL;
+ };
```

#### b) Update refresh interceptor payload
- Add `deviceInfo` và `ipAddress` vào refresh payload
- Match với logic trong `auth.service.ts`

**Diff:**
```diff
      try {
        const refreshToken = tokenStorage.getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token");

+       // Get device info and IP address (same as auth.service)
+       const getDeviceInfo = (): string => {
+         return typeof navigator !== "undefined" ? navigator.userAgent : "unknown";
+       };
+
+       const getDefaultIpAddress = (): string => {
+         return "127.0.0.1";
+       };
+
+       // Refresh token payload with deviceInfo and ipAddress
+       const refreshPayload = {
+         refreshToken,
+         deviceInfo: getDeviceInfo(),
+         ipAddress: getDefaultIpAddress(),
+       };
+
-       // Use full path /api/v1/auth/refresh (baseURL already includes /api/v1)
-       const res = await refreshClient.post("/auth/refresh", {
-         refreshToken,
-       });
+       // Use /auth/refresh (baseURL already includes /api/v1)
+       const res = await refreshClient.post("/auth/refresh", refreshPayload);

        const { accessToken, refreshToken: newRefreshToken } = res.data.data;
```

---

### 3. `.env.local` (CREATE - Manual)

**Note:** File này không được commit vào git (nằm trong .gitignore). User cần tạo manually.

**Content:**
```env
# API Configuration
# Base URL without version (e.g., http://localhost:8080)
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080

# API Version (e.g., api/v1)
# Will be appended to BASE_URL: http://localhost:8080/api/v1
NEXT_PUBLIC_API_VERSION=api/v1
```

**Before (WRONG):**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

**After (CORRECT):**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_API_VERSION=api/v1
```

---

## ✅ Verification

### Query Keys / ContractKey Alignment

✅ **Already Fixed:**
- `useCurrentUser` trong `src/hooks/useAuth.ts` đã dùng `CONTRACT_KEYS.AUTH_ME`
- `authService.getCurrentUser` đã có `contractKey: CONTRACT_KEYS.AUTH_ME`
- `authService.login` đã có `contractKey: CONTRACT_KEYS.AUTH_LOGIN`

✅ **No instances of `["currentUser"]` found** - đã được replace hết

---

## 🔄 Refresh Flow

**Before:**
```typescript
// axios.ts refresh interceptor
const res = await refreshClient.post("/auth/refresh", {
  refreshToken,
});
```

**After:**
```typescript
// axios.ts refresh interceptor
const refreshPayload = {
  refreshToken,
  deviceInfo: getDeviceInfo(), // navigator.userAgent
  ipAddress: getDefaultIpAddress(), // "127.0.0.1"
};
const res = await refreshClient.post("/auth/refresh", refreshPayload);
```

**Consistent với `auth.service.ts`:**
- `auth.service.refreshToken()` cũng enrich với `deviceInfo` và `ipAddress`
- Giờ axios interceptor cũng match behavior này

---

## 📝 Testing Checklist

- [ ] Update `.env.local` với format mới (BASE_URL không có /api/v1)
- [ ] Verify `ENV.API.BASE_API_URL` = `http://localhost:8080/api/v1` (không duplicate)
- [ ] Test login flow → verify không có double `/api/v1` trong requests
- [ ] Test refresh token flow → verify payload có `deviceInfo` và `ipAddress`
- [ ] Test với các edge cases:
  - BASE_URL có trailing slash: `http://localhost:8080/`
  - VERSION có leading slash: `/api/v1`
  - VERSION empty (should return BASE_URL only)

---

## 🚀 Next Steps

1. **User action required:** Tạo `.env.local` với format mới
2. Test tất cả API calls để verify baseURL đúng
3. Monitor refresh token flow trong production

---

**End of Summary**

