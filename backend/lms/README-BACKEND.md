# LMS Backend - Hướng Dẫn Build và Setup Docker

## 1. Điều Kiện Cần Thiết

### Phần Mềm Yêu Cầu

- Docker Desktop (phiên bản 20.10 trở lên)
- Docker Compose (phiên bản 2.0 trở lên)

### Kiểm Tra Cài Đặt

```bash
docker --version
docker-compose --version
```

### QUAN TRỌNG: Khởi Động Docker Desktop

Trước khi build, PHẢI khởi động Docker Desktop:

**Windows:**
- Mở Docker Desktop từ Start Menu
- Đợi cho đến khi thấy biểu tượng Docker ở system tray (góc phải dưới màn hình)
- Đợi status chuyển sang "Docker Desktop is running"

**MacOS:**
- Mở Docker Desktop từ Applications
- Đợi cho đến khi thấy biểu tượng Docker ở menu bar (góc trái trên màn hình)
- Đợi status chuyển sang "Docker Desktop is running"

**Linux:**
- Docker service thường tự động chạy
- Nếu không, chạy: `sudo systemctl start docker`

Kiểm tra Docker đang chạy:
```bash
docker ps
```

Nếu thấy lỗi "Cannot connect to the Docker daemon", nghĩa là Docker Desktop chưa khởi động.

### Cấu Trúc Thư Mục

```
lms-backend/
├── docker-compose.yml
├── Dockerfile
├── .env                    # Cần tạo file này
├── build.gradle.kts        # Gradle Kotlin DSL
├── settings.gradle.kts
└── src/
    └── main/
        ├── kotlin/         # hoặc java/
        └── resources/
            └── application.yml
```

## 2. Quá Trình Build

### Bước 1: Đảm Bảo Docker Desktop Đang Chạy

Kiểm tra lại:
```bash
docker ps
```

Kết quả đúng: Hiển thị danh sách containers (có thể rỗng)

Kết quả sai: "Cannot connect to the Docker daemon"

### Bước 2: Tạo File Cấu Hình (.env)

Tạo file `.env` trong thư mục gốc của project:

**Windows (PowerShell):**
```powershell
New-Item .env -ItemType File
```

**MacOS/Linux:**
```bash
touch .env
```

Sao chép nội dung sau vào file `.env`:

```env
# PostgreSQL Database
POSTGRES_IMAGE=postgres:15-alpine
POSTGRES_CONTAINER_NAME=lms-postgres
POSTGRES_DB=lms
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_PORT=5433

# Spring Boot Application
APP_CONTAINER_NAME=lms-backend
APP_PORT=8080
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_JPA_SHOW_SQL=true

# Email Configuration
SPRING_MAIL_HOST=smtp.gmail.com
SPRING_MAIL_PORT=587
SPRING_MAIL_USERNAME=your-email@gmail.com
SPRING_MAIL_PASSWORD=your-password

# Application URLs
APP_BASE_URL=http://localhost:8080
APP_FRONTEND_URL=http://localhost:3000

# JWT Security
JWT_SECRET=my-secret-key-at-least-32-characters-long
JWT_ACCESS_TOKEN_EXPIRATION=86400
JWT_REFRESH_TOKEN_EXPIRATION=604800

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# PgAdmin
PGADMIN_IMAGE=dpage/pgadmin4:latest
PGADMIN_CONTAINER_NAME=lms-pgadmin
PGADMIN_DEFAULT_EMAIL=admin@admin.com
PGADMIN_DEFAULT_PASSWORD=admin123
PGADMIN_PORT=5050
```

### Bước 3: Build Docker Images

Chạy lệnh build để tạo Docker images:

```bash
docker-compose build
```

Quá trình build sẽ:
- Tải base image (PostgreSQL, PgAdmin)
- Build Spring Boot application với Gradle
- Chạy `./gradlew build` để compile code
- Tạo JAR file từ build.gradle.kts
- Đóng gói vào Docker image

