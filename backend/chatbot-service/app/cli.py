"""
CLI tool for chatbot service using typer.

Commands:
- ingest-lms: Ingest course content from LMS database
- ingest-folder: Ingest content from folder (Markdown, HTML, PDF, transcripts)
- eval-rag: Evaluate RAG retrieval quality
- show-config: Display current configuration
"""

import typer
from pathlib import Path
import asyncio
from app.core.settings import settings
from app.infra.vector_store import FaissVectorStore, InMemoryVectorStore, VectorStore
from app.ingestion.ingestion_service import IngestionService
from app.eval.rag_eval import main as eval_main

app = typer.Typer(help="Chatbot Service CLI")


@app.command()
def ingest_lms(
    course_id: str = typer.Argument("all", help="Course ID to ingest (or 'all' for all courses)"),
    chunking_strategy: str = typer.Option("fixed", help="Chunking strategy: fixed or semantic"),
):
    """Ingest course content from LMS database."""
    typer.echo(f"Ingesting from LMS database (course_id={course_id})...")
    
    # Initialize vector store
    backend = settings.VECTOR_STORE_BACKEND.lower()
    if backend == "faiss":
        vector_store: VectorStore = FaissVectorStore(persist_dir=settings.VECTOR_STORE_DIR)
    else:
        vector_store = InMemoryVectorStore()
    
    # Initialize ingestion service
    service = IngestionService(vector_store=vector_store)
    
    async def run():
        result = await service.ingest(source=course_id, chunking_strategy=chunking_strategy)
        typer.echo(f"\n✓ Ingestion complete:")
        typer.echo(f"  Documents loaded: {result['documents_loaded']}")
        typer.echo(f"  Chunks created: {result['chunks_created']}")
        typer.echo(f"  Chunks ingested: {result['chunks_ingested']}")
    
    asyncio.run(run())


@app.command()
def ingest_folder(
    path: str = typer.Argument(..., help="Path to folder or file"),
    course_id: str = typer.Option(None, help="Optional course ID to assign"),
    chunking_strategy: str = typer.Option("fixed", help="Chunking strategy: fixed or semantic"),
):
    """Ingest content from folder (Markdown, HTML, PDF, transcripts)."""
    path_obj = Path(path)
    if not path_obj.exists():
        typer.echo(f"Error: Path does not exist: {path}", err=True)
        raise typer.Exit(1)
    
    typer.echo(f"Ingesting from folder: {path}")
    typer.echo(f"Chunking strategy: {chunking_strategy}")
    
    # Initialize vector store
    backend = settings.VECTOR_STORE_BACKEND.lower()
    if backend == "faiss":
        vector_store: VectorStore = FaissVectorStore(persist_dir=settings.VECTOR_STORE_DIR)
    else:
        vector_store = InMemoryVectorStore()
    
    # Initialize ingestion service
    service = IngestionService(vector_store=vector_store)
    
    async def run():
        loader_kwargs = {}
        if course_id:
            loader_kwargs["course_id"] = course_id
        
        try:
            result = await service.ingest(
                source=str(path_obj),
                chunking_strategy=chunking_strategy,
                **loader_kwargs
            )
            typer.echo(f"\n✓ Ingestion complete:")
            typer.echo(f"  Documents loaded: {result['documents_loaded']}")
            typer.echo(f"  Chunks created: {result['chunks_created']}")
            typer.echo(f"  Chunks ingested: {result['chunks_ingested']}")
        except Exception as e:
            typer.echo(f"Error during ingestion: {e}", err=True)
            raise typer.Exit(1)
    
    asyncio.run(run())


@app.command()
def eval_rag():
    """Evaluate RAG retrieval quality."""
    typer.echo("Running RAG evaluation...")
    try:
        eval_main()
        typer.echo("\n✓ Evaluation complete")
    except Exception as e:
        typer.echo(f"Error during evaluation: {e}", err=True)
        raise typer.Exit(1)


@app.command()
def show_config():
    """Display current configuration."""
    typer.echo("Chatbot Service Configuration:\n")
    typer.echo(f"  Environment: {settings.ENV}")
    typer.echo(f"  LLM Provider: {settings.LLM_PROVIDER}")
    typer.echo(f"  Vector Store Backend: {settings.VECTOR_STORE_BACKEND}")
    typer.echo(f"  Vector Store Dir: {settings.VECTOR_STORE_DIR}")
    typer.echo(f"  Search Mode: {settings.SEARCH_MODE}")
    typer.echo(f"  Hybrid Alpha: {settings.HYBRID_ALPHA}")
    typer.echo(f"  Chunk Size: {settings.CHUNK_SIZE}")
    typer.echo(f"  Chunk Overlap: {settings.CHUNK_OVERLAP}")
    typer.echo(f"  LMS DB: {settings.LMS_DB_HOST}:{settings.LMS_DB_PORT}/{settings.LMS_DB_NAME}")
    typer.echo(f"  RS Base URL: {settings.RS_BASE_URL}")


if __name__ == "__main__":
    app()

