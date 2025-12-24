#!/bin/bash

# Test script for IT3180 services: authentication, residents, feedback

# set -e  # Exit on error

# Base URLs
AUTH_BASE="http://localhost:8001/api/v1/auth"
RESIDENTS_BASE="http://localhost:8002/api/v1"
FEEDBACK_BASE="http://localhost:8003/api/v1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting comprehensive test of IT3180 services...${NC}"

# Function to check if jq is installed
check_jq() {
    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error: jq is required for JSON parsing. Please install jq.${NC}"
        exit 1
    fi
}

# Function to make curl request and check response
test_endpoint() {
    local method=$1
    local url=$2
    local data=$3
    local headers=$4
    local expected_code=${5:-200}
    local description=$6

    echo -e "${YELLOW}Testing: $description${NC}"
    echo "URL: $url"
    echo "Method: $method"

    local cmd
    if [ -n "$headers" ]; then
        cmd="curl -s -w '\n%{http_code}' -X $method '$url' -H 'Authorization: Bearer $headers' -H 'X-Username: admin'"
    else
        cmd="curl -s -w '\n%{http_code}' -X $method '$url'"
    fi
    if [ "$method" = "POST" ] || [ "$method" = "PUT" ]; then
        cmd="$cmd -H 'Content-Type: application/json' -d '$data'"
    fi
    response=$(eval "$cmd")

    local body=$(echo "$response" | head -n -1)
    local code=$(echo "$response" | tail -n 1)
    if ! [[ "$code" =~ ^[0-9]+$ ]]; then code=999; body="Connection failed"; fi

    if [ "$code" -eq "$expected_code" ]; then
        echo -e "${GREEN}✓ Success (HTTP $code)${NC}"
        echo "$body" | jq . 2>/dev/null || echo "$body"
    else
        echo -e "${RED}✗ Failed (HTTP $code, expected $expected_code)${NC}"
        echo "$body"
    fi
    echo
}

check_jq

# ==========================================
# AUTHENTICATION SERVICE TESTS
# ==========================================

echo -e "${YELLOW}=== AUTHENTICATION SERVICE TESTS ===${NC}"

# 1. Login
echo "Logging in as admin..."
LOGIN_RESPONSE=$(curl -s -X POST "$AUTH_BASE/login" -H "Content-Type: application/x-www-form-urlencoded" -d "username=admin&password=admin123")
LOGIN_CODE=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token // empty' 2>/dev/null)
if [ -z "$LOGIN_CODE" ]; then
    echo -e "${RED}Login failed${NC}"
    echo "$LOGIN_RESPONSE"
    exit 1
fi
ACCESS_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token')
REFRESH_TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.refresh_token')
echo -e "${GREEN}Login successful. Access token obtained.${NC}"

AUTH_HEADER="$ACCESS_TOKEN"

# 2. Get current user (/me)
test_endpoint "GET" "$AUTH_BASE/me" "" "$AUTH_HEADER" 200 "Get current user info"

# 3. Get all users
test_endpoint "GET" "$AUTH_BASE/users" "" "$AUTH_HEADER" 200 "Get all users"

# 4. Validate token
VALIDATE_DATA=$(printf '{"username":"admin","access_token":"%s"}' "$ACCESS_TOKEN")
test_endpoint "POST" "$AUTH_BASE/validate" "$VALIDATE_DATA" "" 200 "Validate token"

# 4. Refresh token
REFRESH_DATA=$(printf '{"refresh_token":{"refresh_token":"%s"}}' "$REFRESH_TOKEN")
REFRESH_RESPONSE=$(curl -s -X POST "$AUTH_BASE/refresh" -H "Content-Type: application/json" -d "$REFRESH_DATA")
NEW_ACCESS_TOKEN=$(echo "$REFRESH_RESPONSE" | jq -r '.access_token // empty' 2>/dev/null)
if [ -n "$NEW_ACCESS_TOKEN" ]; then
    echo -e "${GREEN}Token refresh successful${NC}"
    # ACCESS_TOKEN="$NEW_ACCESS_TOKEN"
    # AUTH_HEADER="-H \"Authorization: Bearer $ACCESS_TOKEN\""
