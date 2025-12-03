"""Base class for intent handlers."""

from abc import ABC, abstractmethod
from typing import Optional, Dict, Any
from app.domain.models import ChatSession


class IntentHandler(ABC):
    """
    Abstract base class for intent handlers.
    
    Each handler implements the logic for a specific user intent,
    following the Strategy pattern for extensibility.
    """

    @abstractmethod
    async def handle(
        self,
        request_text: str,
        session: ChatSession,
        history_context: str = "",
        **kwargs
    ) -> tuple[str, Optional[Dict[str, Any]]]:
        """
        Handle the intent and return a reply with optional debug info.
        
        Args:
            request_text: The user's message text
            session: Current chat session
            history_context: Formatted conversation history
            **kwargs: Additional parameters (e.g., debug, language, etc.)
            
        Returns:
            Tuple of (reply_text, debug_info_dict or None)
        """
        pass

