"""Loader for LMS database content."""

import asyncpg
from typing import List, Dict, Any
from app.ingestion.loaders.base import BaseLoader, ContentDocument
from app.core.settings import settings


class LMSDatabaseLoader(BaseLoader):
    """Loads course content from LMS PostgreSQL database."""

    def __init__(self):
        self.dsn = self._build_dsn()

    def _build_dsn(self) -> str:
        """Build PostgreSQL connection string."""
        return (
            f"postgresql://{settings.LMS_DB_USER}:{settings.LMS_DB_PASSWORD}"
            f"@{settings.LMS_DB_HOST}:{settings.LMS_DB_PORT}/{settings.LMS_DB_NAME}"
        )

    async def load(self, source: str, **kwargs) -> List[ContentDocument]:
        """
        Load course content from LMS database.
        
        Args:
            source: Course ID (or "all" to load all courses)
            **kwargs: Optional lesson_id to filter by specific lesson
        """
        conn = await asyncpg.connect(self.dsn)
        try:
            if source == "all":
                return await self._load_all_courses(conn, kwargs.get("lesson_id"))
            else:
                return await self._load_course(conn, source, kwargs.get("lesson_id"))
        finally:
            await conn.close()

    async def _load_all_courses(
        self, conn: asyncpg.Connection, lesson_id: str | None = None
    ) -> List[ContentDocument]:
        """Load all courses from database."""
        docs: List[ContentDocument] = []
        
        # Fetch courses
        courses = await conn.fetch("SELECT id, title, description FROM course")
        
        # Fetch lessons
        if lesson_id:
            lessons = await conn.fetch(
                "SELECT id, course_id, content, title FROM lesson WHERE id = $1",
                lesson_id
            )
        else:
            lessons = await conn.fetch(
                "SELECT id, course_id, content, title FROM lesson"
            )
        
        lessons_by_course: Dict[str, List[Dict[str, Any]]] = {}
        for lesson in lessons:
            cid = lesson["course_id"]
            lessons_by_course.setdefault(cid, []).append({
                "id": lesson["id"],
                "content": lesson["content"] or "",
                "title": lesson.get("title") or "",
            })
        
        # Create documents
        for course in courses:
            course_id = course["id"]
            course_text = f"{course['title']}\n\n{course['description'] or ''}"
            
            # Add course-level document
            docs.append(ContentDocument(
                content=course_text,
                metadata={
                    "course_id": course_id,
                    "lesson_id": None,
                    "section_id": None,
                    "language": None,  # TODO: detect from content
                    "source_type": "db",
                    "title": course["title"],
                }
            ))
            
            # Add lesson documents
            for lesson in lessons_by_course.get(course_id, []):
                if lesson["content"]:
                    docs.append(ContentDocument(
                        content=lesson["content"],
                        metadata={
                            "course_id": course_id,
                            "lesson_id": lesson["id"],
                            "section_id": None,
                            "language": None,
                            "source_type": "db",
                            "title": lesson.get("title") or f"Lesson {lesson['id']}",
                        }
                    ))
        
        return docs

    async def _load_course(
        self, conn: asyncpg.Connection, course_id: str, lesson_id: str | None = None
    ) -> List[ContentDocument]:
        """Load a specific course."""
        docs: List[ContentDocument] = []
        
        # Fetch course
        course = await conn.fetchrow(
            "SELECT id, title, description FROM course WHERE id = $1", course_id
        )
        if not course:
            return docs
        
        course_text = f"{course['title']}\n\n{course['description'] or ''}"
        docs.append(ContentDocument(
            content=course_text,
            metadata={
                "course_id": course_id,
                "lesson_id": None,
                "section_id": None,
                "language": None,
                "source_type": "db",
                "title": course["title"],
            }
        ))
        
        # Fetch lessons
        if lesson_id:
            lessons = await conn.fetch(
                "SELECT id, course_id, content, title FROM lesson WHERE course_id = $1 AND id = $2",
                course_id, lesson_id
            )
        else:
            lessons = await conn.fetch(
                "SELECT id, course_id, content, title FROM lesson WHERE course_id = $1",
                course_id
            )
        
        for lesson in lessons:
            if lesson["content"]:
                docs.append(ContentDocument(
                    content=lesson["content"],
                    metadata={
                        "course_id": course_id,
                        "lesson_id": lesson["id"],
                        "section_id": None,
                        "language": None,
                        "source_type": "db",
                        "title": lesson.get("title") or f"Lesson {lesson['id']}",
                    }
                ))
        
        return docs

    def supports(self, source: str) -> bool:
        """Check if source is a database identifier."""
        # For now, assume all string sources are valid (could be course_id or "all")
        return isinstance(source, str) and not source.startswith(("http://", "https://", "/"))

