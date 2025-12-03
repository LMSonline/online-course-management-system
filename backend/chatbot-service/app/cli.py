"""
CLI tool for chatbot service using typer.

Commands:
- ingest-lms: Ingest course content from LMS database
- ingest-folder: Ingest content from folder (Markdown, HTML, PDF, transcripts, JSONL)
- eval-rag: Evaluate RAG retrieval quality
- show-config: Display current configuration
"""

import typer
from pathlib import Path
import asyncio
import sys
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
    # DEMO_MODE: Skip ingestion
    if settings.DEMO_MODE:
        typer.echo("DEMO_MODE is ON: skipping ingestion, pretending success.")
        typer.echo(f"  (Would have ingested course_id={course_id})")
        return
    
    typer.echo(f"Ingesting from LMS database (course_id={course_id})...")
    
    # Initialize vector store
    backend = settings.VECTOR_STORE_BACKEND.lower()
    if backend == "faiss":
        vector_store: VectorStore = FaissVectorStore(persist_dir=settings.VECTOR_STORE_DIR)
    else:
        vector_store = InMemoryVectorStore()
    
    # Initialize ingestion service
    service = IngestionService(vector_store=vector_store)
    
    # Show embedding backend info
    embedding_backend = settings.EMBEDDING_BACKEND.lower()
    if embedding_backend == "dummy":
        typer.echo(f"Using dummy embeddings (offline mode)")
    else:
        typer.echo(f"Using embedding backend: {embedding_backend}")
    
    async def run():
        try:
            result = await service.ingest(source=course_id, chunking_strategy=chunking_strategy)
            typer.echo(f"\n✓ Ingestion complete:")
            typer.echo(f"  Documents loaded: {result['documents_loaded']}")
            typer.echo(f"  Chunks created: {result['chunks_created']}")
            typer.echo(f"  Chunks ingested: {result['chunks_ingested']}")
        except (ConnectionError, OSError) as e:
            error_msg = str(e)
            if "1225" in error_msg or "refused" in error_msg.lower() or "connection" in error_msg.lower():
                typer.echo(f"\n❌ Network connection error during ingestion:", err=True)
                typer.echo(f"   {error_msg}", err=True)
                typer.echo(f"\n💡 Solution: Set EMBEDDING_BACKEND=dummy for offline ingestion", err=True)
            else:
                typer.echo(f"Error during ingestion: {error_msg}", err=True)
            raise typer.Exit(1)
        except RuntimeError as e:
            error_msg = str(e)
            if "sentence-transformers" in error_msg.lower() or "huggingface" in error_msg.lower():
                typer.echo(f"\n❌ Embedding model loading error:", err=True)
                typer.echo(f"   {error_msg}", err=True)
                typer.echo(f"\n💡 Solution: Set EMBEDDING_BACKEND=dummy for offline ingestion", err=True)
            else:
                typer.echo(f"Error during ingestion: {error_msg}", err=True)
            raise typer.Exit(1)
        except Exception as e:
            typer.echo(f"Error during ingestion: {e}", err=True)
            raise typer.Exit(1)
    
    asyncio.run(run())


@app.command()
def ingest_folder(
    path: str = typer.Argument(..., help="Path to folder or file (supports Markdown, HTML, PDF, transcripts, JSONL)"),
    course_id: str = typer.Option(None, help="Optional course ID to assign (for JSONL: filters or overrides course_id)"),
    chunking_strategy: str = typer.Option("fixed", help="Chunking strategy: fixed or semantic"),
):
    """
    Ingest content from folder or file (Markdown, HTML, PDF, transcripts, JSONL).
    
    By default, uses dummy embeddings (offline mode) in dev environment.
    To use real embeddings, set EMBEDDING_BACKEND=sentence_transformers.
    """
    # DEMO_MODE: Skip ingestion
    if settings.DEMO_MODE:
        typer.echo("DEMO_MODE is ON: skipping ingestion, pretending success.")
        typer.echo(f"  (Would have ingested: {path})")
        if course_id:
            typer.echo(f"  (Course ID: {course_id})")
        return
    
    path_obj = Path(path)
    if not path_obj.exists():
        typer.echo(f"Error: Path does not exist: {path}", err=True)
        raise typer.Exit(1)
    
    typer.echo(f"Ingesting from: {path}")
    if path_obj.is_file():
        typer.echo(f"File type: {path_obj.suffix}")
    typer.echo(f"Chunking strategy: {chunking_strategy}")
    if course_id:
        typer.echo(f"Course ID: {course_id}")
    
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
        
        # Show embedding backend info
        embedding_backend = settings.EMBEDDING_BACKEND.lower()
        if embedding_backend == "dummy":
            typer.echo(f"Using dummy embeddings (offline mode)")
        else:
            typer.echo(f"Using embedding backend: {embedding_backend}")
        
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
        except (ConnectionError, OSError) as e:
            # Network-related errors
            error_msg = str(e)
            if "1225" in error_msg or "refused" in error_msg.lower() or "connection" in error_msg.lower():
                typer.echo(f"\n❌ Network connection error during ingestion:", err=True)
                typer.echo(f"   {error_msg}", err=True)
                typer.echo(f"\n💡 Solution:", err=True)
                if embedding_backend == "sentence_transformers":
                    typer.echo(f"   The embedding backend is configured to use 'sentence_transformers',", err=True)
                    typer.echo(f"   which requires network access to download models from HuggingFace.", err=True)
                    typer.echo(f"   To run ingestion offline, set EMBEDDING_BACKEND=dummy:", err=True)
                    typer.echo(f"   ", err=True)
                    typer.echo(f"   $env:EMBEDDING_BACKEND='dummy'  # PowerShell", err=True)
                    typer.echo(f"   export EMBEDDING_BACKEND=dummy  # Bash", err=True)
                else:
                    typer.echo(f"   Check your network connection or configuration.", err=True)
            else:
                typer.echo(f"Error during ingestion: {error_msg}", err=True)
            raise typer.Exit(1)
        except RuntimeError as e:
            # Runtime errors (e.g., model loading failures)
            error_msg = str(e)
            if "sentence-transformers" in error_msg.lower() or "huggingface" in error_msg.lower():
                typer.echo(f"\n❌ Embedding model loading error:", err=True)
                typer.echo(f"   {error_msg}", err=True)
                typer.echo(f"\n💡 Solution:", err=True)
                typer.echo(f"   Set EMBEDDING_BACKEND=dummy for offline ingestion:", err=True)
                typer.echo(f"   ", err=True)
                typer.echo(f"   $env:EMBEDDING_BACKEND='dummy'  # PowerShell", err=True)
                typer.echo(f"   export EMBEDDING_BACKEND=dummy  # Bash", err=True)
            else:
                typer.echo(f"Error during ingestion: {error_msg}", err=True)
            raise typer.Exit(1)
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
    typer.echo(f"  DEMO_MODE: {settings.DEMO_MODE}")
    typer.echo(f"  LLM Provider: {settings.LLM_PROVIDER}")
    typer.echo(f"  Embedding Backend: {settings.EMBEDDING_BACKEND}")
    if settings.EMBEDDING_BACKEND.lower() == "sentence_transformers":
        typer.echo(f"  Embedding Model: {settings.CHATBOT_EMBEDDING_MODEL}")
    else:
        typer.echo(f"  Embedding Dimension: {settings.EMBEDDING_DIM}")
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

