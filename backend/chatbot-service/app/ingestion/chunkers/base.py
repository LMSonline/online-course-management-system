"""Base class for chunkers."""

from abc import ABC, abstractmethod
from typing import List
from app.ingestion.loaders.base import ContentDocument


class BaseChunker(ABC):
    """Abstract base class for chunking strategies."""

    @abstractmethod
    def chunk(self, document: ContentDocument) -> List[ContentDocument]:
        """
        Split a document into smaller chunks.
        
        Args:
            document: Document to chunk
            
        Returns:
            List of chunked ContentDocument objects
        """
        pass

