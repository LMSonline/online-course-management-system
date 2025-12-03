"""
Admin API endpoints for managing course knowledge base (KB).

These endpoints allow teachers/admins to:
- Re-index course content
- View chunks for a course
- Delete chunks for a course

TODO: Add basic API key authentication later.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.infra.vector_store import DocumentChunk, VectorStore
from app.api.deps import get_vector_store
from app.scripts.ingest_courses import (
    fetch_courses_and_lessons,
    simple_chunk,
    build_lms_dsn,
)
from app.infra.embeddings import EmbeddingModel

router = APIRouter()


class ChunkInfo(BaseModel):
    """Info about a single chunk for admin viewing."""
    id: str
    course_id: str
    lesson_id: str | None
    section: str | None
    language: str | None
    content_preview: str  # First 200 chars
    score: float | None = None  # If available from last query


class ChunksResponse(BaseModel):
    """Response for listing chunks."""
    course_id: str
    total_chunks: int
    chunks: List[ChunkInfo]


@router.post("/admin/courses/{course_id}/reindex")
async def reindex_course(
    course_id: str,
    vector_store: VectorStore = Depends(get_vector_store),
):
    """
    Re-ingest course content for the given course_id.

    This will:
    1. Fetch course + lessons from LMS Postgres
    2. Chunk the content
    3. Embed chunks
    4. Add to vector store (replacing existing chunks for this course)
    """
    # First, delete existing chunks for this course
    await vector_store.delete_chunks_by_course(course_id)

    # Fetch course data
    try:
        course_texts = await fetch_courses_and_lessons()
    except Exception as exc:
        raise HTTPException(
            status_code=500, detail=f"Failed to fetch course data: {exc}"
        )

    # Find the target course
    target_course = None
    for course, text in course_texts:
        if course.id == course_id:
            target_course = (course, text)
            break

    if not target_course:
        raise HTTPException(status_code=404, detail=f"Course {course_id} not found")

    course, text = target_course

    # Chunk and embed
    chunks_text = simple_chunk(text, max_chars=1000)
    embedding_model = EmbeddingModel()
    embeddings = embedding_model.encode(chunks_text)

    # Create DocumentChunk objects
    chunks = [
        DocumentChunk(
            id=f"{course.id}_{idx}",
            course_id=course.id,
            content=chunk_text,
            lesson_id=None,  # TODO: map lesson_id if available
            section=None,
            language=None,  # TODO: detect language
        )
        for idx, chunk_text in enumerate(chunks_text)
    ]

    # Add to vector store
    await vector_store.add_documents(chunks, embeddings=embeddings)

    return {
        "course_id": course_id,
        "chunks_ingested": len(chunks),
        "status": "success",
    }


@router.get("/admin/courses/{course_id}/chunks", response_model=ChunksResponse)
async def list_course_chunks(
    course_id: str,
    vector_store: VectorStore = Depends(get_vector_store),
):
    """
    List all chunks for a course (for admin/debug viewing).
    """
    chunks = await vector_store.list_chunks_by_course(course_id)

    return ChunksResponse(
        course_id=course_id,
        total_chunks=len(chunks),
        chunks=[
            ChunkInfo(
                id=chunk.id,
                course_id=chunk.course_id,
                lesson_id=chunk.lesson_id,
                section=chunk.section,
                language=chunk.language,
                content_preview=chunk.content[:200] + "..." if len(chunk.content) > 200 else chunk.content,
                score=chunk.score,
            )
            for chunk in chunks
        ],
    )


@router.delete("/admin/courses/{course_id}/chunks")
async def delete_course_chunks(
    course_id: str,
    vector_store: VectorStore = Depends(get_vector_store),
):
    """
    Delete all chunks for a course from the vector store.
    """
    deleted_count = await vector_store.delete_chunks_by_course(course_id)

    return {
        "course_id": course_id,
        "deleted_count": deleted_count,
        "status": "success",
    }