else
    echo -e "${YELLOW}Token refresh failed, continuing with old token${NC}"
fi

# 6. Create new user
RANDOM_ID=$RANDOM
TEST_USERNAME="testuser_$RANDOM_ID"
CREATE_USER_DATA=$(printf '{"user":{"username":"%s","password":"testpass123","role":"admin","scope_id":"test_scope"}}' "$TEST_USERNAME")
test_endpoint "POST" "$AUTH_BASE/users" "$CREATE_USER_DATA" "$AUTH_HEADER" 200 "Create new user"
# Refresh users list
USERS_LIST=$(curl -s -X GET "$AUTH_BASE/users" -H "Authorization: Bearer $AUTH_HEADER")
TEST_USER_ID=$(echo "$USERS_LIST" | jq -r --arg UNAME "$TEST_USERNAME" '.[] | select(.username==$UNAME) | .id' 2>/dev/null)
# Get the new user's ID (assuming it's returned or we can get from users list)
USERS_LIST=$(curl -s -X GET "$AUTH_BASE/users" -H "Authorization: Bearer $AUTH_HEADER")
TEST_USER_ID=$(echo "$USERS_LIST" | jq -r --arg UNAME "$TEST_USERNAME" '.[] | select(.username==$UNAME) | .id' 2>/dev/null)

if [ -n "$TEST_USER_ID" ]; then
    echo "Test user ID: $TEST_USER_ID"

    # 7. Update user
    UPDATE_DATA='{"update_data":{"role":"can_bo_phuong","scope_id":"updated_scope"}}'
    test_endpoint "POST" "$AUTH_BASE/users/$TEST_USER_ID" "$UPDATE_DATA" "$AUTH_HEADER" 200 "Update user"

    # 8. Reset password
    RESET_DATA='{"password":{"password":"newpass123"}}'
    test_endpoint "POST" "$AUTH_BASE/$TEST_USER_ID/reset-password" "$RESET_DATA" "$AUTH_HEADER" 200 "Reset password"

    # 9. Lock user
    test_endpoint "POST" "$AUTH_BASE/users/$TEST_USER_ID/lock" "" "$AUTH_HEADER" 200 "Lock user"

    # 10. Unlock user
    test_endpoint "PUT" "$AUTH_BASE/users/$TEST_USER_ID/unlock" "" "$AUTH_HEADER" 200 "Unlock user"

    # 11. Delete user
    test_endpoint "DELETE" "$AUTH_BASE/users/$TEST_USER_ID/delete" "" "$AUTH_HEADER" 200 "Delete user"
else
    echo -e "${YELLOW}Could not find test user ID, skipping user management tests${NC}"
fi

# ==========================================
# RESIDENTS SERVICE TESTS
# ==========================================

echo -e "${YELLOW}=== RESIDENTS SERVICE TESTS ===${NC}"

# Note: These are placeholder tests. Adjust based on actual endpoints
# Assuming endpoints like /households, /residents

# Test households endpoints (if exist)
test_endpoint "GET" "$RESIDENTS_BASE/households/" "" "$AUTH_HEADER" 200 "Get households"

# Test residents endpoints (if exist)
test_endpoint "GET" "$RESIDENTS_BASE/residents/count" "" "$AUTH_HEADER" 200 "Count residents"

# ==========================================
# FEEDBACK SERVICE TESTS
# ==========================================

echo -e "${YELLOW}=== FEEDBACK SERVICE TESTS ===${NC}"

# Note: These are placeholder tests. Adjust based on actual endpoints
# Assuming endpoints like /feedback, /reports

# Test feedback endpoints (if exist)
test_endpoint "GET" "$FEEDBACK_BASE/feedback" "" "$AUTH_HEADER" 200 "Get feedback"

# Test reports endpoints (if exist)
test_endpoint "GET" "$FEEDBACK_BASE/reports" "" "$AUTH_HEADER" 200 "Get reports"

echo -e "${GREEN}All tests completed!${NC}"