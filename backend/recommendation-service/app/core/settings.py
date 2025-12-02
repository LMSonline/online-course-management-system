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

    # Database (RS Postgres for interactions)
    RS_DB_HOST: str | None = None
    RS_DB_PORT: int = 5432
    RS_DB_NAME: str | None = None
    RS_DB_USER: str | None = None
    RS_DB_PASSWORD: str | None = None

    # Fallback to LMS DB if RS_DB_* not set
    LMS_DB_HOST: str = "localhost"
    LMS_DB_PORT: int = 5432
    LMS_DB_NAME: str = "lms"
    LMS_DB_USER: str = "postgres"
    LMS_DB_PASSWORD: str = "postgres"

    # Model Configuration
    RS_MODELS_DIR: str = "models"
    EMBEDDING_DIM: int = 64
    USER_FEATURE_DIM: int = 16
    ITEM_FEATURE_DIM: int = 32
    
    # Recommender Configuration
    DEFAULT_RECOMMENDER: str = "hybrid"  # two_tower | popularity | content | hybrid
    HYBRID_WEIGHTS_TWO_TOWER: float = 0.5
    HYBRID_WEIGHTS_POPULARITY: float = 0.3
    HYBRID_WEIGHTS_CONTENT: float = 0.2

    # Service Configuration
    SERVICE_NAME: str = "recommendation-service"
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"  # json | text
    
    # Bandit Configuration
    BANDIT_EPSILON: float = 0.1  # Exploration rate for epsilon-greedy bandit

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
            # Use in-memory or test DB defaults
            if not self.RS_DB_NAME:
                self.RS_DB_NAME = "test_recommendation"
            if not self.LMS_DB_NAME:
                self.LMS_DB_NAME = "test_lms"


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

