"""
Offline ingestion script for course content into the chatbot vector store.

Usage (from chatbot-service folder or repo root):

    python -m app.scripts.ingest_courses

This script:
- Connects to the LMS Postgres database using env vars:
    LMS_DB_HOST, LMS_DB_PORT, LMS_DB_NAME, LMS_DB_USER, LMS_DB_PASSWORD
- Reads course and lesson content (assumes tables / columns, see notes below).
- Chunks long text into smaller pieces.
- Encodes chunks into embeddings using a local sentence-transformers model.
- Writes chunks + embeddings into the configured VectorStore backend.

ASSUMED SCHEMA (you can adjust this script if your actual schema differs):
- Table `course` with columns:
    id (TEXT), title (TEXT), description (TEXT)
- Table `lesson` with columns:
    id (TEXT), course_id (TEXT), content (TEXT)
"""

from __future__ import annotations

import asyncio
import os
from dataclasses import dataclass
from typing import List

import asyncpg

from app.infra.embeddings import EmbeddingModel
from app.infra.vector_store import (
    DocumentChunk,
    InMemoryEmbeddingVectorStore,
    FaissVectorStore,
    VectorStore,
)


def build_lms_dsn() -> str:
    host = os.getenv("LMS_DB_HOST", "localhost")
    port = os.getenv("LMS_DB_PORT", "5432")
    name = os.getenv("LMS_DB_NAME", "lms")
    user = os.getenv("LMS_DB_USER", "postgres")
    password = os.getenv("LMS_DB_PASSWORD", "postgres")
    return f"postgresql://{user}:{password}@{host}:{port}/{name}"


@dataclass
class CourseRecord:
    id: str
    title: str
    description: str


async def fetch_courses_and_lessons() -> List[tuple[CourseRecord, str]]:
    """
    Fetch courses and associated lesson content from LMS Postgres.

    Returns a list of (course, text) pairs where text is the concatenated
    description + lesson contents.
    """
    dsn = build_lms_dsn()
    conn = await asyncpg.connect(dsn)
    try:
        # NOTE: adjust table/column names if your schema differs.
        courses_rows = await conn.fetch(
            "SELECT id, title, description FROM course"
        )
        lessons_rows = await conn.fetch(
            "SELECT course_id, content FROM lesson"
        )
    finally:
        await conn.close()

    lessons_by_course: dict[str, List[str]] = {}
    for row in lessons_rows:
        cid = row["course_id"]
        lessons_by_course.setdefault(cid, []).append(row["content"] or "")

    result: List[tuple[CourseRecord, str]] = []
    for row in courses_rows:
        course = CourseRecord(
            id=row["id"],
            title=row["title"] or "",
            description=row["description"] or "",
        )
        lesson_text = "\n\n".join(lessons_by_course.get(course.id, []))
        full_text = f"{course.title}\n\n{course.description}\n\n{lesson_text}"
        result.append((course, full_text))

    return result


def simple_chunk(text: str, max_chars: int = 1000) -> List[str]:
    """
    Very simple character-based chunking for demo purposes.

    In a real system you would want token-based chunking with overlap.
    """
    chunks: List[str] = []
    text = text.strip()
    for i in range(0, len(text), max_chars):
        chunks.append(text[i : i + max_chars])
    return chunks


async def async_main() -> None:
    print("Loading courses and lessons from LMS Postgres...")
    course_texts = await fetch_courses_and_lessons()
    if not course_texts:
        print("No courses found in LMS – nothing to ingest.")
        return

    print(f"Fetched {len(course_texts)} courses. Chunking & embedding...")
    embedding_model = EmbeddingModel()

    backend = os.getenv("VECTOR_STORE_BACKEND", "inmemory").lower()
    store: VectorStore
    if backend == "faiss":
        store = FaissVectorStore()
    else:
        # Default: in-memory embedding store (non-persistent)
        store = InMemoryEmbeddingVectorStore()

    all_chunks: List[DocumentChunk] = []
    all_texts: List[str] = []

    for course, text in course_texts:
        chunks = simple_chunk(text)
        for idx, chunk_text in enumerate(chunks):
            chunk = DocumentChunk(
                id=f"{course.id}_{idx}",
                course_id=course.id,
                content=chunk_text,
                # For now we don't split by lesson/section in this script;
                # those can be added once the LMS schema is mapped in detail.
                lesson_id=None,
                section=None,
                language=None,
            )
            all_chunks.append(chunk)
            all_texts.append(chunk_text)

    import numpy as np

    embeddings = embedding_model.encode(all_texts)
    await store.add_documents(all_chunks, embeddings=embeddings)

    print(f"Ingested {len(all_chunks)} chunks into the vector store (in-memory demo).")


def main() -> None:
    asyncio.run(async_main())


if __name__ == "__main__":
    main()


