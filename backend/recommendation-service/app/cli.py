"""
CLI tool for recommendation service using typer.

Commands:
- train-two-tower: Train the two-tower model
- export-embeddings: Export item embeddings and build FAISS index
- eval-two-tower: Evaluate the two-tower model
- show-config: Display current configuration
- rebuild-index: Rebuild FAISS index from trained model
"""

import typer
import asyncio
from app.core.settings import settings

app = typer.Typer(help="Recommendation Service CLI")


@app.command()
def train_two_tower(
    config: str = typer.Option("configs/two_tower.yaml", help="Path to training config YAML"),
    epochs: int = typer.Option(10, help="Number of training epochs"),
    batch_size: int = typer.Option(32, help="Batch size"),
):
    """Train the two-tower model."""
    typer.echo(f"Training two-tower model...")
    typer.echo(f"  Config: {config}")
    typer.echo(f"  Epochs: {epochs}")
    typer.echo(f"  Batch size: {batch_size}")
    
    # Import here to avoid circular dependencies
    from app.scripts.train_two_tower import main as train_main
    
    try:
        # Note: train_two_tower.py might need to be adapted to accept CLI args
        # For now, this is a placeholder that shows the structure
        typer.echo("\nNote: Run 'python -m app.scripts.train_two_tower' directly for now")
        typer.echo("CLI integration coming soon...")
    except Exception as e:
        typer.echo(f"Error during training: {e}", err=True)
        raise typer.Exit(1)


@app.command()
def export_embeddings():
    """Export item embeddings and build FAISS index."""
    typer.echo("Exporting item embeddings and building FAISS index...")
    
    async def run():
        from app.scripts.export_item_embeddings import main as export_main
        try:
            await export_main()
            typer.echo("\n✓ Export complete")
        except Exception as e:
            typer.echo(f"Error during export: {e}", err=True)
            raise typer.Exit(1)
    
    asyncio.run(run())


@app.command()
def eval_two_tower():
    """Evaluate the two-tower model."""
    typer.echo("Running two-tower model evaluation...")
    
    try:
        from app.eval.eval_two_tower import main as eval_main
        eval_main()
        typer.echo("\n✓ Evaluation complete")
    except Exception as e:
        typer.echo(f"Error during evaluation: {e}", err=True)
        raise typer.Exit(1)


@app.command()
def show_config():
    """Display current configuration."""
    typer.echo("Recommendation Service Configuration:\n")
    typer.echo(f"  Environment: {settings.ENV}")
    typer.echo(f"  DEMO_MODE: {settings.DEMO_MODE}")
    typer.echo(f"  Models Directory: {settings.RS_MODELS_DIR}")
    typer.echo(f"  Embedding Dimension: {settings.EMBEDDING_DIM}")
    typer.echo(f"  User Feature Dim: {settings.USER_FEATURE_DIM}")
    typer.echo(f"  Item Feature Dim: {settings.ITEM_FEATURE_DIM}")
    typer.echo(f"  Default Recommender: {settings.DEFAULT_RECOMMENDER}")
    typer.echo(f"  Hybrid Weights:")
    typer.echo(f"    Two-Tower: {settings.HYBRID_WEIGHTS_TWO_TOWER}")
    typer.echo(f"    Popularity: {settings.HYBRID_WEIGHTS_POPULARITY}")
    typer.echo(f"    Content: {settings.HYBRID_WEIGHTS_CONTENT}")
    typer.echo(f"  RS DB: {settings.RS_DB_HOST or settings.LMS_DB_HOST}:{settings.RS_DB_PORT or settings.LMS_DB_PORT}/{settings.RS_DB_NAME or settings.LMS_DB_NAME}")


@app.command()
def rebuild_index():
    """Rebuild FAISS index from trained model."""
    typer.echo("Rebuilding FAISS index...")
    
    async def run():
        from app.scripts.export_item_embeddings import main as export_main
        try:
            await export_main()
            typer.echo("\n✓ Index rebuilt")
        except Exception as e:
            typer.echo(f"Error during rebuild: {e}", err=True)
            raise typer.Exit(1)
    
    asyncio.run(run())


if __name__ == "__main__":
    app()

