#!/bin/bash
# Example: Get home page recommendations

BASE_URL="${BASE_URL:-http://localhost:8002}"

curl "${BASE_URL}/api/v1/recommendations/home?user_id=user123" | jq '.'

