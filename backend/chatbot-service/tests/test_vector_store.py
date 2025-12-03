"""
Tests for VectorStore implementations.
"""

import pytest
import numpy as np
from pathlib import Path

from app.infra.vector_store import DocumentChunk, InMemoryVectorStore, FaissVectorStore


@pytest.mark.asyncio
async def test_inmemory_add_documents(inmemory_vector_store, sample_chunks):
    """Test adding documents to in-memory store."""
    await inmemory_vector_store.add_documents(sample_chunks)
    
    # Check that documents were added
    chunks = await inmemory_vector_store.list_chunks_by_course("course1")
    assert len(chunks) == 2
    assert chunks[0].id == "chunk1"
    assert chunks[1].id == "chunk2"


@pytest.mark.asyncio
async def test_inmemory_retrieve_for_course(inmemory_vector_store, sample_chunks):
    """Test retrieval from in-memory store."""
    await inmemory_vector_store.add_documents(sample_chunks)
    
    results = await inmemory_vector_store.retrieve_for_course(
        course_id="course1", question="Python", k=5
    )
    
    assert len(results) == 2
    assert all(chunk.course_id == "course1" for chunk in results)


@pytest.mark.asyncio
async def test_inmemory_delete_chunks(inmemory_vector_store, sample_chunks):
    """Test deleting chunks by course_id."""
    await inmemory_vector_store.add_documents(sample_chunks)
    
    deleted = await inmemory_vector_store.delete_chunks_by_course("course1")
    assert deleted == 2
    
    remaining = await inmemory_vector_store.list_chunks_by_course("course1")
    assert len(remaining) == 0


@pytest.mark.asyncio
async def test_faiss_add_documents(faiss_vector_store, sample_chunks, sample_embeddings):
    """Test adding documents to FAISS store."""
    await faiss_vector_store.add_documents(sample_chunks, embeddings=sample_embeddings)
    
    # Check that documents were added
    chunks = await faiss_vector_store.list_chunks_by_course("course1")
    assert len(chunks) == 2


@pytest.mark.asyncio
async def test_faiss_retrieve_for_course(faiss_vector_store, sample_chunks, sample_embeddings):
    """Test retrieval from FAISS store."""
    await faiss_vector_store.add_documents(sample_chunks, embeddings=sample_embeddings)
    
    results = await faiss_vector_store.retrieve_for_course(
        course_id="course1", question="Python programming", k=5
    )
    
    assert len(results) > 0
    assert all(chunk.course_id == "course1" for chunk in results)
    # Check that scores are attached
    assert all(chunk.score is not None for chunk in results)


@pytest.mark.asyncio
async def test_faiss_persistence(faiss_vector_store, temp_dir, sample_chunks, sample_embeddings):
    """Test FAISS persistence: add, reload, search still works."""
    # Add documents
    await faiss_vector_store.add_documents(sample_chunks, embeddings=sample_embeddings)
    
    # Create new store instance (simulating reload)
    new_store = FaissVectorStore(persist_dir=temp_dir)
    
    # Verify data was persisted
    chunks = await new_store.list_chunks_by_course("course1")
    assert len(chunks) == 2
    
    # Verify search still works
    results = await new_store.retrieve_for_course(
        course_id="course1", question="Python", k=5
    )
    assert len(results) > 0


@pytest.mark.asyncio
async def test_faiss_delete_chunks(faiss_vector_store, sample_chunks, sample_embeddings):
    """Test deleting chunks from FAISS store."""
    await faiss_vector_store.add_documents(sample_chunks, embeddings=sample_embeddings)
    
    deleted = await faiss_vector_store.delete_chunks_by_course("course1")
    assert deleted == 2
    
    remaining = await faiss_vector_store.list_chunks_by_course("course1")
    assert len(remaining) == 0

