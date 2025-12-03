"""
Ingest course content from LMS database.

Usage:
    python -m app.scripts.ingest_from_lms [course_id]
    
If course_id is provided, only that course is ingested.
If omitted, all courses are ingested.
"""

import asyncio
import sys
from app.core.settings import settings
from app.infra.vector_store import FaissVectorStore, InMemoryVectorStore, VectorStore
from app.ingestion.ingestion_service import IngestionService


async def main():
    """Main ingestion function."""
    course_id = sys.argv[1] if len(sys.argv) > 1 else "all"
    
    # Initialize vector store
    backend = settings.VECTOR_STORE_BACKEND.lower()
    if backend == "faiss":
        vector_store: VectorStore = FaissVectorStore(persist_dir=settings.VECTOR_STORE_DIR)
    else:
        vector_store = InMemoryVectorStore()
    
    # Initialize ingestion service
    service = IngestionService(vector_store=vector_store)
    
    print(f"Ingesting from LMS database (course_id={course_id})...")
    result = await service.ingest(source=course_id, chunking_strategy="fixed")
    
    print(f"\nIngestion complete:")
    print(f"  Documents loaded: {result['documents_loaded']}")
    print(f"  Chunks created: {result['chunks_created']}")
    print(f"  Chunks ingested: {result['chunks_ingested']}")


if __name__ == "__main__":
    asyncio.run(main())

