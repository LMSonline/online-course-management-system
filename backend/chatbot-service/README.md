# Chatbot Service

NLP chatbot service for LMS with RAG (Retrieval-Augmented Generation), LLM integration, and course recommendations.

## Overview

This service provides an intelligent chatbot that can:
- Answer questions about course content using RAG (vector search + LLM)
- Generate quiz questions from course content
- Summarize lessons with structured summaries
- Explain code snippets line-by-line
- Provide general educational explanations
- Recommend courses based on user preferences
- Generate personalized study plans (with constraints: exam dates, free days, completed lessons)

## Architecture

- **RAG Pipeline**: FAISS vector store + hybrid search (vector + BM25) + Llama 3 LLM
- **LLM Abstraction**: Configurable LLM providers (Dummy for dev, Llama3 for production) with automatic fallback
- **Conversation Management**: Postgres-backed session and message storage
- **Intent Routing**: NLU-based intent detection with handler-based architecture (Strategy pattern)
- **Multi-Source Ingestion**: Support for LMS DB, Markdown, HTML, PDF, and transcript files
- **Analytics**: User stats, global stats, and session search capabilities

## Setup

### Prerequisites

- Python 3.11+
- Postgres database (for chat sessions/messages and LMS course data)

### Installation

```bash
cd backend/chatbot-service
pip install -r requirements.txt
pip install -r requirements-dev.txt  # For development
```

### Environment Variables

Create a `.env` file (or use `.env.dev`, `.env.test`, `.env.prod`):

**Required for production (real LLM):**
```bash
# Environment
ENV=dev

# Disable demo mode to use real LLM
DEMO_MODE=false

# LLM Configuration (Groq API)
LLM_PROVIDER=llama3
LLAMA3_API_BASE=https://api.groq.com/openai/v1
LLAMA3_API_KEY=your-groq-api-key-here
LLAMA3_MODEL_NAME=llama-3-8b-instruct

# Database (chat sessions/messages)
# For Docker Compose: use "postgres" as host (service name)
# For local dev: use "localhost"
CHAT_DB_HOST=localhost  # or postgres for Docker Compose
CHAT_DB_PORT=5432
CHAT_DB_NAME=lms
CHAT_DB_USER=postgres
CHAT_DB_PASSWORD=postgres

# Vector Store
VECTOR_STORE_BACKEND=faiss  # or inmemory
VECTOR_STORE_DIR=./vector_store

# Search Configuration
SEARCH_MODE=hybrid  # vector | bm25 | hybrid
HYBRID_ALPHA=0.6

# CORS (comma-separated list of allowed frontend origins)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Optional: API Key Authentication (if set, requires X-API-KEY header)
# Leave unset for dev mode (no auth required)
# CHATBOT_INTERNAL_API_KEY=your-secret-api-key

# Recommendation Service
RS_BASE_URL=http://localhost:8002
```

**Minimum required for frontend integration:**
- `DEMO_MODE=false` (to use real LLM instead of mock responses)
- `LLM_PROVIDER=llama3`
- `LLAMA3_API_BASE` and `LLAMA3_API_KEY` (Groq API credentials)
- `CORS_ALLOWED_ORIGINS` (frontend dev server URL, e.g., `http://localhost:3000`)

**Stateless demo mode (no database):**
```bash
# Enable NO_DB_MODE to run without Postgres
NO_DB_MODE=true

# Still need LLM configuration
DEMO_MODE=false
LLM_PROVIDER=llama3
LLAMA3_API_BASE=https://api.groq.com/openai/v1
LLAMA3_API_KEY=your-groq-api-key
LLAMA3_MODEL_NAME=llama-3-8b-instruct

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

In `NO_DB_MODE`:
- No database connection required
- Sessions and messages stored in-memory only (lost on restart)
- Session IDs are generated/echoed per request
- LLM still works (real Groq/Llama3)
- Perfect for demos and stateless deployments

## Running the Service

### Local Development

```bash
uvicorn app.main:app --reload --port 8003
```

The service will be available at `http://localhost:8003`.

API documentation: `http://localhost:8003/docs`

### Stateless Demo Mode (No Database)

Run the chatbot without any database dependency:

```bash
# Set environment variable
export NO_DB_MODE=true

# Or in .env file
NO_DB_MODE=true

# Start service
uvicorn app.main:app --reload --port 8003
```

**Features:**
- ✅ No Postgres required
- ✅ Real LLM (Groq/Llama3) still works
- ✅ Sessions stored in-memory only
- ✅ Perfect for demos and stateless deployments

**Example free-chat request (no DB, no auth):**
```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{"text":"hello"}'
```

**PowerShell examples:**
```powershell
# Health check
Invoke-WebRequest -Uri "http://localhost:8003/health" -Method GET | Select-Object -ExpandProperty Content

# Chat message (minimal body)
$body = @{text="hello"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:8003/api/v1/chat/messages" -Method POST -Body $body -ContentType "application/json" | Select-Object -ExpandProperty Content
```

