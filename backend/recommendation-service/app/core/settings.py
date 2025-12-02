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

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


# Global settings instance
settings = Settings()

