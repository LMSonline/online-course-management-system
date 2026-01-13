# Frontend Chatbot Integration Audit Report

## Executive Summary

**Status: Frontend requires additional work before integration**

The frontend has a **UI component structure** for the chatbot (AssistantPopup), but it is **completely disconnected from the backend API**. The chatbot UI only manages local state and does not make any API calls. A dedicated service layer and async handling need to be implemented before integration with the chatbot-service backend.

---

## Findings

### 1. Button Click Behavior

**Status: ✅ UI state only, no API call**

- **Location:** `LearnerNavbar.tsx:179` - "Open AI study assistant" button
- **Action:** Calls `openPopup()` from `useAssistantStore` (Zustand store)
- **Store behavior:** Only sets `open: true` in local state (`store.ts:13`)
- **Result:** Opens the `AssistantPopup` component, but **no API call is triggered**

### 2. Chatbot UI Component

**Status: ⚠️ Local state only, no backend integration**

- **Component:** `AssistantPopup.tsx` (rendered via `AssistantWidget.tsx`)
- **Current behavior:**
  - Form submission (`handleSubmit` at line 29) only updates local `messages` state
  - No API calls to chatbot backend
  - Messages are stored in component state only (lost on unmount)
- **UI features present:**
  - Chat message display
  - Input form with textarea
  - Quick prompt buttons
  - Close functionality
- **Missing:**
  - No loading states during API calls
  - No error handling for failed requests
  - No async/await or promise handling
  - No connection to backend service

### 3. Service Layer

**Status: ❌ No chatbot service exists**

- **Search results:** No files found matching `chatbot`, `chat`, or `assistant` in `frontend/src/services/`
- **Pattern observed:** Other services follow a consistent pattern:
  - Example: `course.service.ts` uses `axiosClient` with typed request/response
  - Services are organized in `services/` directory with `.service.ts` naming
- **Required:** A new `chatbot.service.ts` (or `assistant.service.ts`) needs to be created following the existing service pattern

### 4. API Base URL Configuration

**Status: ✅ Configurable via environment variables**

- **Location:** `lib/env.ts`
- **Configuration:**
  - `NEXT_PUBLIC_API_BASE_URL` - Base URL for API (defaults to empty string)
  - `NEXT_PUBLIC_API_VERSION` - API version path (defaults to `"api/v1"`)
  - Combined into `ENV.API.BASE_API_URL` getter
- **Usage:** All services use `axiosClient` which is configured with `baseURL: ENV.API.BASE_API_URL`
- **Note:** This is configured for the main LMS API. The chatbot-service runs on a different port (8003) and would need:
  - A separate environment variable (e.g., `NEXT_PUBLIC_CHATBOT_API_BASE_URL`)
  - Or a separate axios client instance for chatbot endpoints
  - Or the chatbot-service should be proxied through the main LMS API

### 5. Async Response Handling

**Status: ❌ Not implemented**

- **Loading states:** No loading indicators in `AssistantPopup`
- **Error handling:** No try/catch blocks, no error state management
- **Async operations:** No `async/await` or promise handling in the component
- **Response processing:** No code to handle API responses or update UI accordingly
- **Required additions:**
  - Loading spinner/indicator while waiting for API response
  - Error message display for failed requests
  - Success handling to display bot responses
  - Optimistic UI updates or proper state management

### 6. Authentication Headers

**Status: ✅ Prepared but not used**

- **Location:** `lib/api/axios.ts`
- **Implementation:**
  - Request interceptor automatically adds `Authorization: Bearer {token}` header (line 38-40)
  - Token retrieved from `tokenStorage.getAccessToken()`
  - Automatic token refresh on 401 errors (lines 57-106)
- **Status:** Authentication infrastructure is ready, but **not being used** because no API calls are made from the chatbot UI
- **Note:** The chatbot-service backend currently has **no authentication** (per backend audit), so tokens may not be required initially, but the infrastructure is in place

### 7. Additional Observations

- **State Management:** Uses Zustand store (`useAssistantStore`) for popup open/close state - this is appropriate
- **UI Design:** Well-designed chat interface with proper styling and responsive layout
- **Component Structure:** Clean separation between `AssistantWidget` (container) and `AssistantPopup` (UI)
- **Missing Integration Points:**
  - No session management (backend expects `session_id` and `user_id`)
  - No message history persistence
  - No connection to course context (`current_course_id` parameter)

---

## Conclusion

**"Frontend requires additional work before integration"**

The frontend has a **solid UI foundation** for the chatbot feature, but it is **not ready for backend integration** because:

1. **No API calls** - The chatbot UI only manages local state, no backend communication
2. **No service layer** - Missing `chatbot.service.ts` to handle API requests
3. **No async handling** - No loading states, error handling, or response processing
4. **API configuration gap** - Chatbot-service runs on port 8003, separate from main LMS API
5. **Missing session management** - Backend requires `session_id` and `user_id`, but frontend doesn't track these

**Required work before integration:**
1. Create `services/chatbot/chatbot.service.ts` with methods for:
   - `sendMessage(sessionId, userId, text, options)` → calls `POST /api/v1/chat/messages`
   - `getSessions(userId)` → calls `GET /api/v1/chat/sessions`
   - `getSessionDetail(sessionId)` → calls `GET /api/v1/chat/sessions/{id}`
2. Configure chatbot API base URL (separate from LMS API or via proxy)
3. Add async/await handling in `AssistantPopup` component
4. Implement loading states (spinner while waiting for response)
5. Implement error handling (display error messages to user)
6. Add session management (create/retrieve session IDs)
7. Integrate user context (get current user ID from auth system)
8. Optionally add course context (track current course for `current_course_id` parameter)

---

## Recommendations

1. **For immediate integration:** Create the service layer and wire up basic API calls to the chatbot-service
2. **For production:** Add proper session management, error boundaries, and retry logic
3. **API architecture:** Consider proxying chatbot-service through the main LMS API to avoid CORS issues and centralize authentication
4. **User experience:** Add typing indicators, message timestamps, and conversation history persistence

