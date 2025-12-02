#!/bin/bash
# Example: Call chatbot API for course Q&A

BASE_URL="${BASE_URL:-http://localhost:8003}"

curl -X POST "${BASE_URL}/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "example-session-1",
    "user_id": "user123",
    "text": "What is the difference between a list and a tuple in Python?",
    "current_course_id": "course_python_basic",
    "debug": false
  }' | jq '.'

