# OpenAPI Documentation

This document provides an overview of the API endpoints for both microservices.

## Chatbot Service API

Base URL: `http://localhost:8003`

### Chat Endpoints

#### POST /api/v1/chat/messages

Send a chat message to the chatbot.

**Request Body:**
```json
{
  "session_id": "string",
  "user_id": "string",
  "text": "string",
  "current_course_id": "string | null",
  "debug": false,
  "language": "string | null",
  "lesson_id": "string | null",
  "exam_date": "string | null",
  "free_days_per_week": "integer | null",
  "completed_lessons": ["string"] | null,
  "top_k": "integer | null",
  "score_threshold": "float | null"
}
```

**Response:**
```json
{
  "reply": "string",
  "debug": {
    "chunks": [
      {
        "course_id": "string",
        "lesson_id": "string | null",
        "section": "string | null",
        "score": "float | null",
        "text_preview": "string"
      }
    ]
  } | null
}
```

### Session Management

#### GET /api/v1/chat/sessions

List chat sessions for a user.

**Query Parameters:**
- `user_id` (required): User ID

**Response:**
```json
[
  {
    "id": "string",
    "user_id": "string",
    "current_course_id": "string | null",
    "last_intent": "string | null",
    "created_at": "string"
  }
]
```

#### GET /api/v1/chat/sessions/{session_id}

Get session details with messages.

**Response:**
```json
{
  "session": {
    "id": "string",
    "user_id": "string",
    "current_course_id": "string | null",
    "last_intent": "string | null",
    "created_at": "string"
  },
  "messages": [
    {
      "id": "string",
      "session_id": "string",
      "sender": "USER" | "BOT",
      "text": "string",
      "timestamp": "string"
    }
  ]
}
```

### Analytics

#### GET /api/v1/chat/stats/user/{user_id}

Get user statistics.

**Response:**
```json
{
  "user_id": "string",
  "num_sessions": 0,
  "num_messages": 0,
  "intent_distribution": {
    "ASK_COURSE_QA": 10,
    "ASK_GENERATE_QUIZ": 5
  }
}
```

#### GET /api/v1/chat/stats/global

Get global statistics.

**Response:**
```json
{
  "total_sessions": 0,
  "total_messages": 0,
  "top_intents": [
    {"intent": "string", "count": 0}
  ],
  "most_asked_courses": [
    {"course_id": "string", "count": 0}
  ],
  "time_series": [
    {"date": "string", "sessions": 0}
  ]
}
```

#### GET /api/v1/chat/sessions/search

Search sessions by message content.

**Query Parameters:**
- `user_id` (required): User ID
- `q` (required): Search query
- `limit` (optional): Maximum results (default: 20)

### Admin

#### POST /api/v1/admin/courses/{course_id}/reindex

Re-index course content.

#### GET /api/v1/admin/courses/{course_id}/chunks

Get course chunks.

#### DELETE /api/v1/admin/courses/{course_id}/chunks

Delete course chunks.

## Recommendation Service API

Base URL: `http://localhost:8002`

### Recommendations

#### GET /api/v1/recommendations/home

Get home page recommendations.

**Query Parameters:**
- `user_id` (required): User ID
- `explain` (optional): Include explanations (default: false)
- `strategy` (optional): Recommender strategy (two_tower | popularity | content | hybrid)

**Response (explain=false):**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "level": "string",
    "tags": ["string"]
  }
]
```

**Response (explain=true):**
```json
{
  "recommendations": [
    {
      "course": {
        "id": "string",
        "title": "string",
        "description": "string",
        "level": "string",
        "tags": ["string"]
      },
      "score": 0.0,
      "reason": "string"
    }
  ]
}
```

#### GET /api/v1/recommendations/similar/{course_id}

Get similar courses.

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "level": "string",
    "tags": ["string"]
  }
]
```

### Analytics

#### GET /api/v1/recommendations/stats/user/{user_id}

Get user recommendation statistics.

**Response:**
```json
{
  "user_id": "string",
  "num_recommendations": 0,
  "num_clicks": 0,
  "num_enrolls": 0,
  "ctr": 0.0,
  "top_categories": ["string"]
}
```

#### GET /api/v1/recommendations/stats/global

Get global recommendation statistics.

**Response:**
```json
{
  "global_ctr": 0.0,
  "most_popular_courses": [
    {"course_id": "string", "count": 0}
  ],
  "strategy_distribution": [
    {"strategy": "string", "count": 0}
  ],
  "daily_stats": [
    {
      "date": "string",
      "views": 0,
      "clicks": 0,
      "enrolls": 0
    }
  ]
}
```

### Admin

#### GET /admin/recommendations/models

Get model information.

**Response:**
```json
{
  "models_loaded": ["string"],
  "embedding_dim": 0,
  "num_indexed_items": 0,
  "model_checkpoints": [
    {
      "name": "string",
      "size_bytes": 0,
      "modified": 0
    }
  ]
}
```

#### POST /admin/recommendations/reindex

Rebuild FAISS index.

## Error Response Format

All endpoints return errors in a standardized format:

```json
{
  "error": {
    "error_code": "string",
    "message": "string",
    "details": {},
    "request_id": "string"
  }
}
```

Common error codes:
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `LLM_ERROR`: LLM service error
- `VECTOR_STORE_ERROR`: Vector store error
- `INTERNAL_SERVER_ERROR`: Unexpected server error

## Authentication

Currently, the APIs do not require authentication. This is a simplified academic project. In production, you would add:
- JWT token authentication
- API key authentication for admin endpoints
- Role-based access control (RBAC)

## Rate Limiting

Rate limiting is not currently implemented. In production, consider:
- Per-user rate limits
- Per-IP rate limits
- Token bucket or sliding window algorithms

