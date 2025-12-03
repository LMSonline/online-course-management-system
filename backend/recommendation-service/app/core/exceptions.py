"""
Custom exception classes for the recommendation service.

Provides standardized error types for better error handling and API responses.
"""

from typing import Any, Dict, Optional


class RecommendationException(Exception):
    """Base exception for recommendation service errors."""
    
    def __init__(
        self,
        message: str,
        error_code: str,
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None,
    ):
        """
        Initialize recommendation exception.
        
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


class NotFoundError(RecommendationException):
    """Resource not found error."""
    
    def __init__(self, resource_type: str, resource_id: str):
        super().__init__(
            message=f"{resource_type} not found: {resource_id}",
            error_code="NOT_FOUND",
            status_code=404,
            details={"resource_type": resource_type, "resource_id": resource_id},
        )


class ValidationError(RecommendationException):
    """Input validation error."""
    
    def __init__(self, message: str, field: Optional[str] = None):
        super().__init__(
            message=message,
            error_code="VALIDATION_ERROR",
            status_code=400,
            details={"field": field} if field else {},
        )


class ModelError(RecommendationException):
    """Model-related error."""
    
    def __init__(self, message: str, model_name: Optional[str] = None):
        super().__init__(
            message=message,
            error_code="MODEL_ERROR",
            status_code=500,
            details={"model_name": model_name} if model_name else {},
        )


class RecommenderError(RecommendationException):
    """Recommender algorithm error."""
    
    def __init__(self, message: str, strategy: Optional[str] = None):
        super().__init__(
            message=message,
            error_code="RECOMMENDER_ERROR",
            status_code=500,
            details={"strategy": strategy} if strategy else {},
        )

