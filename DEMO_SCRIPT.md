# KỊCH BẢN DEMO VIDEO - Online Course Management System

## 1. Tóm tắt hệ thống (cho phần mở đầu video)

Đồ án của nhóm em gồm 2 service chính. **Chatbot Service** sử dụng RAG (Retrieval-Augmented Generation) để trả lời câu hỏi về nội dung khóa học. Service này có khả năng nhận diện intent từ câu hỏi của người dùng, sau đó dùng vector search để tìm đoạn nội dung liên quan từ vector store, rồi nhờ LLM để tạo câu trả lời bám sát tài liệu. Ngoài ra, chatbot còn hỗ trợ tạo quiz, tóm tắt bài học, giải thích code, và tạo kế hoạch học tập cá nhân hóa. **Recommendation Service** sử dụng mô hình Two-Tower để gợi ý khóa học cho người dùng. Service này kết hợp nhiều thuật toán: Two-Tower (deep learning), Popularity-based, Content-based, và Hybrid recommender. Hệ thống còn có cơ chế online learning với epsilon-greedy bandit để tự động chọn strategy tốt nhất dựa trên phản hồi của người dùng.

---

## 2. Chuẩn bị trước khi quay

Trước khi quay video, làm các bước sau:

- **Cài đặt dependencies:**
  - Chạy `make install` hoặc cài thủ công:
    ```bash
    pip install -r backend/chatbot-service/requirements.txt
    pip install -r backend/recommendation-service/requirements.txt
    ```

- **Khởi động PostgreSQL:**
  - Chạy `docker-compose up -d postgres` hoặc start PostgreSQL thủ công
  - Đảm bảo database `lms` đã được tạo

- **Ingest dữ liệu khóa học vào vector store (Chatbot Service):**
  ```bash
  cd backend/chatbot-service
  python -m app.cli ingest-folder --path ../../data/course_videos.jsonl --course-id course_python_basic
  ```
  Hoặc nếu có dữ liệu từ LMS DB:
  ```bash
  python -m app.cli ingest-lms all
  ```

- **Khởi động Chatbot Service:**
  - Terminal 1: `make run-chatbot` hoặc `cd backend/chatbot-service && uvicorn app.main:app --reload --port 8003`
  - Service sẽ chạy tại `http://localhost:8003`
  - Swagger UI: `http://localhost:8003/docs`

- **Khởi động Recommendation Service:**
  - Terminal 2: `make run-recommendation` hoặc `cd backend/recommendation-service && uvicorn app.main:app --reload --port 8002`
  - Service sẽ chạy tại `http://localhost:8002`
  - Swagger UI: `http://localhost:8002/docs`

- **Kiểm tra services đã chạy:**
  ```bash
  curl http://localhost:8003/health
  curl http://localhost:8002/health
  ```

- **Chuẩn bị user_id và session_id để demo:**
  - User ID: `user123` (hoặc bất kỳ ID nào)
  - Session ID: `demo-session-1` (hoặc tự generate)

---

## 3. Kịch bản demo chi tiết (có thoại)

### Bước 1: Giới thiệu tổng quan hệ thống

- **Màn hình/Action:**
  - Mở trình duyệt, hiển thị 2 tab:
    - Tab 1: Swagger UI của Chatbot Service tại `http://localhost:8003/docs`
    - Tab 2: Swagger UI của Recommendation Service tại `http://localhost:8002/docs`
  - Hoặc có thể mở terminal để show các service đang chạy

- **Lời thoại:**
  - "Đây là đồ án Online Course Management System của nhóm em. Hệ thống gồm 2 service chính: Chatbot Service chạy ở port 8003 và Recommendation Service chạy ở port 8002. Cả 2 service đều dùng FastAPI và có Swagger UI để test API."

---

### Bước 2: Demo Chatbot Service - Câu hỏi về nội dung khóa học (RAG)

- **Màn hình/Action:**
  - Mở Swagger UI Chatbot Service tại `http://localhost:8003/docs`
  - Tìm endpoint `POST /api/v1/chat/messages`, nhấn `Try it out`
  - Nhập JSON body:
    ```json
    {
      "session_id": "demo-session-1",
      "user_id": "user123",
      "text": "What is Python?",
      "current_course_id": "course_python_basic",
      "debug": false
    }
    ```
  - Nhấn `Execute` hoặc `Send`
  - Show response từ API

