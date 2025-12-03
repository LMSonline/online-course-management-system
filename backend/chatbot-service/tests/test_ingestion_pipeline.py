"""
Comprehensive tests for the ingestion pipeline.

Tests loaders, chunkers, and IngestionService orchestration.
"""

import pytest
from pathlib import Path
import tempfile
import shutil
from unittest.mock import AsyncMock, MagicMock, patch

from app.ingestion.loaders import (
    LMSDatabaseLoader,
    MarkdownLoader,
    HTMLLoader,
    PDFLoader,
    TranscriptLoader,
    JSONLLoader,
)
from app.ingestion.chunkers import FixedSizeChunker, SemanticChunker
from app.ingestion.ingestion_service import IngestionService
from app.ingestion.loaders.base import ContentDocument
from app.infra.vector_store import InMemoryVectorStore


class TestLoaders:
    """Tests for content loaders."""

    @pytest.mark.asyncio
    async def test_lms_loader_with_mock_db(self):
        """Test LMS loader with mocked database."""
        loader = LMSDatabaseLoader()
        
        # Mock asyncpg connection
        mock_rows = [
            {"id": "course1", "title": "Python Basics", "description": "Learn Python"},
            {"id": "course2", "title": "Java Basics", "description": "Learn Java"},
        ]
        mock_lessons = [
            {"id": "lesson1", "course_id": "course1", "content": "Lesson 1 content", "title": "Lesson 1"},
            {"id": "lesson2", "course_id": "course1", "content": "Lesson 2 content", "title": "Lesson 2"},
        ]
        
        with patch("asyncpg.connect") as mock_connect:
            mock_conn = AsyncMock()
            mock_connect.return_value = mock_conn
            
            # Mock fetch for courses
            async def mock_fetch_courses(query, *args):
                if "SELECT id, title, description FROM course" in query:
                    return mock_rows
                elif "SELECT id, course_id, content, title FROM lesson" in query:
                    return mock_lessons
                return []
            
            async def mock_fetch(query, *args):
                if "SELECT id, title, description FROM course" in query:
                    return mock_rows
                elif "SELECT id, course_id, content, title FROM lesson" in query:
                    return mock_lessons
                return []
            
            mock_conn.fetch = AsyncMock(side_effect=mock_fetch)
            mock_conn.close = AsyncMock()
            
            docs = await loader.load("all")
            
            assert len(docs) > 0
            assert all(isinstance(doc, ContentDocument) for doc in docs)
            assert any(doc.metadata["course_id"] == "course1" for doc in docs)

    @pytest.mark.asyncio
    async def test_markdown_loader(self, tmp_path):
        """Test Markdown loader with temporary files."""
        loader = MarkdownLoader()
        
        # Create test markdown file
        md_file = tmp_path / "test.md"
        md_file.write_text(
            """# Course Title

## Section 1
Content for section 1.

## Section 2
Content for section 2.
"""
        )
        
        docs = await loader.load(str(md_file), course_id="test_course")
        
        assert len(docs) > 0
        assert docs[0].metadata["course_id"] == "test_course"
        assert docs[0].metadata["source_type"] == "markdown"
        assert "Course Title" in docs[0].content

    @pytest.mark.asyncio
    async def test_html_loader(self, tmp_path):
        """Test HTML loader with temporary files."""
        loader = HTMLLoader()
        
        # Create test HTML file
        html_file = tmp_path / "test.html"
        html_file.write_text(
            """<html>
<head><title>Test Course</title></head>
<body>
<h1>Course Title</h1>
<p>This is course content.</p>
</body>
</html>"""
        )
        
        docs = await loader.load(str(html_file), course_id="test_course")
        
        assert len(docs) > 0
        assert docs[0].metadata["course_id"] == "test_course"
        assert docs[0].metadata["source_type"] == "html"
        assert "Course Title" in docs[0].content

    @pytest.mark.asyncio
    async def test_transcript_loader_srt(self, tmp_path):
        """Test transcript loader with SRT file."""
        loader = TranscriptLoader()
        
        # Create test SRT file
        srt_file = tmp_path / "test.srt"
        srt_file.write_text(
            """1
00:00:00,000 --> 00:00:05,000
Hello, welcome to this course.

2
00:00:05,000 --> 00:00:10,000
Today we will learn about Python.
"""
        )
        
        docs = await loader.load(str(srt_file), course_id="test_course")
        
        assert len(docs) > 0
        assert docs[0].metadata["source_type"] == "transcript"
        assert "Hello, welcome" in docs[0].content
        assert "00:00:00" not in docs[0].content  # Timestamps should be removed

    @pytest.mark.asyncio
    async def test_transcript_loader_vtt(self, tmp_path):
        """Test transcript loader with VTT file."""
        loader = TranscriptLoader()
        
        # Create test VTT file
        vtt_file = tmp_path / "test.vtt"
        vtt_file.write_text(
            """WEBVTT

00:00:00.000 --> 00:00:05.000
Hello, welcome to this course.

00:00:05.000 --> 00:00:10.000
Today we will learn about Python.
"""
        )
        
        docs = await loader.load(str(vtt_file), course_id="test_course")
        
        assert len(docs) > 0
        assert "Hello, welcome" in docs[0].content
        assert "WEBVTT" not in docs[0].content  # Header should be removed

    @pytest.mark.asyncio
    async def test_jsonl_loader(self, tmp_path):
        """Test JSONL loader with sample JSONL file."""
        loader = JSONLLoader()
        
        # Create test JSONL file
        jsonl_file = tmp_path / "test.jsonl"
        jsonl_file.write_text(
            """{"id": "video_001", "course_id": "course_python_basic", "course_title": "Python Basics", "lesson_id": "lesson_001", "lesson_title": "Introduction", "video_id": "video_001", "video_title": "What is Python?", "text": "Welcome to Python Basics! Python is a high-level programming language.", "tags": ["python", "programming"], "skills": ["programming"], "topics": ["basics"], "language": "en", "difficulty": "BEGINNER"}
{"id": "video_002", "course_id": "course_python_basic", "course_title": "Python Basics", "lesson_id": "lesson_002", "lesson_title": "Variables", "video_id": "video_002", "video_title": "Understanding Variables", "text": "Variables in Python are containers for storing data values.", "tags": ["python", "variables"], "skills": ["programming"], "topics": ["variables"], "language": "en", "difficulty": "BEGINNER"}
"""
        )
        
        docs = await loader.load(str(jsonl_file), course_id="course_python_basic")
        
        assert len(docs) == 2
        assert all(isinstance(doc, ContentDocument) for doc in docs)
        assert all(doc.metadata["course_id"] == "course_python_basic" for doc in docs)
        assert all(doc.metadata["source_type"] == "jsonl" for doc in docs)
        assert "Welcome to Python Basics" in docs[0].content
        assert "Variables in Python" in docs[1].content
        assert docs[0].metadata["lesson_id"] == "lesson_001"
        assert docs[0].metadata["tags"] == ["python", "programming"]

    @pytest.mark.asyncio
    async def test_jsonl_loader_with_course_id_override(self, tmp_path):
        """Test JSONL loader with course_id override from kwargs."""
        loader = JSONLLoader()
        
        # Create test JSONL file with different course_id
        jsonl_file = tmp_path / "test.jsonl"
        jsonl_file.write_text(
            """{"id": "video_001", "course_id": "original_course", "text": "Test content", "tags": ["test"]}
"""
        )
        
        # Override course_id via kwargs
        docs = await loader.load(str(jsonl_file), course_id="new_course_id")
        
        assert len(docs) == 1
        assert docs[0].metadata["course_id"] == "new_course_id"  # Should be overridden

    @pytest.mark.asyncio
    async def test_jsonl_loader_filters_by_course_id(self, tmp_path):
        """Test JSONL loader filters by course_id when provided."""
        loader = JSONLLoader()
        
        # Create test JSONL file with multiple courses
        jsonl_file = tmp_path / "test.jsonl"
        jsonl_file.write_text(
            """{"id": "video_001", "course_id": "course_python", "text": "Python content", "tags": []}
{"id": "video_002", "course_id": "course_java", "text": "Java content", "tags": []}
{"id": "video_003", "course_id": "course_python", "text": "More Python content", "tags": []}
"""
        )
        
        # Filter by course_id
        docs = await loader.load(str(jsonl_file), course_id="course_python")
        
        assert len(docs) == 2
        assert all(doc.metadata["course_id"] == "course_python" for doc in docs)
        assert "Java content" not in [doc.content for doc in docs]

    def test_jsonl_loader_supports(self):
        """Test JSONL loader's supports method."""
        loader = JSONLLoader()
        
        assert loader.supports("/path/to/file.jsonl") is True
        assert loader.supports("/path/to/file.JSONL") is True
        assert loader.supports("/path/to/file.txt") is False
        assert loader.supports("/path/to/dir") is False


