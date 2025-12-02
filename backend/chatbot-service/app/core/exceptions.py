"""
Custom exception classes for the chatbot service.

Provides standardized error types for better error handling and API responses.
"""

from typing import Any, Dict, Optional


class ChatbotException(Exception):
    """Base exception for chatbot service errors."""
    
    def __init__(
        self,
        message: str,
        error_code: str,
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None,
    ):
        """
        Initialize chatbot exception.
        
        Args:
            message: Human-readable error message
            error_code: Machine-readable error code
            status_code: HTTP status code
            details: Additional error details
        """
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.status_code = status_code
        self.details = details or {}


class NotFoundError(ChatbotException):
    """Resource not found error."""
    
    def __init__(self, resource_type: str, resource_id: str):
        super().__init__(
            message=f"{resource_type} not found: {resource_id}",
            error_code="NOT_FOUND",
            status_code=404,
            details={"resource_type": resource_type, "resource_id": resource_id},
        )


class ValidationError(ChatbotException):
    """Input validation error."""
    
    def __init__(self, message: str, field: Optional[str] = None):
        super().__init__(
            message=message,
            error_code="VALIDATION_ERROR",
            status_code=400,
            details={"field": field} if field else {},
        )


class LLMError(ChatbotException):
    """LLM service error."""
    
    def __init__(self, message: str, provider: Optional[str] = None):
        super().__init__(
            message=message,
            error_code="LLM_ERROR",
            status_code=502,
            details={"provider": provider} if provider else {},
        )


class VectorStoreError(ChatbotException):
    """Vector store error."""
    
    def __init__(self, message: str, operation: Optional[str] = None):
        super().__init__(
            message=message,
            error_code="VECTOR_STORE_ERROR",
            status_code=500,
            details={"operation": operation} if operation else {},
        )


class IngestionError(ChatbotException):
    """Ingestion pipeline error."""
    
    def __init__(self, message: str, source: Optional[str] = None):
        super().__init__(
            message=message,
            error_code="INGESTION_ERROR",
            status_code=500,
            details={"source": source} if source else {},
        )

