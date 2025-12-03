#!/bin/bash
# Recommendation Service Analytics API Examples

BASE_URL="http://localhost:8002"

echo "=== User Statistics ==="
curl -X GET "${BASE_URL}/api/v1/recommendations/stats/user/user123" | jq

echo -e "\n=== Global Statistics ==="
curl -X GET "${BASE_URL}/api/v1/recommendations/stats/global" | jq

echo -e "\n=== Model Information ==="
curl -X GET "${BASE_URL}/admin/recommendations/models" | jq

