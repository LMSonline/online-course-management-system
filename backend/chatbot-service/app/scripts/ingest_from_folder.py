"""
Ingest course content from a folder (Markdown, HTML, PDF, transcripts).

Usage:
    python -m app.scripts.ingest_from_folder --path ./data/courses [--course-id COURSE_ID] [--chunking-strategy fixed|semantic]
"""

import asyncio
import argparse
from pathlib import Path
from app.core.settings import settings
from app.infra.vector_store import FaissVectorStore, InMemoryVectorStore, VectorStore
from app.ingestion.ingestion_service import IngestionService


async def main():
    """Main ingestion function."""
    parser = argparse.ArgumentParser(description="Ingest content from folder")
    parser.add_argument("--path", required=True, help="Path to folder or file")
    parser.add_argument("--course-id", help="Optional course ID to assign")
    parser.add_argument("--chunking-strategy", default="fixed", choices=["fixed", "semantic"])
    args = parser.parse_args()
    
    path = Path(args.path)
    if not path.exists():
        print(f"Error: Path does not exist: {path}")
        return
    
    # Initialize vector store
    backend = settings.VECTOR_STORE_BACKEND.lower()
    if backend == "faiss":
        vector_store: VectorStore = FaissVectorStore(persist_dir=settings.VECTOR_STORE_DIR)
    else:
        vector_store = InMemoryVectorStore()
    
    # Initialize ingestion service
    service = IngestionService(vector_store=vector_store)
    
    loader_kwargs = {}
    if args.course_id:
        loader_kwargs["course_id"] = args.course_id
    
    print(f"Ingesting from folder: {path}")
    print(f"Chunking strategy: {args.chunking_strategy}")
    
    try:
        result = await service.ingest(
            source=str(path),
            chunking_strategy=args.chunking_strategy,
            **loader_kwargs
        )
        
        print(f"\nIngestion complete:")
        print(f"  Documents loaded: {result['documents_loaded']}")
        print(f"  Chunks created: {result['chunks_created']}")
        print(f"  Chunks ingested: {result['chunks_ingested']}")
    except Exception as e:
        print(f"Error during ingestion: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(main())

