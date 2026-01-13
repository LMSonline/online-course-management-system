# Chatbot Frontend Integration Summary

## Overview

The chatbot UI has been successfully wired to the backend chatbot-service. Users can now send messages and receive bot replies through the existing AssistantPopup component.

## Files Added

1. **`src/lib/api/chatbotAxios.ts`**
   - Dedicated axios client for chatbot API
   - Automatically adds `X-API-KEY` header if configured
   - Base URL from `ENV.CHATBOT.BASE_URL`

2. **`src/services/chatbot/chatbot.types.ts`**
   - TypeScript types for chatbot requests/responses
   - `ChatSendRequest`: Request payload interface
   - `ChatSendResponse`: Response interface

3. **`src/services/chatbot/chatbot.service.ts`**
   - Service layer for chatbot API calls
   - `sendMessage()`: Sends message to backend and returns reply

## Files Modified

1. **`src/lib/env.ts`**
   - Added `ENV.CHATBOT` configuration object
   - `BASE_URL`: From `NEXT_PUBLIC_CHATBOT_API_BASE_URL`
   - `API_KEY`: From `NEXT_PUBLIC_CHATBOT_API_KEY` (optional)

2. **`src/core/components/public/AssistantPopup.tsx`**
   - Integrated with `chatbotService.sendMessage()`
   - Added loading state with typing indicator
   - Added error handling with inline error messages
   - Session persistence via localStorage (`chatbot_session_id`)
   - User ID from `useAuth()` hook (falls back to "anonymous")
   - Disabled input/send button while loading

3. **`README.md`**
   - Added environment variables section with `.env.local` example

## Features Implemented

✅ **Environment Configuration**
- `NEXT_PUBLIC_CHATBOT_API_BASE_URL` (required)
- `NEXT_PUBLIC_CHATBOT_API_KEY` (optional)

✅ **API Client**
- Separate axios instance for chatbot service
- Automatic `X-API-KEY` header injection when configured

✅ **Service Layer**
- Typed service following existing patterns
- Clean separation of concerns

✅ **UI Integration**
- Real-time message sending
- Loading states with typing indicator
- Error handling with user-friendly messages
- Session persistence across page reloads
- User authentication integration

✅ **Session Management**
- Reads `session_id` from localStorage
- Backend generates new session if missing
- Persists returned `session_id` for conversation continuity

✅ **User Identification**
- Uses authenticated user ID from `useAuth()` hook
- Falls back to "anonymous" for unauthenticated users

## Testing

### Prerequisites

1. **Backend must be running:**
   ```bash
   cd backend/chatbot-service
   uvicorn app.main:app --reload --port 8003
   ```

2. **Environment variables set:**
   Create `frontend/.env.local`:
   ```bash
   NEXT_PUBLIC_CHATBOT_API_BASE_URL=http://localhost:8003
   NEXT_PUBLIC_CHATBOT_API_KEY=super-secret-key  # Optional
   ```

### Test Flow

1. **Start frontend:**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open browser:** Navigate to `http://localhost:3000`

3. **Test chatbot:**
   - Click the bot icon in the navbar (top right)
   - Popup should open with initial greeting
   - Type a message and click "Send"
   - Should see:
     - User message appears immediately
     - Typing indicator (animated dots)
     - Bot reply appears after response
   - Send another message to verify session persistence

4. **Verify session persistence:**
   - Close and reopen the popup
   - Send a message
   - Should maintain conversation context (if backend supports it)

### Expected Behavior

- ✅ User message appears immediately
- ✅ Send button disabled while loading
- ✅ Typing indicator shows during request
- ✅ Bot reply appears after successful response
- ✅ Error message shows if request fails
- ✅ Session ID persisted in localStorage
- ✅ Quick prompt buttons still work

## API Contract

**Endpoint:** `POST {CHATBOT_BASE_URL}/api/v1/chat/messages`

**Request:**
```json
{
  "text": "Hello",
  "session_id": "optional",
  "user_id": "optional",
  "current_course_id": "optional"
}
```

**Response:**
```json
{
  "reply": "Hello! How can I help you?",
  "session_id": "session_abc123"
}
```

**Headers:**
- `Content-Type: application/json`
- `X-API-KEY: {key}` (if configured)

## Notes

- The navbar button logic was not modified - it only opens/closes the popup as before
- All existing UI styling and layout preserved
- Quick prompt buttons still functional
- Error handling is non-blocking (shows error but doesn't crash)
- Session ID is stored in browser localStorage for persistence

