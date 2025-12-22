# DEMO_MODE Implementation Summary

## Overview

Both services now support `DEMO_MODE` (default: `True`) which returns hardcoded responses without requiring any external dependencies (databases, vector stores, LLM APIs, etc.). This makes it easy to run a demo video without setting up complex infrastructure.

## 1. DEMO_MODE Setting

### Chatbot Service
**Location:** `backend/chatbot-service/app/core/settings.py`

```python
DEMO_MODE: bool = True  # Default to True for easy demo
```

### Recommendation Service
**Location:** `backend/recommendation-service/app/core/settings.py`

```python
DEMO_MODE: bool = True  # Default to True for easy demo
```

## 2. Chatbot Service - DEMO_MODE Behavior

### CLI Commands (Skip in DEMO_MODE)

**Files Modified:**
- `backend/chatbot-service/app/cli.py`

**Behavior:**
- `ingest-lms`: Prints "DEMO_MODE is ON: skipping ingestion, pretending success." and exits
- `ingest-folder`: Prints "DEMO_MODE is ON: skipping ingestion, pretending success." and exits

**No network calls, no vector store operations.**

### API Endpoints

#### `POST /api/v1/chat/messages`

**File:** `backend/chatbot-service/app/api/v1/chat.py`

**Demo Response Logic:**
- If text contains "quiz" or "trắc nghiệm" → Returns 5 MCQ questions about Python
- If text contains "kế hoạch" or "plan" → Returns a 4-week study plan for Python Basics
- If text contains "python" or "là gì" → Returns explanation about Python
- Otherwise → Returns generic helpful message

**Response Format:** Matches existing `ChatResponse` schema with `reply` and optional `debug` fields.

**Demo Module:** `backend/chatbot-service/app/demo/chatbot_demo_responses.py`

#### `GET /api/v1/chat/stats/user/{user_id}`

**File:** `backend/chatbot-service/app/api/v1/analytics.py`

**Demo Response:**
```json
{
  "user_id": "user123",
  "num_sessions": 5,
  "num_messages": 23,
  "intent_distribution": {
    "ASK_COURSE_QA": 8,
    "ASK_GENERATE_QUIZ": 5,
    "ASK_STUDY_PLAN": 3,
    "ASK_GENERAL_QA": 4,
    "ASK_RECOMMEND": 3
  }
}
```

#### `GET /api/v1/chat/stats/global`

**Demo Response:**
```json
{
  "total_sessions": 127,
  "total_messages": 542,
  "top_intents": [...],
  "most_asked_courses": [...],
  "time_series": [...]
}
```

## 3. Recommendation Service - DEMO_MODE Behavior

### API Endpoints

#### `GET /api/v1/recommendations/home`

**File:** `backend/recommendation-service/app/api/v1/recommendations.py`

**Demo Response:**
Returns 5 hardcoded courses:
1. Python Basics (beginner)
2. Data Science Foundations (intermediate)
3. Web Development with Flask (intermediate)
4. Introduction to Machine Learning (intermediate)
5. SQL for Data Analysis (beginner)

**Supports:**
- `explain=true`: Returns `RecommendedCourse` objects with reasons
- `strategy` param: Echoed in reason field if explain=true

**Demo Module:** `backend/recommendation-service/app/demo/recommendation_demo_responses.py`

#### `GET /api/v1/recommendations/stats/user/{user_id}`

**File:** `backend/recommendation-service/app/api/v1/analytics.py`

**Demo Response:**
```json
{
  "user_id": "user123",
  "num_recommendations": 15,
  "num_clicks": 3,
  "num_enrolls": 1,
  "ctr": 20.0,
  "top_categories": ["programming", "data-science", "web-development"]
}
```

#### `GET /api/v1/recommendations/stats/global`

**Demo Response:**
```json
{
  "global_ctr": 12.5,
  "most_popular_courses": [...],
  "strategy_distribution": [...],
  "daily_stats": [...]
}
```