class TestChunkers:
    """Tests for chunking strategies."""

    def test_fixed_size_chunker(self):
        """Test fixed-size chunker."""
        chunker = FixedSizeChunker(chunk_size=100, chunk_overlap=20)
        
        doc = ContentDocument(
            content="A" * 250,  # 250 characters
            metadata={"course_id": "test"},
        )
        
        chunks = chunker.chunk(doc)
        
        assert len(chunks) > 1  # Should create multiple chunks
        assert all(len(chunk.content) <= 100 for chunk in chunks)
        assert all(chunk.metadata["course_id"] == "test" for chunk in chunks)

    def test_semantic_chunker_markdown(self):
        """Test semantic chunker with Markdown content."""
        chunker = SemanticChunker(min_chunk_size=50, max_chunk_size=200)
        
        doc = ContentDocument(
            content="""# Introduction

This is the introduction section.

## Section 1

Content for section 1 goes here.

## Section 2

Content for section 2 goes here.
""",
            metadata={"course_id": "test", "source_type": "markdown"},
        )
        
        chunks = chunker.chunk(doc)
        
        assert len(chunks) > 0
        assert all(chunk.metadata["course_id"] == "test" for chunk in chunks)

    def test_semantic_chunker_paragraphs(self):
        """Test semantic chunker with paragraph-based splitting."""
        chunker = SemanticChunker(min_chunk_size=50, max_chunk_size=200)
        
        doc = ContentDocument(
            content="Paragraph one.\n\nParagraph two.\n\nParagraph three.",
            metadata={"course_id": "test", "source_type": "text"},
        )
        
        chunks = chunker.chunk(doc)
        
        assert len(chunks) > 0


