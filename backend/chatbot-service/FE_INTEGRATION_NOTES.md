# Frontend Integration Notes

## Summary

The chatbot-service is now ready for frontend integration. All changes have been made to support frontend calls while maintaining backward compatibility.

---

## Frontend Origin(s)

**Default allowed origins:**
- `http://localhost:3000` (Next.js default)
- `http://localhost:5173` (Vite default)

**Configuration:**
Set `CORS_ALLOWED_ORIGINS` in `.env` to customize (comma-separated):
```bash
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://yourdomain.com
```

---

## Endpoint Contract

### POST `/api/v1/chat/messages`

**Request (minimal):**
```json
{
  "text": "What is Python?",
  "current_course_id": "course_python_basic"
}
```

**Request (with session context):**
```json
{
  "text": "What is Python?",
  "session_id": "session_abc123",
  "user_id": "user123",
  "current_course_id": "course_python_basic",
  "language": "en",
  "lesson_id": "lesson_001"
}
```

**Response:**
```json
{
  "reply": "Python is a high-level programming language...",
  "session_id": "session_abc123"
}
```

**Notes:**
- `session_id` and `user_id` are **optional** - if not provided, the service generates defaults
- `session_id` is returned in response so frontend can persist it for conversation continuity
- All other fields (`current_course_id`, `language`, `lesson_id`) are optional

---

## Required Headers

### For Development (no auth required)
```http
Content-Type: application/json
```

### For Production (if `CHATBOT_INTERNAL_API_KEY` is set)
```http
Content-Type: application/json
X-API-KEY: your-secret-api-key
```

**Note:** If `CHATBOT_INTERNAL_API_KEY` is not set in `.env`, no authentication is required (dev mode).

---

## Example Request/Response

### Minimal Request (cURL)
```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "What is Python?",
    "current_course_id": "course_python_basic"
  }'
```

### Response
```json
{
  "reply": "Python is a high-level programming language known for its simplicity and readability. It was created by Guido van Rossum and first released in 1991...",
  "session_id": "session_a1b2c3d4e5f6"
}
```

### With API Key (Production)
```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: your-secret-api-key" \
  -d '{
    "text": "What is Python?",
    "current_course_id": "course_python_basic"
  }'
```

---

## Health Check

### GET `/health`

**Response:**
```json
{
  "status": "ok",
  "service": "chatbot-service",
  "demo_mode": false,
  "llm_provider": "llama3",
  "llm_configured": true
}
```

Use this endpoint to verify:
- Service is running
- Demo mode is disabled
- LLM is properly configured

---

## Environment Variables Required

**Minimum for frontend integration:**
```bash
DEMO_MODE=false
LLM_PROVIDER=llama3
LLAMA3_API_BASE=https://api.groq.com/openai/v1
LLAMA3_API_KEY=your-groq-api-key
LLAMA3_MODEL_NAME=llama-3-8b-instruct
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

**Optional (for production):**
```bash
CHATBOT_INTERNAL_API_KEY=your-secret-api-key
```

See `README.md` for full environment variable documentation.

---

## Changes Made

1. ✅ **DEMO_MODE** now defaults to `False` and respects `.env` configuration
2. ✅ **Chat endpoint** accepts optional `session_id` and `user_id` (generates defaults if missing)
3. ✅ **CORS** fixed to use explicit origins instead of wildcard (supports credentials)
4. ✅ **API Key authentication** added (optional, only enforced if `CHATBOT_INTERNAL_API_KEY` is set)
5. ✅ **Health endpoint** updated with `demo_mode` and `llm_provider` status
6. ✅ **README** updated with exact env vars and example curl commands

---

## Testing

1. **Start the service:**
   ```bash
   cd backend/chatbot-service
   uvicorn app.main:app --reload --port 8003
   ```

2. **Check health:**
   ```bash
   curl http://localhost:8003/health
   ```

3. **Test chat endpoint:**
   ```bash
   curl -X POST "http://localhost:8003/api/v1/chat/messages" \
     -H "Content-Type: application/json" \
     -d '{"text": "Hello"}'
   ```

4. **Verify CORS:** Open browser console on frontend and make a fetch request to verify CORS headers are present.