LƯU Ý: Quá trình build lần đầu có thể mất 5-10 phút tùy thuộc vào tốc độ mạng và máy tính.

### Bước 4: Xác Nhận Build Thành Công

Kiểm tra danh sách images đã build:

```bash
docker images | grep lms
```

Kết quả mong đợi (ví dụ):
```
lms-backend-app    latest    a1b2c3d4e5f6    2 minutes ago    350MB
```

## 3. Cách Chạy Application

### Khởi Động Tất Cả Services

```bash
docker-compose up -d
```

Lệnh này sẽ:
- Khởi động PostgreSQL database
- Khởi động Spring Boot application
- Khởi động PgAdmin
- Tạo network để các container giao tiếp với nhau

### Kiểm Tra Trạng Thái Containers

```bash
docker-compose ps
```

Kết quả mong đợi:
```
NAME              STATUS              PORTS
lms-backend       Up (healthy)        0.0.0.0:8080->8080/tcp
lms-postgres      Up (healthy)        0.0.0.0:5433->5432/tcp
lms-pgadmin       Up                  0.0.0.0:5050->80/tcp
```

Tất cả containers phải có STATUS là "Up" hoặc "Up (healthy)"

### Xem Logs Để Theo Dõi Quá Trình Khởi Động

```bash
# Xem logs của tất cả services
docker-compose logs -f

# Xem logs của backend
docker-compose logs -f app

# Xem logs của database
docker-compose logs -f postgres
```

Đợi cho đến khi thấy dòng:
```
Started LmsApplication in X.XXX seconds
```

## 4. Test Application

### Test 1: Kiểm Tra API Endpoint

Sử dụng curl:
```bash
curl http://localhost:8080/
```

Kết quả mong đợi:
```
Hello World
```

Sử dụng trình duyệt:
- Mở: http://localhost:8080/
- Kết quả: Hiển thị "Hello World"

### Test 2: Kiểm Tra API Documentation

Truy cập Swagger UI:
```
http://localhost:8080/swagger-ui.html
```

Tại đây bạn có thể:
- Xem tất cả API endpoints
- Test các API trực tiếp
- Xem request/response models

### Test 3: Kiểm Tra Kết Nối Database

Cách 1: Sử dụng PgAdmin

1. Mở trình duyệt: http://localhost:5050

2. Đăng nhập:
    - Email: `admin@admin.com`
    - Password: `admin123`

3. Thêm Server:
    - Click chuột phải "Servers" chọn "Register" chọn "Server"

   Tab General:
    - Name: `LMS Database`

   Tab Connection:
    - Host name: `postgres`
    - Port: `5432`
    - Maintenance database: `lms`
    - Username: `postgres`
    - Password: `postgres123`

    - Tick "Save password"
    - Click "Save"

4. Kiểm tra tables:
    - Mở Servers, LMS Database, Databases, lms, Schemas, public, Tables
    - Bạn sẽ thấy các tables như: users, courses, enrollments, etc.

Cách 2: Sử dụng Command Line

```bash
docker exec -it lms-postgres psql -U postgres -d lms -c "SELECT version();"
```

### Test 4: Test Login API

Cách 1: Sử dụng curl

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "login": "admin",
    "password": "Admin@123",
    "deviceInfo": "Windows 10 Chrome 142.0"
  }'
```

Cách 2: Sử dụng Postman

1. Mở Postman
2. Tạo request mới:
    - Method: POST
    - URL: `http://localhost:8080/api/v1/auth/login`
3. Chọn tab "Headers":
    - Key: `Content-Type`
    - Value: `application/json`
4. Chọn tab "Body":
    - Chọn "raw"
    - Chọn "JSON" trong dropdown
    - Nhập:
   ```json
   {
       "login": "admin",
       "password": "Admin@123",
       "deviceInfo": "Windows 10 Chrome 142.0"
   }
   ```
5. Click "Send"

Kết quả thành công sẽ trả về access token và refresh token