**Example response:**
```json
{
  "reply": "Hi there! How can I help you study today?",
  "session_id": "session_a1b2c3d4e5f6"
}
```

**Note:** Session IDs are generated per request if not provided. Sessions and messages are stored in-memory and lost on service restart.

### Docker Compose

The service is configured to work with Docker Compose. It expects a Postgres service named `postgres`.

**Required environment variables for Docker Compose:**

```bash
# Database (use "postgres" as host - Docker Compose service name)
LMS_DB_HOST=postgres  # or CHAT_DB_HOST=postgres
LMS_DB_PORT=5432
LMS_DB_NAME=lms
LMS_DB_USER=postgres
LMS_DB_PASSWORD=postgres

# LLM Configuration
DEMO_MODE=false
LLM_PROVIDER=llama3
LLAMA3_API_BASE=https://api.groq.com/openai/v1
LLAMA3_API_KEY=your-groq-api-key
LLAMA3_MODEL_NAME=llama-3-8b-instruct

# CORS (comma-separated)
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Optional: API Key Authentication
CHATBOT_INTERNAL_API_KEY=super-secret-key
```

**Example docker-compose.yml snippet:**

```yaml
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: lms
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  chatbot-service:
    build: ./backend/chatbot-service
    ports:
      - "8003:8003"
    environment:
      LMS_DB_HOST: postgres
      LMS_DB_PORT: 5432
      LMS_DB_NAME: lms
      LMS_DB_USER: postgres
      LMS_DB_PASSWORD: postgres
      DEMO_MODE: "false"
      LLM_PROVIDER: llama3
      LLAMA3_API_BASE: https://api.groq.com/openai/v1
      LLAMA3_API_KEY: ${LLAMA3_API_KEY}
      LLAMA3_MODEL_NAME: llama-3-8b-instruct
      CORS_ALLOWED_ORIGINS: http://localhost:3000,http://localhost:5173
      CHATBOT_INTERNAL_API_KEY: ${CHATBOT_INTERNAL_API_KEY:-}
    depends_on:
      - postgres
    restart: unless-stopped

volumes:
  postgres_data:
```

**Running with Docker Compose:**

```bash
# Start services
docker-compose up -d chatbot-service

# Check logs
docker-compose logs -f chatbot-service

# Test health endpoint
curl http://localhost:8003/health

# Test chat endpoint (no auth required for free-chat MVP)
curl -X POST http://localhost:8003/api/v1/chat/messages \
  -H "Content-Type: application/json" \
  -d '{"text":"Hello"}'
```

**Notes:**
- The service automatically retries database connection up to 30 times with exponential backoff
- Database host defaults to `postgres` (Docker Compose service name) but can be overridden
- Startup logs show which database host is being used (no secrets)
- Server binds to `0.0.0.0:8003` inside the container

## Ingesting Course Content

Before using the chatbot, you need to ingest course content into the vector store.

### From LMS Database

```bash
# Using CLI
python -m app.cli ingest-lms [course_id]

# Or using script directly
python -m app.scripts.ingest_from_lms [course_id]
```

### From Files/Folders

The service supports multiple file formats:
- **Markdown** (`.md`, `.markdown`)
- **HTML** (`.html`, `.htm`)
- **PDF** (`.pdf`)
- **Transcripts** (`.srt`, `.vtt`, `.txt`)
- **JSONL** (`.jsonl`) - Course video datasets

```bash
# Using CLI
python -m app.cli ingest-folder --path ./data/courses --course-id course_python --chunking-strategy semantic

# Or using script directly
python -m app.scripts.ingest_from_folder --path ./data/courses --course-id course_python
```

### Embedding Backends

The ingestion pipeline supports two embedding backends:

**1. Dummy Embeddings (Offline Mode - Default in Dev)**
- No network required
- Deterministic, hash-based embeddings
- Suitable for demos and offline development
- Set via: `EMBEDDING_BACKEND=dummy`

**2. Sentence Transformers (Requires Network)**
- Uses sentence-transformers library
- Downloads models from HuggingFace on first use
- Better quality embeddings for production
- Set via: `EMBEDDING_BACKEND=sentence_transformers`

**Example:**
```bash
# Offline mode (default in dev)
python -m app.cli ingest-folder ../../data/course_videos.jsonl --course-id course_python_basic

# With real embeddings (requires network)
export EMBEDDING_BACKEND=sentence_transformers
python -m app.cli ingest-folder ../../data/course_videos.jsonl --course-id course_python_basic
```

### Chunking Strategies

- **Fixed-size**: Chunks by character/token count with overlap
- **Semantic**: Chunks by headings/sections (best for Markdown/HTML)

