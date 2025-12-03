.PHONY: help install lint test test-chatbot test-recommendation test-all format clean run-chatbot run-recommendation up down logs

# Default target
help:
	@echo "Available commands:"
	@echo "  make install          - Create venv and install dependencies"
	@echo "  make lint             - Run linters (black, ruff)"
	@echo "  make test             - Run all tests"
	@echo "  make test-chatbot     - Run chatbot service tests"
	@echo "  make test-recommendation - Run recommendation service tests"
	@echo "  make format           - Format code with black"
	@echo "  make clean            - Clean temporary files"
	@echo "  make run-chatbot      - Run chatbot service locally"
	@echo "  make run-recommendation - Run recommendation service locally"
	@echo "  make up               - Start all services with docker-compose"
	@echo "  make down             - Stop all services"
	@echo "  make logs             - Show docker-compose logs"

# Python version
PYTHON := python3.11
VENV := venv

# Install dependencies
install:
	@echo "Creating virtual environment..."
	$(PYTHON) -m venv $(VENV)
	@echo "Installing chatbot service dependencies..."
	$(VENV)/bin/pip install -r backend/chatbot-service/requirements.txt
	$(VENV)/bin/pip install -r backend/chatbot-service/requirements-dev.txt
	@echo "Installing recommendation service dependencies..."
	$(VENV)/bin/pip install -r backend/recommendation-service/requirements.txt
	$(VENV)/bin/pip install -r backend/recommendation-service/requirements-dev.txt
	@echo "Installation complete! Activate with: source $(VENV)/bin/activate"

# Linting
lint:
	@echo "Running black (check mode)..."
	@cd backend/chatbot-service && black --check app/ tests/ || (echo "Run 'make format' to fix" && exit 1)
	@cd backend/recommendation-service && black --check app/ tests/ || (echo "Run 'make format' to fix" && exit 1)
	@echo "Running ruff..."
	@cd backend/chatbot-service && ruff check app/ tests/
	@cd backend/recommendation-service && ruff check app/ tests/
	@echo "Linting complete!"

# Format code
format:
	@echo "Formatting code with black..."
	@cd backend/chatbot-service && black app/ tests/
	@cd backend/recommendation-service && black app/ tests/
	@echo "Formatting complete!"

# Tests
test: test-all

test-all: test-chatbot test-recommendation

test-chatbot:
	@echo "Running chatbot service tests..."
	@cd backend/chatbot-service && ENV=test pytest tests/ -v --cov=app --cov-report=term-missing

test-recommendation:
	@echo "Running recommendation service tests..."
	@cd backend/recommendation-service && ENV=test pytest tests/ -v --cov=app --cov-report=term-missing

# Clean temporary files
clean:
	@echo "Cleaning temporary files..."
	@find . -type d -name "__pycache__" -exec rm -r {} + 2>/dev/null || true
	@find . -type f -name "*.pyc" -delete
	@find . -type f -name "*.pyo" -delete
	@find . -type d -name "*.egg-info" -exec rm -r {} + 2>/dev/null || true
	@find . -type d -name ".pytest_cache" -exec rm -r {} + 2>/dev/null || true
	@find . -type d -name ".coverage" -exec rm -r {} + 2>/dev/null || true
	@find . -type d -name "htmlcov" -exec rm -r {} + 2>/dev/null || true
	@echo "Clean complete!"

# Run services locally
run-chatbot:
	@echo "Starting chatbot service..."
	@cd backend/chatbot-service && uvicorn app.main:app --reload --port 8003

run-recommendation:
	@echo "Starting recommendation service..."
	@cd backend/recommendation-service && uvicorn app.main:app --reload --port 8002

# Docker compose
up:
	@echo "Starting all services with docker-compose..."
	docker-compose up -d
	@echo "Services started! Check logs with: make logs"

down:
	@echo "Stopping all services..."
	docker-compose down
	@echo "Services stopped!"

logs:
	docker-compose logs -f

# Build Docker images
build:
	@echo "Building Docker images..."
	docker-compose build

# Run tests in Docker
test-docker:
	@echo "Running tests in Docker..."
	docker-compose run --rm chatbot pytest tests/ -v
	docker-compose run --rm recommendation pytest tests/ -v