## 5. Dừng và Khởi Động Lại

### Dừng Tất Cả Services

```bash
docker-compose down
```

### Dừng và Xóa Tất Cả Dữ Liệu

CẢNH BÁO: Lệnh này sẽ xóa toàn bộ dữ liệu trong database

```bash
docker-compose down -v
```

### Khởi Động Lại

```bash
docker-compose up -d
```

### Khởi Động Lại Một Service Cụ Thể

```bash
# Khởi động lại backend
docker-compose restart app

# Khởi động lại database
docker-compose restart postgres
```

## 6. Rebuild Sau Khi Thay Đổi Code

Khi bạn thay đổi code Kotlin/Java:

```bash
# Build lại và khởi động
docker-compose up -d --build app

# Hoặc build lại từ đầu (không dùng cache)
docker-compose build --no-cache app
docker-compose up -d
```

## 7. Kết Nối Từ Frontend

### Base URL

```javascript
const API_BASE_URL = 'http://localhost:8080/api/v1';
```

### Ví Dụ Fetch API

```javascript
// Login
fetch('http://localhost:8080/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    login: 'admin',
    password: 'Admin@123',
    deviceInfo: 'Windows 10 Chrome 142.0'
  })
})
  .then(response => response.json())
  .then(data => console.log(data));
```

## 8. Tài Khoản Mặc Định

Hệ thống tự động tạo 3 tài khoản khi khởi động lần đầu:

| Role | Login | Password | Email |
|------|----------|----------|-------|
| Admin | admin | Admin@123 | admin@example.com |
| Teacher | teacher | Teacher@123 | teacher@example.com |
| Student | student | Student@123 | student@example.com |

Để đổi password: Sửa trong file `src/main/resources/application.yml`

## 9. Xử Lý Lỗi

### Lỗi: Cannot connect to the Docker daemon

```
Error response from daemon: dial unix docker.raw.sock: connect: connection refused
```

Nguyên nhân: Docker Desktop chưa được khởi động

Giải pháp:
1. Mở Docker Desktop
2. Đợi cho đến khi thấy "Docker Desktop is running"
3. Chạy lại lệnh build/up

### Lỗ: Port đã được sử dụng

```
Error: bind: address already in use
```

Giải pháp: Đổi port trong `.env`:
```env
APP_PORT=8081
POSTGRES_PORT=5434
PGADMIN_PORT=5051
```

### Lỗi: Container không khởi động

```bash
# Xem logs để biết lỗi
docker-compose logs app

# Khởi động lại
docker-compose restart app
```

### Lỗi: Không kết nối được database

```bash
# Kiểm tra database
docker-compose ps postgres

# Xem logs database
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Lỗi: Build thất bại với Gradle

```bash
# Xóa cache và build lại
docker-compose build --no-cache

# Hoặc chạy Gradle clean trước
./gradlew clean
docker-compose build
```

### Lỗi: Gradle permission denied (Linux/Mac)

```bash
chmod +x gradlew
docker-compose build
```

## 10. Lệnh Hữu Ích

```bash
# Xem logs realtime
docker-compose logs -f app

# Xem 100 dòng logs cuối
docker-compose logs --tail=100 app

# Vào shell của container
docker exec -it lms-backend /bin/bash

# Xem resource usage
docker stats

# Xóa tất cả containers và images
docker-compose down --rmi all -v

# List tất cả containers (kể cả stopped)
docker ps -a

# List tất cả images
docker images

# Xóa unused images
docker image prune -a
```

## 11. Checklist Trước Khi Build

- [ ] Docker Desktop đã được khởi động
- [ ] Chạy `docker ps` không báo lỗi
- [ ] File `.env` đã được tạo với đầy đủ thông tin
- [ ] File `build.gradle.kts` có trong project
- [ ] File `docker-compose.yml` có trong thư mục gốc
- [ ] Port 8080, 5433, 5050 chưa được sử dụng

---

© 2024 Group 5 / VN.UIT.LMS