# Sử dụng Python image nhẹ
FROM python:3.11-slim

# Không tạo .pyc, log hiển thị ngay
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

# Thư mục làm việc trong container
WORKDIR /app

# Cài dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code vào container
COPY app ./app

# Expose port RS service dùng (8002 như lúc mình chạy uvicorn)
EXPOSE 8002

# Lệnh chạy service
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8002"]