class TestIngestionService:
    """Tests for IngestionService orchestration."""

    @pytest.mark.asyncio
    async def test_ingestion_service_with_markdown(self, tmp_path):
        """Test full ingestion pipeline with Markdown files."""
        # Create test markdown file
        md_file = tmp_path / "course.md"
        md_file.write_text("# Python Course\n\nLearn Python programming.")
        
        vector_store = InMemoryVectorStore()
        service = IngestionService(vector_store=vector_store)
        
        result = await service.ingest(
            source=str(md_file),
            chunking_strategy="fixed",
            course_id="test_course",
        )
        
        assert result["documents_loaded"] > 0
        assert result["chunks_created"] > 0
        assert result["chunks_ingested"] > 0
        assert result["source"] == str(md_file)

    @pytest.mark.asyncio
    async def test_ingestion_service_semantic_chunking(self, tmp_path):
        """Test ingestion with semantic chunking."""
        md_file = tmp_path / "course.md"
        md_file.write_text(
            """# Course Title

## Section 1
Content here.

## Section 2
More content here.
"""
        )
        
        vector_store = InMemoryVectorStore()
        service = IngestionService(vector_store=vector_store)
        
        result = await service.ingest(
            source=str(md_file),
            chunking_strategy="semantic",
            course_id="test_course",
        )
        
        assert result["chunks_created"] > 0

    @pytest.mark.asyncio
    async def test_ingestion_service_error_handling(self):
        """Test ingestion service handles errors gracefully."""
        vector_store = InMemoryVectorStore()
        service = IngestionService(vector_store=vector_store)
        
        # Try to ingest from non-existent source
        with pytest.raises(ValueError):
            await service.ingest(source="/nonexistent/path")

    @pytest.mark.asyncio
    async def test_ingestion_service_statistics(self, tmp_path):
        """Test that ingestion returns correct statistics."""
        # Create multiple markdown files
        for i in range(3):
            md_file = tmp_path / f"course_{i}.md"
            md_file.write_text(f"# Course {i}\n\nContent for course {i}.")
        
        vector_store = InMemoryVectorStore()
        service = IngestionService(vector_store=vector_store)
        
        result = await service.ingest(
            source=str(tmp_path),
            chunking_strategy="fixed",
        )
        
        assert result["documents_loaded"] >= 3
        assert result["chunks_created"] > 0
        assert result["chunks_ingested"] == result["chunks_created"]

    @pytest.mark.asyncio
    async def test_ingestion_service_with_jsonl(self, tmp_path):
        """Test full ingestion pipeline with JSONL file."""
        # Create test JSONL file
        jsonl_file = tmp_path / "course_videos.jsonl"
        jsonl_file.write_text(
            """{"id": "video_001", "course_id": "course_python_basic", "course_title": "Python Basics", "lesson_id": "lesson_001", "text": "Welcome to Python Basics! Python is a high-level programming language.", "tags": ["python"], "language": "en"}
{"id": "video_002", "course_id": "course_python_basic", "course_title": "Python Basics", "lesson_id": "lesson_002", "text": "Variables in Python are containers for storing data values.", "tags": ["python"], "language": "en"}
"""
        )
        
        vector_store = InMemoryVectorStore()
        service = IngestionService(vector_store=vector_store)
        
        result = await service.ingest(
            source=str(jsonl_file),
            chunking_strategy="fixed",
            course_id="course_python_basic",
        )
        
        assert result["documents_loaded"] == 2
        assert result["chunks_created"] > 0
        assert result["chunks_ingested"] > 0
        assert result["source"] == str(jsonl_file)

