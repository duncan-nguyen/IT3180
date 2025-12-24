# Hướng Dẫn Test API - Authentication Flow

## 1. Khởi Động Các Services

### Cách 1: Dùng Docker Compose (Khuyến nghị)
```bash
cd /home/duncan-nguyen/codespace/baitaplon/IT3180
docker-compose up -d
```

Kiểm tra services đang chạy:
```bash
docker-compose ps
```

### Cách 2: Chạy Từng Service Riêng (Development)

**Terminal 1 - Authentication Service:**
```bash
cd authentication
uvicorn main:app --reload --port 8001
```

**Terminal 2 - Residents Service:**
```bash
cd residents
uvicorn main:app --reload --port 8002
```

**Terminal 3 - Feedback Service:**
```bash
cd feedback
uvicorn main:app --reload --port 8003
```

---

## 2. Tạo User Test (Nếu chưa có)

```bash
# Sử dụng API để tạo admin user đầu tiên
# (Hoặc sử dụng database initialization script)
```

---

## 3. Test Flow - Bước Từng Bước

### Bước 1: Login và Lấy Token

```bash
curl -X POST "http://localhost:8001/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123"
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "admin",
    "role": "admin",
    "scope_id": "",
    "active": true
  }
}
```

**Lưu ý:** Lưu lại `access_token` và `username` để dùng cho các bước tiếp theo.

---

### Bước 2: Test Validate Endpoint (Trực tiếp)

```bash
export TOKEN="<access_token_từ_bước_1>"
export USERNAME="admin"

curl -X POST "http://localhost:8001/api/v1/auth/validate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME\"}"
```

**Response thành công:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "role": "admin",
  "scope_id": ""
}
```

**Test với username sai (Phải fail):**
```bash
curl -X POST "http://localhost:8001/api/v1/auth/validate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"wronguser\"}"
```

---

### Bước 3: Test Residents Service

**Lấy danh sách households:**
```bash
curl -X GET "http://localhost:8002/api/v1/households" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Username: $USERNAME"
```

**Test không có X-Username header (Phải fail - 400):**
```bash
curl -X GET "http://localhost:8002/api/v1/households" \
  -H "Authorization: Bearer $TOKEN"
```

**Tạo household mới:**
```bash
curl -X POST "http://localhost:8002/api/v1/households" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Username: $USERNAME" \
  -H "Content-Type: application/json" \
  -d '{
    "address": "123 Test Street",
    "area_code": "HN01"
  }'
```

---

### Bước 4: Test Feedback Service

**Lấy danh sách feedback:**
```bash
curl -X GET "http://localhost:8003/api/v1/feedbacks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Username: $USERNAME"
```

**Tạo feedback mới:**
```bash
curl -X POST "http://localhost:8003/api/v1/feedbacks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Username: $USERNAME" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Feedback",
    "content": "This is a test feedback",
    "category": "general"
  }'
```

---

## 4. Test Script Tự Động

Chạy script tự động đã tạo sẵn:

```bash
cd /home/duncan-nguyen/codespace/baitaplon/IT3180
python verify_auth_flow.py
```

Script sẽ test:
- ✅ Login
- ✅ Validate với username đúng
- ✅ Validate từ chối username sai
- ✅ Validate từ chối khi thiếu username
- ✅ Service call với X-Username header
- ✅ Service call từ chối khi thiếu X-Username

---

## 5. Test Với Postman/Thunder Client

### Collection Setup:

**Environment Variables:**
- `base_url_auth`: `http://localhost:8001/api/v1/auth`
- `base_url_residents`: `http://localhost:8002/api/v1`
- `base_url_feedback`: `http://localhost:8003/api/v1`
- `token`: (sẽ set tự động sau login)
- `username`: (sẽ set tự động sau login)

### Request 1: Login
```
POST {{base_url_auth}}/login
Content-Type: application/x-www-form-urlencoded

username=admin&password=admin123
```

**Tests Script (Postman):**
```javascript
pm.environment.set("token", pm.response.json().access_token);
pm.environment.set("username", pm.response.json().user.username);
```

### Request 2: Get Households
```
GET {{base_url_residents}}/households
Authorization: Bearer {{token}}
X-Username: {{username}}
```

### Request 3: Get Feedbacks
```
GET {{base_url_feedback}}/feedbacks
Authorization: Bearer {{token}}
X-Username: {{username}}
```

---

## 6. Kiểm Tra Logs

```bash
# Xem logs của authentication service
docker-compose logs -f authentication

# Xem logs của residents service
docker-compose logs -f residents

# Xem logs của feedback service
docker-compose logs -f feedback
```

---

## 7. Troubleshooting

### Lỗi: "X-Username header is required"
- **Nguyên nhân:** Thiếu header `X-Username` trong request
- **Giải pháp:** Thêm header `-H "X-Username: <username>"`

### Lỗi: "Username mismatch"
- **Nguyên nhân:** Username trong header khác với username trong token
- **Giải pháp:** Đảm bảo username trùng với user đã login

### Lỗi: "Auth service unreachable"
- **Nguyên nhân:** Authentication service không chạy hoặc sai URL
- **Giải pháp:** Kiểm tra service đang chạy: `docker-compose ps`

### Lỗi: Connection refused
- **Nguyên nhân:** Port đã được sử dụng hoặc service chưa start
- **Giải pháp:** Kiểm tra port conflict, restart services

---

## 8. Quick Test Script (Bash)

Lưu file này thành `quick_test.sh`:

```bash
#!/bin/bash

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "🧪 Testing Authentication Flow"

# 1. Login
echo -e "\n${GREEN}1. Login...${NC}"
RESPONSE=$(curl -s -X POST "http://localhost:8001/api/v1/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123")

TOKEN=$(echo $RESPONSE | jq -r '.access_token')
USERNAME=$(echo $RESPONSE | jq -r '.user.username')

if [ "$TOKEN" != "null" ]; then
  echo -e "${GREEN}✓ Login successful${NC}"
else
  echo -e "${RED}✗ Login failed${NC}"
  exit 1
fi

# 2. Validate
echo -e "\n${GREEN}2. Testing validate endpoint...${NC}"
curl -s -X POST "http://localhost:8001/api/v1/auth/validate" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"$USERNAME\"}" | jq

# 3. Test Residents Service
echo -e "\n${GREEN}3. Testing residents service...${NC}"
curl -s -X GET "http://localhost:8002/api/v1/households" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Username: $USERNAME" | jq

# 4. Test Feedback Service
echo -e "\n${GREEN}4. Testing feedback service...${NC}"
curl -s -X GET "http://localhost:8003/api/v1/feedbacks" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-Username: $USERNAME" | jq

echo -e "\n${GREEN}✓ All tests completed!${NC}"
```

Chạy:
```bash
chmod +x quick_test.sh
./quick_test.sh
```
