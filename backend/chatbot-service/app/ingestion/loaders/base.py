"""Base class for content loaders."""

from abc import ABC, abstractmethod
from typing import List, Dict, Any
from dataclasses import dataclass


@dataclass
class ContentDocument:
    """Represents a document loaded from a source."""
    content: str
    metadata: Dict[str, Any]  # course_id, lesson_id, section_id, language, source_type, etc.


class BaseLoader(ABC):
    """
    Abstract base class for content loaders.
    
    Each loader is responsible for loading content from a specific source
    (database, files, etc.) and converting it to ContentDocument objects.
    """

    @abstractmethod
    async def load(self, source: str, **kwargs) -> List[ContentDocument]:
        """
        Load content from a source.
        
        Args:
            source: Source identifier (e.g., file path, course_id, folder path)
            **kwargs: Additional loader-specific parameters
            
        Returns:
            List of ContentDocument objects
        """
        pass

    @abstractmethod
    def supports(self, source: str) -> bool:
        """
        Check if this loader can handle the given source.
        
        Args:
            source: Source identifier (e.g., file path, URL)
            
        Returns:
            True if this loader can handle the source
        """
        pass

