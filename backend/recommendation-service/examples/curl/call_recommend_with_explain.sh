#!/bin/bash
# Example: Get recommendations with explainable reasons

BASE_URL="${BASE_URL:-http://localhost:8002}"

curl "${BASE_URL}/api/v1/recommendations/home?user_id=user123&explain=true" | jq '.'

