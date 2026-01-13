# Guest Chatbot Support - Changes Summary

## Overview

The chatbot feature has been updated to work for guests (no login required). All authentication dependencies have been removed from the chatbot UI.

## Files Changed

### 1. `frontend/src/core/components/public/AssistantPopup.tsx`

**Changes:**
- ✅ Removed `useAuth()` hook import and usage
- ✅ Removed dependency on authenticated user
- ✅ Added `getOrCreateGuestId()` function to generate stable guest user_id
- ✅ Updated `getUserId()` to use guest ID instead of auth user
- ✅ Guest ID format: `guest_<uuid>` stored in localStorage key `"chatbot_guest_id"`
- ✅ Session ID already persisted in localStorage key `"chatbot_session_id"`

**Implementation Details:**
- Guest ID is generated once and persisted in localStorage
- Same guest ID is reused across sessions (stable identity)
- Session ID is managed the same way (read from localStorage, save when returned)
- No changes to UI/UX layout or styling
- Loading and error states already implemented

## Guest Identity System

### Guest User ID
- **Storage Key:** `"chatbot_guest_id"`
- **Format:** `guest_<uuid>` (e.g., `guest_123e4567-e89b-12d3-a456-426614174000`)
- **Generation:** Created once on first use, then reused
- **Persistence:** Stored in browser localStorage

### Session ID
- **Storage Key:** `"chatbot_session_id"`
- **Format:** Backend-generated session ID
- **Management:** 
  - Read from localStorage when sending message
  - Saved to localStorage when backend returns new session_id

## API Request Format

When sending a message, the component calls:

```typescript
POST {CHATBOT_BASE_URL}/api/v1/chat/messages
Body: {
  text: string,
  session_id?: string,  // From localStorage or undefined
  user_id: string       // guest_<uuid> from localStorage
}
```

## Verification

### Network Request Check

**Expected behavior:**
1. ✅ ONE request to `{CHATBOT_BASE_URL}/api/v1/chat/messages`
2. ✅ ZERO requests to `/api/v1/auth/me`
3. ✅ ZERO requests to any auth endpoints

### Testing Steps

1. **Open browser in guest mode (no login):**
   - Navigate to the frontend URL
   - Do NOT log in
   - Open DevTools → Network tab

2. **Open chatbot:**
   - Click the bot icon in navbar
   - Popup should open

3. **Send a message:**
   - Type a message (e.g., "Hello")
   - Click "Send"
   - Observe network requests

4. **Verify network calls:**
   - Should see: `POST /api/v1/chat/messages` to chatbot-service
   - Should NOT see: `GET /api/v1/auth/me` or any auth calls
   - Check request payload contains `user_id: "guest_..."` and `session_id` (if exists)

5. **Verify functionality:**
   - User message appears immediately
   - Typing indicator shows
   - Bot reply appears
   - No errors in console

6. **Verify persistence:**
   - Close and reopen popup
   - Send another message
   - Same guest_id should be used (check localStorage)
   - Session should continue (if backend supports it)

### localStorage Contents

After using the chatbot, localStorage should contain:
```javascript
{
  "chatbot_guest_id": "guest_123e4567-e89b-12d3-a456-426614174000",
  "chatbot_session_id": "session_abc123..."  // If backend returned one
}
```

## Code Changes Summary

### Removed
- ❌ `import { useAuth } from "@/hooks/useAuth"`
- ❌ `const { user } = useAuth()`
- ❌ `user?.accountId?.toString()` logic

### Added
- ✅ `getOrCreateGuestId()` function
- ✅ `GUEST_ID_STORAGE_KEY` constant
- ✅ `generateUUID()` helper function
- ✅ Guest ID generation and persistence logic

### Unchanged
- ✅ UI layout and styling
- ✅ Loading states (typing indicator)
- ✅ Error handling
- ✅ Session ID management
- ✅ Message display
- ✅ Quick prompt buttons

## Backward Compatibility

- ✅ Existing authenticated users: The chatbot will now use guest IDs for all users (including logged-in users)
- ✅ If you want authenticated users to use their account ID, that would require a separate change to check auth status and use account ID when available
- ✅ For now, all users (guests and authenticated) use guest IDs for chatbot

## Notes

- The chatbot service (`chatbot.service.ts`) and API client (`chatbotAxios.ts`) were not modified - they have no auth dependencies
- No changes to global auth flows
- No changes to navbar or other components
- Only the AssistantPopup component was modified

