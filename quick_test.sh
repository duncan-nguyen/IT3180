#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🧪 Testing Authentication Flow${NC}"
echo "=================================="

# Configuration
AUTH_URL="http://localhost:8001/api/v1/auth"
RESIDENTS_URL="http://localhost:8002/api/v1"
FEEDBACK_URL="http://localhost:8003/api/v1"

# 1. Login
echo -e "\n${YELLOW}1. Login...${NC}"
RESPONSE=$(curl -s -X POST "$AUTH_URL/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123")

TOKEN=$(echo $RESPONSE | jq -r '.access_token')
USERNAME=$(echo $RESPONSE | jq -r '.user.username')

if [ "$TOKEN" != "null" ] && [ "$TOKEN" != "" ]; then
  echo -e "${GREEN}✓ Login successful${NC}"
  echo "Username: $USERNAME"
else
  echo -e "${RED}✗ Login failed${NC}"
  echo "Response: $RESPONSE"
  exit 1
fi

# 2. Validate with correct username
echo -e "\n${YELLOW}2. Testing validate with CORRECT username...${NC}"
VALIDATE_RESPONSE=$(curl -s -X POST "$AUTH_URL/validate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME\"}")

if echo $VALIDATE_RESPONSE | jq -e '.role' >/dev/null 2>&1; then
  echo -e "${GREEN}✓ Validation successful${NC}"
  echo $VALIDATE_RESPONSE | jq
else
  echo -e "${RED}✗ Validation failed${NC}"
  echo $VALIDATE_RESPONSE
fi

# 3. Validate with wrong username (should fail)
echo -e "\n${YELLOW}3. Testing validate with WRONG username (should fail)...${NC}"
WRONG_RESPONSE=$(curl -s -X POST "$AUTH_URL/validate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"wronguser\"}")

if echo $WRONG_RESPONSE | jq -e '.detail' | grep -q "mismatch"; then
  echo -e "${GREEN}✓ Correctly rejected wrong username${NC}"
else
  echo -e "${RED}✗ Should have rejected wrong username${NC}"
fi

# 4. Test Residents Service WITH X-Username
echo -e "\n${YELLOW}4. Testing residents service WITH X-Username header...${NC}"
RESIDENTS_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$RESIDENTS_URL/households" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Username: $USERNAME")

HTTP_CODE=$(echo "$RESIDENTS_RESPONSE" | tail -n1)
BODY=$(echo "$RESIDENTS_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Residents service call successful${NC}"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
  echo -e "${YELLOW}⚠ Residents service returned: $HTTP_CODE${NC}"
  echo "$BODY"
fi

# 5. Test Residents Service WITHOUT X-Username (should fail)
echo -e "\n${YELLOW}5. Testing residents service WITHOUT X-Username (should fail)...${NC}"
NO_HEADER_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$RESIDENTS_URL/households" \
  -H "Authorization: Bearer $TOKEN")

HTTP_CODE=$(echo "$NO_HEADER_RESPONSE" | tail -n1)
BODY=$(echo "$NO_HEADER_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "400" ]; then
  echo -e "${GREEN}✓ Correctly rejected request without X-Username${NC}"
else
  echo -e "${RED}✗ Should have rejected (400) but got: $HTTP_CODE${NC}"
fi

# 6. Test Feedback Service
echo -e "\n${YELLOW}6. Testing feedback service...${NC}"
FEEDBACK_RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$FEEDBACK_URL/feedbacks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Username: $USERNAME")

HTTP_CODE=$(echo "$FEEDBACK_RESPONSE" | tail -n1)
BODY=$(echo "$FEEDBACK_RESPONSE" | sed '$d')

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✓ Feedback service call successful${NC}"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
  echo -e "${YELLOW}⚠ Feedback service returned: $HTTP_CODE${NC}"
  echo "$BODY"
fi

# Summary
echo -e "\n=================================="
echo -e "${GREEN}✓ Testing completed!${NC}"
echo -e "=================================="