- **Lời thoại:**
  - "Giờ em demo Chatbot Service với use case hỏi đáp về nội dung khóa học. Em gửi câu hỏi 'What is Python?', hệ thống sẽ dùng RAG để tìm nội dung liên quan từ vector store, sau đó nhờ LLM trả lời bám sát tài liệu khóa học."
  - (Sau khi có response) "Đây là câu trả lời từ chatbot, dựa trên nội dung đã được ingest vào vector store."

---

### Bước 3: Demo Chatbot Service - Tạo quiz (Intent: GenerateQuiz)

- **Màn hình/Action:**
  - Vẫn ở Swagger UI Chatbot Service
  - Giữ nguyên endpoint `POST /api/v1/chat/messages`, nhấn `Try it out` lại
  - Nhập JSON body mới:
    ```json
    {
      "session_id": "demo-session-1",
      "user_id": "user123",
      "text": "Tạo cho em 5 câu trắc nghiệm về Python",
      "current_course_id": "course_python_basic"
    }
    ```
  - Nhấn `Execute`
  - Show response

- **Lời thoại:**
  - "Tiếp theo, em demo chức năng tạo quiz. Em gửi yêu cầu tạo 5 câu trắc nghiệm về Python. Hệ thống sẽ tự động nhận diện intent là GenerateQuiz, sau đó lấy nội dung từ khóa học và tạo quiz bằng LLM."

---

### Bước 4: Demo Chatbot Service - Tạo kế hoạch học tập (Intent: StudyPlan)

- **Màn hình/Action:**
  - Vẫn ở Swagger UI Chatbot Service
  - Endpoint `POST /api/v1/chat/messages`, nhấn `Try it out`
  - Nhập JSON body:
    ```json
    {
      "session_id": "demo-session-1",
      "user_id": "user123",
      "text": "Tạo kế hoạch học tập cho em",
      "current_course_id": "course_python_basic",
      "exam_date": "2024-12-31T00:00:00Z",
      "free_days_per_week": 5,
      "completed_lessons": ["lesson_001"]
    }
    ```
  - Nhấn `Execute`
  - Show response

- **Lời thoại:**
  - "Em demo chức năng tạo kế hoạch học tập cá nhân hóa. Em cung cấp thông tin như ngày thi, số ngày rảnh mỗi tuần, và các bài đã hoàn thành. Hệ thống sẽ tạo một lộ trình học phù hợp với các ràng buộc này."

---

### Bước 5: Demo Chatbot Analytics - Thống kê người dùng

- **Màn hình/Action:**
  - Ở Swagger UI Chatbot Service, tìm endpoint `GET /api/v1/chat/stats/user/{user_id}`
  - Nhấn `Try it out`
  - Nhập `user_id`: `user123`
  - Nhấn `Execute`
  - Show response

- **Lời thoại:**
  - "Đây là analytics endpoint của Chatbot Service. Em có thể xem thống kê của một user cụ thể, bao gồm số session, số message, và phân bố intent."

---

### Bước 6: Demo Recommendation Service - Gợi ý khóa học

- **Màn hình/Action:**
  - Chuyển sang tab Swagger UI của Recommendation Service tại `http://localhost:8002/docs`
  - Tìm endpoint `GET /api/v1/recommendations/home`
  - Nhấn `Try it out`
  - Nhập query parameters:
    - `user_id`: `user123`
    - `explain`: `true` (checkbox)
    - `strategy`: để trống (dùng default) hoặc chọn `hybrid`
  - Nhấn `Execute`
  - Show response với danh sách khóa học được recommend

- **Lời thoại:**
  - "Giờ em chuyển sang Recommendation Service. Em gọi API để lấy danh sách khóa học được gợi ý cho user. Service này sử dụng mô hình Two-Tower kết hợp với các thuật toán khác như Popularity và Content-based để tạo hybrid recommender."
  - (Sau khi có response) "Đây là top 5 khóa học được recommend, mỗi khóa học có lý do giải thích tại sao được gợi ý."

---

### Bước 7: Demo Recommendation Service - Thử các strategy khác nhau

- **Màn hình/Action:**
  - Vẫn ở endpoint `GET /api/v1/recommendations/home`
  - Thử lại với `strategy`: `popularity` (nhập vào query parameter)
  - Nhấn `Execute`
  - Show response

