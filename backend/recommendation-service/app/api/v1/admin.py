"""Admin API endpoints for recommendation system."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from pathlib import Path
from app.core.settings import settings
from app.models.two_tower import TwoTowerModel
from app.infra.repositories import InMemoryCourseRepository


router = APIRouter()


class ModelInfoResponse(BaseModel):
    """Model information response."""
    models_loaded: List[str]
    embedding_dim: int
    num_indexed_items: int
    model_checkpoints: List[Dict[str, Any]]


def get_model_info() -> Dict[str, Any]:
    """Get information about loaded models."""
    models_dir = Path(settings.RS_MODELS_DIR)
    
    # Check for model files
    model_files = {
        "two_tower_model.pt": models_dir / "two_tower_model.pt",
        "item_embeddings.npy": models_dir / "item_embeddings.npy",
        "item_ids.txt": models_dir / "item_ids.txt",
        "items.faiss": models_dir / "items.faiss",
    }
    
    loaded_models = [
        name for name, path in model_files.items() if path.exists()
    ]
    
    # Get embedding dimension from settings
    embedding_dim = settings.EMBEDDING_DIM
    
    # Count indexed items
    num_indexed_items = 0
    if model_files["item_ids.txt"].exists():
        try:
            with open(model_files["item_ids.txt"], "r") as f:
                num_indexed_items = len([line for line in f if line.strip()])
        except Exception:
            pass
    
    # Get checkpoint info
    checkpoints = []
    if model_files["two_tower_model.pt"].exists():
        stat = model_files["two_tower_model.pt"].stat()
        checkpoints.append({
            "name": "two_tower_model.pt",
            "size_bytes": stat.st_size,
            "modified": stat.st_mtime,
        })
    
    return {
        "models_loaded": loaded_models,
        "embedding_dim": embedding_dim,
        "num_indexed_items": num_indexed_items,
        "model_checkpoints": checkpoints,
    }


@router.get("/models", response_model=ModelInfoResponse)
async def get_models_info():
    """Get information about loaded models and checkpoints."""
    info = get_model_info()
    return ModelInfoResponse(**info)


@router.post("/reindex")
async def reindex():
    """
    Trigger full re-export of item embeddings and rebuild FAISS index.
    
    This will:
    1. Load the trained two-tower model
    2. Compute embeddings for all courses
    3. Build FAISS index
    4. Save embeddings and index to disk
    """
    try:
        # Import here to avoid circular dependencies
        from app.scripts.export_item_embeddings import main as export_main
        import asyncio
        
        # Run export script
        await export_main()
        
        return {
            "status": "success",
            "message": "Item embeddings exported and FAISS index rebuilt",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to reindex: {str(e)}"
        )