#### `GET /admin/recommendations/models`

**File:** `backend/recommendation-service/app/api/v1/admin.py`

**Demo Response:**
```json
{
  "models_loaded": [
    "two_tower_model.pt",
    "item_embeddings.npy",
    "item_ids.txt",
    "items.faiss"
  ],
  "embedding_dim": 64,
  "num_indexed_items": 42,
  "model_checkpoints": [...]
}
```

## 4. Demo Response Modules

### Chatbot Service
**Location:** `backend/chatbot-service/app/demo/chatbot_demo_responses.py`

**Functions:**
- `get_demo_chat_response(text, debug)` → Returns (reply, debug_info)
- `get_demo_user_stats(user_id)` → Returns user stats dict
- `get_demo_global_stats()` → Returns global stats dict

### Recommendation Service
**Location:** `backend/recommendation-service/app/demo/recommendation_demo_responses.py`

**Functions:**
- `get_demo_home_recommendations(user_id, explain, strategy)` → Returns List[Course] or List[RecommendedCourse]
- `get_demo_user_stats(user_id)` → Returns user stats dict
- `get_demo_global_stats()` → Returns global stats dict
- `get_demo_model_info()` → Returns model info dict

## 5. How to Use

### Start Services (DEMO_MODE is ON by default)

```bash
# Terminal 1: Chatbot Service
cd backend/chatbot-service
uvicorn app.main:app --reload --port 8003

# Terminal 2: Recommendation Service
cd backend/recommendation-service
uvicorn app.main:app --reload --port 8002
```

### Test Endpoints

**Chatbot:**
```bash
# Chat message
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{"session_id": "demo-1", "user_id": "user123", "text": "What is Python?"}'

# User stats
curl "http://localhost:8003/api/v1/chat/stats/user/user123"

# Global stats
curl "http://localhost:8003/api/v1/chat/stats/global"
```

**Recommendation:**
```bash
# Home recommendations
curl "http://localhost:8002/api/v1/recommendations/home?user_id=user123&explain=true"

# Global stats
curl "http://localhost:8002/api/v1/recommendations/stats/global"

# Model info
curl "http://localhost:8002/admin/recommendations/models"
```

### Disable DEMO_MODE (Use Real Services)

Set environment variable:
```bash
# PowerShell
$env:DEMO_MODE='False'

# Bash
export DEMO_MODE=False
```

Or edit settings files to set `DEMO_MODE: bool = False`.

## 6. Code Structure

### Where DEMO_MODE is Checked

**Chatbot Service:**
- `app/api/v1/chat.py` - `post_message()` endpoint
- `app/api/v1/analytics.py` - `get_user_stats()`, `get_global_stats()` endpoints
- `app/cli.py` - `ingest_lms()`, `ingest_folder()` commands

**Recommendation Service:**
- `app/api/v1/recommendations.py` - `get_home_recommendations()` endpoint
- `app/api/v1/analytics.py` - `get_user_stats()`, `get_global_stats()` endpoints
- `app/api/v1/admin.py` - `get_models_info()` endpoint

### Pattern Used

```python
if settings.DEMO_MODE:
    # Return hardcoded demo response
    return demo_function(...)
else:
    # Use real service
    return await real_service.method(...)
```

## 7. Benefits

✅ **No external dependencies** - Works offline, no DB, no vector store, no LLM API  
✅ **Fast startup** - No model loading, no DB connections  
✅ **Predictable responses** - Same responses every time, good for demos  
✅ **Easy to toggle** - Just set `DEMO_MODE=False` to use real services  
✅ **Non-invasive** - Real code remains intact, just short-circuited in demo mode

## 8. Notes

- DEMO_MODE defaults to `True` for easy demo setup
- All responses match existing API schemas
- No changes to request/response formats
- Real service code is preserved and works when DEMO_MODE=False

