# Online Course Management System

A production-ready LMS platform with AI-powered chatbot and recommendation system.

## Architecture

The system consists of three main components:

- **LMS Core** (`backend/lms`): Java/Spring Boot application managing courses, users, and enrollments
- **Chatbot Service** (`backend/chatbot-service`): FastAPI service providing RAG-based Q&A, quiz generation, code explanation, and study planning
- **Recommendation Service** (`backend/recommendation-service`): FastAPI service providing personalized course recommendations using multiple algorithms

## Quick Start

### Prerequisites

- Python 3.11+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone <repo-url>
cd online-course-management-system

# Start all services
make up

# Or manually:
docker-compose up -d
```

Services will be available at:
- Chatbot Service: http://localhost:8003
- Recommendation Service: http://localhost:8002
- PostgreSQL: localhost:5432

### Option 2: Local Development

```bash
# Install dependencies
make install

# Or manually:
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r backend/chatbot-service/requirements.txt
pip install -r backend/chatbot-service/requirements-dev.txt
pip install -r backend/recommendation-service/requirements.txt
pip install -r backend/recommendation-service/requirements-dev.txt

# Set up environment variables
cp backend/chatbot-service/.env.example backend/chatbot-service/.env.dev
cp backend/recommendation-service/.env.example backend/recommendation-service/.env.dev
# Edit .env.dev files with your configuration

# Run services
make run-chatbot      # In one terminal
make run-recommendation  # In another terminal
```

## Running Tests

```bash
# Run all tests
make test

# Run tests for specific service
make test-chatbot
make test-recommendation

# With coverage
cd backend/chatbot-service && pytest tests/ --cov=app --cov-report=html
cd backend/recommendation-service && pytest tests/ --cov=app --cov-report=html
```

## Development Workflow

```bash
# Format code
make format

# Lint code
make lint

# Run tests
make test

# Clean temporary files
make clean
```

## Project Structure

```
.
├── backend/
│   ├── chatbot-service/      # Chatbot microservice
│   │   ├── app/
│   │   │   ├── api/          # FastAPI routes
│   │   │   ├── core/          # Settings, logging, exceptions
│   │   │   ├── domain/        # Domain models
│   │   │   ├── infra/         # Infrastructure (DB, LLM, vector store)
│   │   │   ├── ingestion/     # Multi-source ingestion pipeline
│   │   │   ├── services/      # Business logic
│   │   │   └── scripts/       # CLI scripts
│   │   ├── tests/             # Test suite
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   ├── recommendation-service/  # Recommendation microservice
│   │   ├── app/
│   │   │   ├── api/           # FastAPI routes
│   │   │   ├── core/          # Settings, logging, exceptions
│   │   │   ├── recommenders/  # Recommender algorithms
│   │   │   ├── bandit/        # Online learning
│   │   │   ├── services/      # Business logic
│   │   │   └── scripts/       # Training scripts
│   │   ├── tests/             # Test suite
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   └── lms/                   # LMS core (Java/Spring)
├── examples/                   # API examples and demos
├── docs/                      # Documentation
├── docker-compose.yml         # Docker compose configuration
├── Makefile                   # Common tasks
└── .github/workflows/         # CI/CD pipelines
```

## Key Features

### Chatbot Service

- **Intent Handlers**: GenerateQuiz, SummarizeLesson, ExplainCode, StudyPlanV2
- **Multi-Source Ingestion**: LMS DB, Markdown, HTML, PDF, Transcripts
- **RAG Pipeline**: FAISS vector store + hybrid search (vector + BM25) + Llama 3
- **Analytics**: User stats, global stats, session search
- **CLI Tools**: Ingest content, evaluate RAG, show config

### Recommendation Service

- **Multiple Algorithms**: Two-Tower, Popularity, Content-Based, Hybrid
- **Online Learning**: Epsilon-greedy bandit for strategy selection
- **Analytics**: CTR tracking, strategy distribution, daily stats
- **Admin APIs**: Model info, reindex operations
- **CLI Tools**: Train models, export embeddings, evaluate

## API Documentation

- Chatbot Service: http://localhost:8003/docs
- Recommendation Service: http://localhost:8002/docs
- OpenAPI Spec: See [docs/OPENAPI.md](docs/OPENAPI.md)

## Examples

See the `examples/` directory for:
- `chatbot_demo.md`: Chatbot API usage examples
- `recommendation_demo.md`: Recommendation API usage examples
- Jupyter notebooks: Interactive demos

## Configuration

Both services support environment profiles:
- `.env.dev`: Development settings
- `.env.test`: Test settings (safe defaults)
- `.env.prod`: Production settings

Copy `.env.example` to create your profile files.

## Testing

The test suite includes:
- Unit tests for all major components
- Integration tests for API endpoints
- End-to-end tests for RAG pipeline
- Ingestion pipeline tests

Run with: `make test` or `pytest`

## CI/CD

GitHub Actions workflow runs on every push/PR:
- Linting (black, ruff)
- Tests with coverage
- Code quality checks

See `.github/workflows/ci.yml`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `make test`
5. Format code: `make format`
6. Submit a pull request

## License

MIT
