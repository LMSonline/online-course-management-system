"""
Structured logging configuration using loguru.

Provides JSON-formatted logs with request context.
"""

import sys
from contextvars import ContextVar
from typing import Any

from loguru import logger

from app.core.settings import settings

# Request ID context variable
request_id_var: ContextVar[str | None] = ContextVar("request_id", default=None)


def get_request_id() -> str | None:
    """Get current request ID from context."""
    return request_id_var.get()


def set_request_id(request_id: str) -> None:
    """Set request ID in context."""
    request_id_var.set(request_id)


def configure_logging() -> None:
    """Configure loguru logger with structured output."""
    # Remove default handler
    logger.remove()

    # Add handler based on format
    if settings.LOG_FORMAT == "json":
        logger.add(
            sys.stdout,
            format="{time} | {level} | {name}:{function}:{line} | {message}",
            serialize=True,  # JSON output
            level=settings.LOG_LEVEL,
        )
    else:
        logger.add(
            sys.stdout,
            format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> | <level>{message}</level>",
            level=settings.LOG_LEVEL,
            colorize=True,
        )

    # Add file handler for errors
    logger.add(
        "logs/recommendation-service.log",
        rotation="10 MB",
        retention="7 days",
        level="ERROR",
        format="{time} | {level} | {name}:{function}:{line} | {message}",
        serialize=settings.LOG_FORMAT == "json",
    )


def log_request(
    method: str,
    path: str,
    status_code: int,
    latency_ms: float,
    user_id: str | None = None,
) -> None:
    """Log HTTP request with timing."""
    request_id = get_request_id()
    logger.info(
        "HTTP request",
        extra={
            "method": method,
            "path": path,
            "status_code": status_code,
            "latency_ms": latency_ms,
            "user_id": user_id,
            "request_id": request_id,
            "service": settings.SERVICE_NAME,
        },
    )


def log_error(
    error: Exception,
    context: dict[str, Any] | None = None,
) -> None:
    """Log error with context."""
    request_id = get_request_id()
    logger.error(
        f"Error: {type(error).__name__}: {str(error)}",
        exc_info=error,
        extra={
            "error_type": type(error).__name__,
            "error_message": str(error),
            "request_id": request_id,
            "service": settings.SERVICE_NAME,
            **(context or {}),
        },
    )


# Initialize logging on import
configure_logging()

