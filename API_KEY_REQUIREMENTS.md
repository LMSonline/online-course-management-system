# Yêu Cầu API Key - Llama3

## Tóm Tắt

### ✅ Chatbot Service
- **Mặc định:** KHÔNG CẦN API key (dùng `LLM_PROVIDER=dummy`)
- **Nếu muốn dùng Llama3:** CẦN API key

### ✅ Recommendation Service  
- **KHÔNG CẦN API key** (không dùng LLM)

---

## Chi Tiết

### Chatbot Service

#### 1. Chế độ mặc định (KHÔNG CẦN API KEY)

Mặc định, Chatbot Service sử dụng `LLM_PROVIDER=dummy` - đây là một mock LLM client chỉ echo lại prompt. **Không cần API key** để chạy service.

**Cấu hình mặc định:**
```bash
LLM_PROVIDER=dummy
```

**Khi nào dùng:**
- Development local
- Testing
- Demo (nếu không cần response thật từ LLM)

#### 2. Chế độ Llama3 (CẦN API KEY)

Nếu muốn dùng LLM thật (Llama3), cần set các biến môi trường sau:

```bash
LLM_PROVIDER=llama3
LLAMA3_API_BASE=https://api.groq.com/openai/v1
LLAMA3_API_KEY=your-api-key-here
LLAMA3_MODEL_NAME=llama-3-8b-instruct
LLAMA3_TIMEOUT=30.0
```

**Các provider hỗ trợ:**
- **Groq**: `https://api.groq.com/openai/v1`
- **Fireworks**: `https://api.fireworks.ai/inference/v1`
- Bất kỳ API nào tương thích OpenAI format

**Cách lấy API key:**
1. **Groq**: Đăng ký tại https://console.groq.com/
2. **Fireworks**: Đăng ký tại https://fireworks.ai/

**Lưu ý:**
- Nếu set `LLM_PROVIDER=llama3` nhưng không có `LLAMA3_API_KEY`, service sẽ **crash khi khởi động** với lỗi: `ValueError: LLAMA3_API_KEY must be set for Llama3Client.`
- Fallback: Nếu Llama3 client fail, hệ thống sẽ tự động fallback về DummyLLMClient

#### 3. Cách set environment variables

**Option 1: Tạo file `.env.dev`**
```bash
cd backend/chatbot-service
cat > .env.dev << EOF
ENV=dev
LLM_PROVIDER=dummy
# Hoặc nếu muốn dùng Llama3:
# LLM_PROVIDER=llama3
# LLAMA3_API_BASE=https://api.groq.com/openai/v1
# LLAMA3_API_KEY=your-key-here
# LLAMA3_MODEL_NAME=llama-3-8b-instruct
EOF
```

**Option 2: Export trực tiếp**
```bash
export LLM_PROVIDER=dummy
# Hoặc
export LLM_PROVIDER=llama3
export LLAMA3_API_BASE=https://api.groq.com/openai/v1
export LLAMA3_API_KEY=your-key-here
```

**Option 3: Docker Compose**
Trong `docker-compose.yml`, đã có sẵn:
```yaml
environment:
  LLM_PROVIDER: ${LLM_PROVIDER:-dummy}
  LLAMA3_API_BASE: ${LLAMA3_API_BASE:-}
  LLAMA3_API_KEY: ${LLAMA3_API_KEY:-}
```

---

### Recommendation Service

**KHÔNG CẦN API KEY** - Service này không sử dụng LLM, chỉ dùng:
- Machine learning models (Two-Tower)
- Heuristic algorithms (Popularity, Content-based)
- Không cần LLM API

---

## Kiểm Tra Cấu Hình Hiện Tại

### Chatbot Service

```bash
cd backend/chatbot-service
python -m app.cli show-config
```

Output sẽ hiển thị:
```
LLM Provider: dummy  # hoặc llama3
```

### Recommendation Service

```bash
cd backend/recommendation-service
python -m app.cli show-config
```

---

## Khuyến Nghị Cho Demo

### ✅ Cho Demo Video (5-7 phút)

**KHÔNG CẦN API KEY** - Dùng `LLM_PROVIDER=dummy`:
- Service chạy được ngay
- Response vẫn có format đúng (chỉ là echo prompt)
- Đủ để demo flow và architecture
- Không tốn chi phí API

### ✅ Cho Production / Testing Thật

**CẦN API KEY** - Dùng `LLM_PROVIDER=llama3`:
- Response thật từ LLM
- Chất lượng tốt hơn
- Cần có API key hợp lệ

---

## Troubleshooting

### Lỗi: "LLAMA3_API_KEY must be set for Llama3Client"

**Nguyên nhân:** Set `LLM_PROVIDER=llama3` nhưng chưa có API key.

**Giải pháp:**
1. Set `LLM_PROVIDER=dummy` (không cần API key)
2. Hoặc thêm `LLAMA3_API_KEY` vào `.env.dev`

### Lỗi: "LLAMA3_API_BASE must be set for Llama3Client"

**Nguyên nhân:** Thiếu `LLAMA3_API_BASE`.

**Giải pháp:** Thêm vào `.env.dev`:
```bash
LLAMA3_API_BASE=https://api.groq.com/openai/v1
```

---

## Tóm Tắt Nhanh

| Service | Cần API Key? | Mặc Định | Khi Nào Cần |
|---------|-------------|----------|-------------|
| **Chatbot** | ❌ (dummy) / ✅ (llama3) | `dummy` | Chỉ khi `LLM_PROVIDER=llama3` |
| **Recommendation** | ❌ | N/A | Không bao giờ |

**Kết luận:** Để demo, em **KHÔNG CẦN** thêm API key. Chỉ cần đảm bảo `LLM_PROVIDER=dummy` (mặc định).

