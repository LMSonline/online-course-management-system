# Chatbot Service - Frontend Integration Audit Report

## Executive Summary

**Status: Mock only / missing API key / not production-ready**

The chatbot service is currently configured in **DEMO_MODE** with hardcoded responses and no real LLM provider configured. While the API structure is well-designed and CORS is properly configured for frontend access, the service requires configuration changes and API key setup before production use.

---

## Findings

### 1. API Endpoints Structure

**Status: ✅ Well-defined**

The service exposes a comprehensive REST API with the following endpoints:

**Chat Endpoints:**
- `POST /api/v1/chat/messages` - Main chat message handler
  - Request: `{session_id, user_id, text, current_course_id?, debug?, language?, lesson_id?, exam_date?, free_days_per_week?, completed_lessons?, top_k?, score_threshold?}`
  - Response: `{reply: str, debug?: {chunks: [...]}}`
- `GET /api/v1/chat/sessions?user_id={id}&limit={n}` - List user sessions
- `GET /api/v1/chat/sessions/{session_id}` - Get session with messages

**Analytics Endpoints:**
- `GET /api/v1/chat/stats/user/{user_id}` - User statistics
- `GET /api/v1/chat/stats/global` - Global statistics
- `GET /api/v1/chat/sessions/search?user_id={id}&q={query}&limit={n}` - Search sessions

**Admin Endpoints:**
- `POST /api/v1/admin/courses/{course_id}/reindex` - Re-index course content
- `GET /api/v1/admin/courses/{course_id}/chunks` - List course chunks
- `DELETE /api/v1/admin/courses/{course_id}/chunks` - Delete course chunks

**Health Check:**
- `GET /health` - Service health status

### 2. LLM Provider Configuration

**Status: ❌ Mock/Dummy mode active**

- **Current State:** `DEMO_MODE=True` (default in `settings.py:98`)
- **LLM Provider:** `LLM_PROVIDER=dummy` (default in `settings.py:64`)
- **Real LLM Support:** Service supports Llama3 via Groq API (`Llama3Client`), but requires:
  - `LLAMA3_API_BASE` (e.g., `https://api.groq.com/openai/v1`)
  - `LLAMA3_API_KEY` (API key from Groq)
  - `LLAMA3_MODEL_NAME` (e.g., `llama-3-8b-instruct`)
- **Demo Responses:** When `DEMO_MODE=True`, all chat endpoints return hardcoded responses from `chatbot_demo_responses.py` without calling any LLM or vector store

### 3. API Key and Configuration

**Status: ❌ Missing production configuration**

- **No `.env` file found** in the service directory
- **No `.env.example`** template provided
- **Environment variables** must be set via:
  - `.env.dev`, `.env.test`, or `.env.prod` files (based on `ENV` variable)
  - Or system environment variables
- **Required for production:**
  - `DEMO_MODE=False`
  - `LLM_PROVIDER=llama3`
  - `LLAMA3_API_BASE`, `LLAMA3_API_KEY`, `LLAMA3_MODEL_NAME`
  - Database connection strings (`CHAT_DB_*` or `LMS_DB_*`)

### 4. CORS Configuration

**Status: ✅ Configured for frontend access**

- CORS middleware is properly configured in `main.py:73-79`
- `allow_origins=["*"]` - Currently allows all origins (should be restricted in production)
- `allow_credentials=True`
- `allow_methods=["*"]`
- `allow_headers=["*"]`
- **Note:** The comment indicates this should be narrowed later (`# sau này có thể thu hẹp`)

### 5. Authentication

**Status: ❌ No authentication implemented**

- **No authentication middleware** found in the codebase
- **No API key validation** for endpoints
- **Admin endpoints** have a TODO comment: `"TODO: Add basic API key authentication later."` (admin.py:9)
- **All endpoints are publicly accessible** - any frontend can call them without credentials
- **Security concern:** In production, authentication should be added (e.g., JWT tokens, API keys, or integration with LMS auth system)

### 6. Database Dependencies

**Status: ⚠️ Requires PostgreSQL**

- Service requires PostgreSQL for:
  - Chat sessions storage (`chat_sessions` table)
  - Chat messages storage (`chat_messages` table)
- Connection configured via `CHAT_DB_*` or falls back to `LMS_DB_*` settings
- **Note:** Service will fail if database is not available (errors visible in logs)

### 7. Vector Store Configuration

**Status: ⚠️ Defaults to in-memory**

- Default: `VECTOR_STORE_BACKEND=inmemory` (data lost on restart)
- Production should use: `VECTOR_STORE_BACKEND=faiss` with `VECTOR_STORE_DIR` configured
- Embeddings default to `EMBEDDING_BACKEND=dummy` (hash-based, not real embeddings)
- Production should use: `EMBEDDING_BACKEND=sentence_transformers`

---

## Conclusion

**"Mock only / missing API key / not production-ready"**

The chatbot service has a **solid API foundation** and is **ready for frontend integration from a technical standpoint** (CORS configured, well-structured endpoints). However, it is **not production-ready** because:

1. **DEMO_MODE is enabled** - Returns hardcoded responses instead of real LLM-generated answers
2. **No LLM API key configured** - Cannot use real LLM provider (Llama3/Groq)
3. **No authentication** - All endpoints are publicly accessible
4. **Missing environment configuration** - No `.env` file or production settings
5. **Default to dummy/in-memory backends** - Data persistence and real embeddings not configured

**To make it production-ready:**
- Set `DEMO_MODE=False`
- Configure `LLAMA3_API_KEY` and related settings
- Add authentication middleware
- Configure PostgreSQL database
- Switch to `faiss` vector store and `sentence_transformers` embeddings
- Restrict CORS origins to frontend domain(s)

---

## Recommendations for Frontend Integration

1. **For Development/Testing:** The service can be integrated as-is in DEMO_MODE for UI development and testing
2. **For Production:** Complete the configuration steps above before deploying
3. **API Contract:** The request/response schemas are stable and well-defined - safe to integrate frontend now
4. **Error Handling:** Service has proper error handling and returns structured error responses

