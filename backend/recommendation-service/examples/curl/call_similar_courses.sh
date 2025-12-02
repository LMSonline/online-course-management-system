#!/bin/bash
# Example: Get similar courses

BASE_URL="${BASE_URL:-http://localhost:8002}"

curl "${BASE_URL}/api/v1/recommendations/similar/course_python_basic" | jq '.'

