# Chatbot Service Demo

This guide demonstrates how to use the Chatbot Service API for various use cases.

## Prerequisites

- Chatbot service running at `http://localhost:8003`
- Course content ingested into vector store
- API key (if authentication is enabled)

## Basic Usage

### 1. Send a Chat Message

```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "demo-session-1",
    "user_id": "user123",
    "text": "What is Python?",
    "current_course_id": "course_python_basic",
    "debug": false
  }'
```

### 2. Generate Quiz Questions

```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "demo-session-2",
    "user_id": "user123",
    "text": "Tạo cho em 5 câu trắc nghiệm về Python",
    "current_course_id": "course_python_basic"
  }'
```

### 3. Summarize a Lesson

```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "demo-session-3",
    "user_id": "user123",
    "text": "Tóm tắt bài học này",
    "current_course_id": "course_python_basic",
    "lesson_id": "lesson_1"
  }'
```

### 4. Explain Code

```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "demo-session-4",
    "user_id": "user123",
    "text": "Giải thích code này:\n```python\ndef hello():\n    print(\"Hello, World!\")\n```",
    "language": "python"
  }'
```

### 5. Create Study Plan with Constraints

```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "demo-session-5",
    "user_id": "user123",
    "text": "Tạo kế hoạch học tập",
    "current_course_id": "course_python_basic",
    "exam_date": "2024-12-31T00:00:00Z",
    "free_days_per_week": 5,
    "completed_lessons": ["lesson_1", "lesson_2"]
  }'
```

## Analytics Endpoints

### Get User Statistics

```bash
curl "http://localhost:8003/api/v1/chat/stats/user/user123"
```

### Get Global Statistics

```bash
curl "http://localhost:8003/api/v1/chat/stats/global"
```

### Search Sessions

```bash
curl "http://localhost:8003/api/v1/chat/sessions/search?user_id=user123&q=Python"
```

## Admin Endpoints

### Re-index Course Content

```bash
curl -X POST "http://localhost:8003/api/v1/admin/courses/course_python_basic/reindex"
```

### Get Course Chunks

```bash
curl "http://localhost:8003/api/v1/admin/courses/course_python_basic/chunks"
```

## Using Python Client

```python
import httpx
import asyncio

async def demo():
    async with httpx.AsyncClient() as client:
        # Send message
        response = await client.post(
            "http://localhost:8003/api/v1/chat/messages",
            json={
                "session_id": "python-demo",
                "user_id": "user123",
                "text": "What is Python?",
                "current_course_id": "course_python_basic",
            }
        )
        data = response.json()
        print(f"Reply: {data['reply']}")

asyncio.run(demo())
```

