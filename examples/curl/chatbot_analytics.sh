#!/bin/bash
# Chatbot Service Analytics API Examples

BASE_URL="http://localhost:8003"

echo "=== User Statistics ==="
curl -X GET "${BASE_URL}/api/v1/chat/stats/user/user123" | jq

echo -e "\n=== Global Statistics ==="
curl -X GET "${BASE_URL}/api/v1/chat/stats/global" | jq

echo -e "\n=== Search Sessions ==="
curl -X GET "${BASE_URL}/api/v1/chat/sessions/search?user_id=user123&q=Python" | jq

