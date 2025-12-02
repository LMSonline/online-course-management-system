"""Semantic chunking by headings (for Markdown/HTML)."""

import re
from typing import List
from app.ingestion.chunkers.base import BaseChunker
from app.ingestion.loaders.base import ContentDocument


class SemanticChunker(BaseChunker):
    """
    Chunks content by semantic boundaries (headings, sections).
    
    Works best with structured formats like Markdown or HTML.
    """

    def __init__(self, min_chunk_size: int = 200, max_chunk_size: int = 2000):
        """
        Initialize semantic chunker.
        
        Args:
            min_chunk_size: Minimum chunk size (characters)
            max_chunk_size: Maximum chunk size (characters)
        """
        self.min_chunk_size = min_chunk_size
        self.max_chunk_size = max_chunk_size

    def chunk(self, document: ContentDocument) -> List[ContentDocument]:
        """Split document by semantic boundaries (headings)."""
        content = document.content
        chunks: List[ContentDocument] = []
        
        # Detect format
        if document.metadata.get("source_type") in ["markdown", "html"]:
            # Split by headings
            sections = self._split_by_headings(content)
        else:
            # Fallback to paragraph-based splitting
            sections = self._split_by_paragraphs(content)
        
        # Create chunks from sections
        current_chunk = ""
        current_metadata = document.metadata.copy()
        chunk_index = 0
        
        for section in sections:
            # If adding this section would exceed max size, finalize current chunk
            if current_chunk and len(current_chunk) + len(section) > self.max_chunk_size:
                if len(current_chunk) >= self.min_chunk_size:
                    current_metadata["chunk_index"] = chunk_index
                    chunks.append(ContentDocument(
                        content=current_chunk.strip(),
                        metadata=current_metadata.copy(),
                    ))
                    chunk_index += 1
                    current_chunk = ""
            
            current_chunk += section + "\n\n"
        
        # Add final chunk
        if current_chunk.strip():
            current_metadata["chunk_index"] = chunk_index
            chunks.append(ContentDocument(
                content=current_chunk.strip(),
                metadata=current_metadata,
            ))
        
        return chunks

    def _split_by_headings(self, content: str) -> List[str]:
        """Split content by Markdown or HTML headings."""
        # Markdown headings: #, ##, ###, etc.
        # HTML headings: <h1>, <h2>, etc.
        
        # For Markdown
        markdown_pattern = r'(^#{1,6}\s+.+$|^---+$|^===+$)'
        sections = re.split(markdown_pattern, content, flags=re.MULTILINE)
        
        # Filter out empty sections
        return [s.strip() for s in sections if s.strip()]

    def _split_by_paragraphs(self, content: str) -> List[str]:
        """Split content by paragraphs (double newlines)."""
        paragraphs = re.split(r'\n\s*\n', content)
        return [p.strip() for p in paragraphs if p.strip()]

