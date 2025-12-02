"""Main ingestion service that orchestrates loading, chunking, and embedding."""

from typing import List, Optional
from app.ingestion.loaders import (
    BaseLoader,
    LMSDatabaseLoader,
    MarkdownLoader,
    HTMLLoader,
    PDFLoader,
    TranscriptLoader,
)
from app.ingestion.chunkers import BaseChunker, FixedSizeChunker, SemanticChunker
from app.ingestion.loaders.base import ContentDocument
from app.infra.embeddings import EmbeddingModel
from app.infra.vector_store import VectorStore, DocumentChunk
from app.core.settings import settings


class IngestionService:
    """
    Main service for ingesting content from various sources into the vector store.
    
    Orchestrates:
    1. Loading content from various sources (DB, files, etc.)
    2. Chunking content into smaller pieces
    3. Generating embeddings
    4. Storing in vector store
    """

    def __init__(
        self,
        vector_store: VectorStore,
        chunker: Optional[BaseChunker] = None,
        embedding_model: Optional[EmbeddingModel] = None,
    ):
        """
        Initialize ingestion service.
        
        Args:
            vector_store: Vector store to write to
            chunker: Chunking strategy (default: FixedSizeChunker)
            embedding_model: Embedding model (default: EmbeddingModel())
        """
        self.vector_store = vector_store
        self.chunker = chunker or FixedSizeChunker(
            chunk_size=settings.CHUNK_SIZE,
            chunk_overlap=settings.CHUNK_OVERLAP,
        )
        self.embedding_model = embedding_model or EmbeddingModel()
        
        # Register loaders
        self.loaders: List[BaseLoader] = [
            LMSDatabaseLoader(),
            MarkdownLoader(),
            HTMLLoader(),
            PDFLoader(),
            TranscriptLoader(),
        ]

    def _select_loader(self, source: str) -> Optional[BaseLoader]:
        """Select appropriate loader for source."""
        for loader in self.loaders:
            if loader.supports(source):
                return loader
        return None

    async def ingest(
        self,
        source: str,
        chunking_strategy: str = "fixed",
        **loader_kwargs
    ) -> dict:
        """
        Ingest content from a source.
        
        Args:
            source: Source identifier (file path, course_id, "all", etc.)
            chunking_strategy: "fixed" or "semantic"
            **loader_kwargs: Additional parameters for loader
            
        Returns:
            Dictionary with ingestion statistics
        """
        # Select loader
        loader = self._select_loader(source)
        if not loader:
            raise ValueError(f"No loader found for source: {source}")
        
        # Select chunker
        if chunking_strategy == "semantic":
            chunker = SemanticChunker()
        else:
            chunker = self.chunker
        
        # Load documents
        documents = await loader.load(source, **loader_kwargs)
        
        if not documents:
            return {
                "source": source,
                "documents_loaded": 0,
                "chunks_created": 0,
                "chunks_ingested": 0,
            }
        
        # Chunk documents
        all_chunks: List[ContentDocument] = []
        for doc in documents:
            chunks = chunker.chunk(doc)
            all_chunks.extend(chunks)
        
        # Generate embeddings
        chunk_texts = [chunk.content for chunk in all_chunks]
        embeddings = self.embedding_model.encode(chunk_texts)
        
        # Convert to DocumentChunk format
        document_chunks: List[DocumentChunk] = []
        for chunk, embedding in zip(all_chunks, embeddings):
            doc_chunk = DocumentChunk(
                id=f"{chunk.metadata.get('course_id', 'unknown')}_{chunk.metadata.get('chunk_index', 0)}",
                course_id=chunk.metadata.get("course_id") or "unknown",
                content=chunk.content,
                lesson_id=chunk.metadata.get("lesson_id"),
                section=chunk.metadata.get("section_id"),
                language=chunk.metadata.get("language"),
            )
            document_chunks.append(doc_chunk)
        
        # Store in vector store
        await self.vector_store.add_documents(document_chunks, embeddings=embeddings)
        
        return {
            "source": source,
            "documents_loaded": len(documents),
            "chunks_created": len(all_chunks),
            "chunks_ingested": len(document_chunks),
        }