This will:
1. Load content from source (DB or files)
2. Chunk the content using selected strategy
3. Generate embeddings
4. Store in the configured vector store backend

## Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html

# Run specific test file
pytest tests/test_vector_store.py
```

## Running Evaluation

Evaluate RAG retrieval quality:

```bash
python -m app.eval.rag_eval
```

This computes Recall@K and MRR metrics on the test dataset.

## CLI Tools

The service includes a CLI tool for common operations:

```bash
# Ingest from LMS database
python -m app.cli ingest-lms [course_id]

# Ingest from folder
python -m app.cli ingest-folder --path ./data/courses --course-id course_python

# Evaluate RAG
python -m app.cli eval-rag

# Show configuration
python -m app.cli show-config
```

## API Examples

### Send a chat message (Frontend-friendly format)

**Minimal request (session_id and user_id are optional):**
```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "What is Python?",
    "current_course_id": "course_python_basic"
  }'
```

**With session and user context:**
```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "What is Python?",
    "session_id": "session-123",
    "user_id": "user1",
    "current_course_id": "course_python_basic",
    "language": "en"
  }'
```

**With API key (if CHATBOT_INTERNAL_API_KEY is set):**
```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: your-secret-api-key" \
  -d '{
    "text": "What is Python?",
    "current_course_id": "course_python_basic"
  }'
```

**Example response:**
```json
{
  "reply": "Python is a high-level programming language...",
  "session_id": "session_abc123def456"
}
```

### Check service health

```bash
curl "http://localhost:8003/health"
```

**Example response (with DB):**
```json
{
  "status": "ok",
  "service": "chatbot-service",
  "demo_mode": false,
  "no_db_mode": false,
  "db_connected": true,
  "llm_provider": "llama3",
  "llm_configured": true
}
```

**Example response (NO_DB_MODE):**
```json
{
  "status": "ok",
  "service": "chatbot-service",
  "demo_mode": false,
  "no_db_mode": true,
  "db_connected": false,
  "llm_provider": "llama3",
  "llm_configured": true
}
```

### Generate quiz

```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session-123",
    "user_id": "user1",
    "text": "Tạo cho em 5 câu trắc nghiệm về Python",
    "current_course_id": "course_python_basic"
  }'
```

### Summarize lesson

```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session-123",
    "user_id": "user1",
    "text": "Tóm tắt bài học này",
    "current_course_id": "course_python_basic",
    "lesson_id": "lesson_1"
  }'
```

### Explain code

```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session-123",
    "user_id": "user1",
    "text": "Giải thích code này:\n```python\ndef hello():\n    print(\"Hello\")\n```",
    "language": "python"
  }'
```

### Study plan with constraints

```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session-123",
    "user_id": "user1",
    "text": "Tạo kế hoạch học tập",
    "current_course_id": "course_python_basic",
    "exam_date": "2024-12-31T00:00:00Z",
    "free_days_per_week": 5,
    "completed_lessons": ["lesson_1", "lesson_2"]
  }'
```

### Get chat sessions

```bash
curl "http://localhost:8003/api/v1/chat/sessions?user_id=user1"
```

### Get user analytics

```bash
curl "http://localhost:8003/api/v1/chat/stats/user/user1"
```

### Get global analytics

```bash
curl "http://localhost:8003/api/v1/chat/stats/global"
```

### Search sessions

```bash
curl "http://localhost:8003/api/v1/chat/sessions/search?user_id=user1&q=Python"
```

### Re-index course content (admin)

```bash
curl -X POST "http://localhost:8003/api/v1/admin/courses/course_python_basic/reindex"
```

## Project Structure

```
app/
├── api/           # FastAPI routes and dependencies
│   └── v1/
│       ├── chat.py          # Chat endpoints
│       ├── sessions.py      # Session management
│       ├── analytics.py     # Analytics endpoints
│       └── admin.py         # Admin endpoints
├── core/          # Settings, logging, error handling
├── domain/        # Domain models and enums
├── infra/         # Infrastructure (vector store, LLM client, DB repos)
├── ingestion/     # Multi-source ingestion pipeline
│   ├── loaders/   # Content loaders (DB, Markdown, HTML, PDF, transcripts)
│   └── chunkers/  # Chunking strategies (fixed-size, semantic)
├── services/       # Business logic
│   ├── handlers/  # Intent handlers (Strategy pattern)
│   ├── chat_service.py
│   ├── retrieval_service.py
│   ├── analytics_service.py
│   └── ...
├── scripts/       # CLI scripts (ingestion)
├── eval/          # Evaluation scripts
└── cli.py         # Typer CLI tool
```

## Development

### Code Formatting

```bash
black app/ tests/
ruff check app/ tests/
```

### Adding New Intent Handlers

1. Create handler class implementing `IntentHandler` interface
2. Register in `ChatService.handlers` mapping
3. Add tests in `tests/test_chat_service.py`

## License

MIT