- **Lời thoại:**
  - "Hệ thống hỗ trợ nhiều strategy khác nhau. Em có thể chọn strategy cụ thể, ví dụ như popularity-based để xem các khóa học phổ biến nhất."

---

### Bước 8: Demo Recommendation Analytics và Admin

- **Màn hình/Action:**
  - Ở Swagger UI Recommendation Service, tìm endpoint `GET /api/v1/recommendations/stats/global`
  - Nhấn `Try it out`, nhấn `Execute`
  - Show response
  - Sau đó chuyển sang endpoint `GET /admin/recommendations/models`
  - Nhấn `Try it out`, nhấn `Execute`
  - Show response về thông tin model

- **Lời thoại:**
  - "Cuối cùng, em demo analytics và admin endpoints. Endpoint stats/global cho biết thống kê tổng quan như CTR toàn hệ thống, phân bố strategy, và các khóa học phổ biến nhất."
  - "Endpoint admin/models cho biết thông tin về model đã được train, số lượng item đã được index, và các checkpoint có sẵn."

---

### Bước 9: Tổng kết

- **Màn hình/Action:**
  - Có thể quay lại Swagger UI của cả 2 services để tổng kết
  - Hoặc show terminal với logs của services

- **Lời thoại:**
  - "Tóm lại, hệ thống của nhóm em có 2 service chính: Chatbot Service với RAG và LLM để trả lời câu hỏi, tạo quiz, và kế hoạch học tập; Recommendation Service với Two-Tower model để gợi ý khóa học cá nhân hóa. Cả 2 service đều có analytics và admin endpoints để theo dõi và quản lý hệ thống."

---

## Lưu ý khi quay video

1. **Thời gian:** Mỗi bước nên mất khoảng 30-60 giây, tổng cộng khoảng 5-7 phút
2. **Tốc độ nói:** Nói chậm rãi, rõ ràng, không cần vội
3. **Màn hình:** Đảm bảo màn hình rõ nét, có thể zoom vào phần JSON body và response nếu cần
4. **Lỗi:** Nếu có lỗi, có thể nói "Để em kiểm tra lại" và sửa, hoặc skip sang bước khác
5. **Tùy chọn:** Có thể thêm bước demo CLI commands nếu muốn:
   - `python -m app.cli show-config` (Chatbot Service)
   - `python -m app.cli show-config` (Recommendation Service)

---

## Sample JSON Bodies (để copy nhanh)

### Chatbot - Câu hỏi thường
```json
{
  "session_id": "demo-session-1",
  "user_id": "user123",
  "text": "What is Python?",
  "current_course_id": "course_python_basic",
  "debug": false
}
```

### Chatbot - Tạo quiz
```json
{
  "session_id": "demo-session-1",
  "user_id": "user123",
  "text": "Tạo cho em 5 câu trắc nghiệm về Python",
  "current_course_id": "course_python_basic"
}
```

### Chatbot - Kế hoạch học tập
```json
{
  "session_id": "demo-session-1",
  "user_id": "user123",
  "text": "Tạo kế hoạch học tập cho em",
  "current_course_id": "course_python_basic",
  "exam_date": "2024-12-31T00:00:00Z",
  "free_days_per_week": 5,
  "completed_lessons": ["lesson_001"]
}
```

---

## Endpoints Summary

### Chatbot Service (Port 8003)
- `POST /api/v1/chat/messages` - Gửi message, nhận reply
- `GET /api/v1/chat/stats/user/{user_id}` - Thống kê user
- `GET /api/v1/chat/stats/global` - Thống kê toàn hệ thống
- `GET /api/v1/chat/sessions/search` - Tìm kiếm sessions
- `GET /health` - Health check

### Recommendation Service (Port 8002)
- `GET /api/v1/recommendations/home` - Lấy recommendations cho user
- `GET /api/v1/recommendations/similar/{course_id}` - Khóa học tương tự
- `GET /api/v1/recommendations/stats/user/{user_id}` - Thống kê user
- `GET /api/v1/recommendations/stats/global` - Thống kê toàn hệ thống
- `GET /admin/recommendations/models` - Thông tin model
- `POST /admin/recommendations/reindex` - Rebuild index
- `GET /health` - Health check

---

Chúc em quay video thành công! 🎥

