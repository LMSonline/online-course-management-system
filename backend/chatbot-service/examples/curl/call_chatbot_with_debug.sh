#!/bin/bash
# Example: Call chatbot API with debug mode to see retrieved chunks

BASE_URL="${BASE_URL:-http://localhost:8003}"

curl -X POST "${BASE_URL}/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "example-session-2",
    "user_id": "user123",
    "text": "How do I define a list in Python?",
    "current_course_id": "course_python_basic",
    "debug": true
  }' | jq '.'

