"""
Centralized configuration using pydantic-settings.

Supports multiple environments via .env files:
- .env.dev
- .env.test
- .env.prod

Environment is determined by ENV variable or defaults to 'dev'.
For tests, automatically uses 'test' profile with safe defaults.
"""

import os
from functools import lru_cache
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


def get_env_file() -> str | None:
    """
    Determine which .env file to load based on ENV variable.
    
    Returns:
        Path to .env file or None to use default .env
    """
    env = os.getenv("ENV", "dev").lower()
    
    # For tests, always use test profile
    if "pytest" in os.environ.get("_", ""):
        env = "test"
    
    env_file = f".env.{env}"
    if Path(env_file).exists():
        return env_file
    
    # Fallback to .env if profile-specific file doesn't exist
    if Path(".env").exists():
        return ".env"
    
    return None


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
    
    # Embedding Configuration
    EMBEDDING_BACKEND: str = "dummy"  # dummy | sentence_transformers
    CHATBOT_EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"  # Only used when EMBEDDING_BACKEND=sentence_transformers
    EMBEDDING_DIM: int = 384  # Dimension for dummy embeddings (matches all-MiniLM-L6-v2)

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
    
    # Demo Mode
    DEMO_MODE: bool = True  # If True, return hardcoded responses without external dependencies

    model_config = SettingsConfigDict(
        env_file=get_env_file(),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    def __init__(self, **kwargs):
        """Initialize settings with environment-aware defaults."""
        super().__init__(**kwargs)
        
        # Override defaults for test environment
        if self.ENV.lower() == "test":
            self.VECTOR_STORE_BACKEND = "inmemory"
            self.LLM_PROVIDER = "dummy"
            self.EMBEDDING_BACKEND = "dummy"
            # Use in-memory or test DB defaults
            if not self.CHAT_DB_NAME:
                self.CHAT_DB_NAME = "test_chatbot"
            if not self.LMS_DB_NAME:
                self.LMS_DB_NAME = "test_lms"
        
        # Default to dummy embeddings in dev mode if not explicitly set
        if self.ENV.lower() == "dev" and not os.getenv("EMBEDDING_BACKEND"):
            self.EMBEDDING_BACKEND = "dummy"


@lru_cache()
def get_settings() -> Settings:
    """
    Get settings instance (cached).
    
    Returns:
        Settings instance
    """
    return Settings()


# Global settings instance (for backward compatibility)
settings = get_settings()

