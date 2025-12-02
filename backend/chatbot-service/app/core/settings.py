"""
Centralized configuration using pydantic-settings.

Supports multiple environments via .env files:
- .env.dev
- .env.test
- .env.prod
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Environment
    ENV: str = "dev"

    # Database (LMS Postgres for chat sessions/messages)
    CHAT_DB_HOST: str | None = None
    CHAT_DB_PORT: int = 5432
    CHAT_DB_NAME: str | None = None
    CHAT_DB_USER: str | None = None
    CHAT_DB_PASSWORD: str | None = None

    # Fallback to LMS DB if CHAT_DB_* not set
    LMS_DB_HOST: str = "localhost"
    LMS_DB_PORT: int = 5432
    LMS_DB_NAME: str = "lms"
    LMS_DB_USER: str = "postgres"
    LMS_DB_PASSWORD: str = "postgres"

    # LLM Configuration
    LLM_PROVIDER: str = "dummy"  # dummy | llama3
    LLAMA3_API_BASE: str | None = None
    LLAMA3_API_KEY: str | None = None
    LLAMA3_MODEL_NAME: str = "llama-3-8b-instruct"
    LLAMA3_TIMEOUT: float = 30.0

    # Vector Store
    VECTOR_STORE_BACKEND: str = "inmemory"  # inmemory | faiss
    VECTOR_STORE_DIR: str = "./vector_store"
    CHATBOT_EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"

    # Search Configuration
    SEARCH_MODE: str = "vector"  # vector | bm25 | hybrid
    HYBRID_ALPHA: float = 0.6  # Weight for vector vs BM25 in hybrid mode
    CHAT_HISTORY_LIMIT: int = 10
    
    # Ingestion Configuration
    CHUNK_SIZE: int = 1000  # Characters or tokens per chunk
    CHUNK_OVERLAP: int = 200  # Overlap between chunks
    INGESTION_BATCH_SIZE: int = 100  # Batch size for embedding generation

    # Recommendation Service
    RS_BASE_URL: str = "http://localhost:8002"

    # Service Configuration
    SERVICE_NAME: str = "chatbot-service"
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"  # json | text

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


# Global settings instance
settings = Settings()

