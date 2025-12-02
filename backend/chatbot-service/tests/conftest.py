"""
Pytest configuration and shared fixtures.
"""

import pytest
import numpy as np
from pathlib import Path
import tempfile
import shutil

from app.infra.vector_store import (
    InMemoryVectorStore,
    FaissVectorStore,
    DocumentChunk,
)
from app.infra.llm_client import DummyLLMClient, Llama3Client
from app.infra.embeddings import EmbeddingModel


@pytest.fixture
def temp_dir():
    """Temporary directory for test artifacts."""
    tmp = tempfile.mkdtemp()
    yield tmp
    shutil.rmtree(tmp, ignore_errors=True)


@pytest.fixture
def sample_chunks():
    """Sample document chunks for testing."""
    return [
        DocumentChunk(
            id="chunk1",
            course_id="course1",
            content="Python is a programming language.",
        ),
        DocumentChunk(
            id="chunk2",
            course_id="course1",
            content="Lists and tuples are data structures in Python.",
        ),
        DocumentChunk(
            id="chunk3",
            course_id="course2",
            content="Machine learning uses algorithms.",
        ),
    ]


@pytest.fixture
def sample_embeddings(sample_chunks):
    """Generate embeddings for sample chunks."""
    model = EmbeddingModel()
    texts = [chunk.content for chunk in sample_chunks]
    return model.encode(texts)


@pytest.fixture
def inmemory_vector_store():
    """In-memory vector store for testing."""
    return InMemoryVectorStore()


@pytest.fixture
def faiss_vector_store(temp_dir):
    """FAISS vector store with temporary directory."""
    return FaissVectorStore(persist_dir=temp_dir)


@pytest.fixture
def dummy_llm_client():
    """Dummy LLM client for testing."""
    return DummyLLMClient()


@pytest.fixture
def embedding_model():
    """Embedding model for testing."""
    return EmbeddingModel()

