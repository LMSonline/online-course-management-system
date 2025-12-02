# Chatbot Service

NLP chatbot service for LMS with RAG (Retrieval-Augmented Generation), LLM integration, and course recommendations.

## Overview

This service provides an intelligent chatbot that can:
- Answer questions about course content using RAG (vector search + LLM)
- Provide general educational explanations
- Recommend courses based on user preferences
- Generate personalized study plans

## Architecture

- **RAG Pipeline**: FAISS vector store + hybrid search (vector + BM25) + Llama 3 LLM
- **LLM Abstraction**: Configurable LLM providers (Dummy for dev, Llama3 for production) with automatic fallback
- **Conversation Management**: Postgres-backed session and message storage
- **Intent Routing**: NLU-based intent detection with handler-based architecture

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

```bash
# Environment
ENV=dev

# Database (chat sessions/messages)
CHAT_DB_HOST=localhost
CHAT_DB_PORT=5432
CHAT_DB_NAME=lms
CHAT_DB_USER=postgres
CHAT_DB_PASSWORD=postgres

# LLM Configuration
LLM_PROVIDER=dummy  # or llama3
LLAMA3_API_BASE=https://api.groq.com/openai/v1
LLAMA3_API_KEY=your-api-key
LLAMA3_MODEL_NAME=llama-3-8b-instruct

# Vector Store
VECTOR_STORE_BACKEND=faiss  # or inmemory
VECTOR_STORE_DIR=./vector_store

# Search Configuration
SEARCH_MODE=hybrid  # vector | bm25 | hybrid
HYBRID_ALPHA=0.6

# Recommendation Service
RS_BASE_URL=http://localhost:8002
```

## Running the Service

```bash
uvicorn app.main:app --reload --port 8003
```

The service will be available at `http://localhost:8003`.

API documentation: `http://localhost:8003/docs`

## Ingesting Course Content

Before using the chatbot, you need to ingest course content into the vector store:

```bash
# Set LMS DB connection env vars
export LMS_DB_HOST=localhost
export LMS_DB_PORT=5432
export LMS_DB_NAME=lms
export LMS_DB_USER=postgres
export LMS_DB_PASSWORD=postgres

# Run ingestion
python -m app.scripts.ingest_courses
```

This will:
1. Fetch courses and lessons from LMS Postgres
2. Chunk the content
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

## API Examples

### Send a chat message

```bash
curl -X POST "http://localhost:8003/api/v1/chat/messages" \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "session-123",
    "user_id": "user1",
    "text": "What is Python?",
    "current_course_id": "course_python_basic",
    "debug": false
  }'
```

### Get chat sessions

```bash
curl "http://localhost:8003/api/v1/chat/sessions?user_id=user1"
```

### Re-index course content (admin)

```bash
curl -X POST "http://localhost:8003/api/v1/admin/courses/course_python_basic/reindex"
```

## Project Structure

```
app/
├── api/           # FastAPI routes and dependencies
├── core/          # Settings, logging, error handling
├── domain/        # Domain models and enums
├── infra/         # Infrastructure (vector store, LLM client, DB repos)
├── services/       # Business logic (chat service, retrieval, NLU)
├── scripts/       # CLI scripts (ingestion)
└── eval/          # Evaluation scripts
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

