"""Fixed-size chunking strategy."""

from typing import List
from app.ingestion.chunkers.base import BaseChunker
from app.ingestion.loaders.base import ContentDocument


class FixedSizeChunker(BaseChunker):
    """
    Chunks content by fixed size (characters or tokens).
    
    Supports configurable overlap between chunks.
    """

    def __init__(
        self,
        chunk_size: int = 1000,
        chunk_overlap: int = 200,
        chunk_by_tokens: bool = False,
    ):
        """
        Initialize fixed-size chunker.
        
        Args:
            chunk_size: Size of each chunk (characters or tokens)
            chunk_overlap: Overlap between chunks
            chunk_by_tokens: If True, chunk by tokens; otherwise by characters
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.chunk_by_tokens = chunk_by_tokens

    def chunk(self, document: ContentDocument) -> List[ContentDocument]:
        """Split document into fixed-size chunks."""
        content = document.content
        chunks: List[ContentDocument] = []
        
        if self.chunk_by_tokens:
            # Simple token-based chunking (approximate)
            tokens = content.split()
            step = self.chunk_size - self.chunk_overlap
            for i in range(0, len(tokens), step):
                chunk_tokens = tokens[i : i + self.chunk_size]
                chunk_text = " ".join(chunk_tokens)
                
                chunk_metadata = document.metadata.copy()
                chunk_metadata["chunk_index"] = len(chunks)
                chunk_metadata["total_chunks"] = (len(tokens) + step - 1) // step
                
                chunks.append(ContentDocument(
                    content=chunk_text,
                    metadata=chunk_metadata,
                ))
        else:
            # Character-based chunking
            step = self.chunk_size - self.chunk_overlap
            for i in range(0, len(content), step):
                chunk_text = content[i : i + self.chunk_size]
                
                chunk_metadata = document.metadata.copy()
                chunk_metadata["chunk_index"] = len(chunks)
                chunk_metadata["total_chunks"] = (len(content) + step - 1) // step
                
                chunks.append(ContentDocument(
                    content=chunk_text,
                    metadata=chunk_metadata,
                ))
        
        return chunks

