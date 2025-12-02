"""
Export course video content from LMS DB to JSONL format.

This script connects to the LMS Postgres database and exports course video content
into a JSONL file suitable for RAG ingestion and content-based recommendation.

Usage:
    python -m app.scripts.export_course_videos_jsonl --output data/course_videos.jsonl
    python -m app.scripts.export_course_videos_jsonl --output data/course_videos.jsonl --min-duration 60
    python -m app.scripts.export_course_videos_jsonl --output data/course_videos.jsonl --course-id course_python_basic
"""

import asyncio
import json
import os
from datetime import datetime
from pathlib import Path
from typing import List, Optional

import asyncpg
import typer

from app.core.settings import settings

app = typer.Typer()


def build_lms_dsn() -> str:
    """Build PostgreSQL DSN from environment variables."""
    host = settings.LMS_DB_HOST
    port = settings.LMS_DB_PORT
    name = settings.LMS_DB_NAME
    user = settings.LMS_DB_USER
    password = settings.LMS_DB_PASSWORD
    return f"postgresql://{user}:{password}@{host}:{port}/{name}"


async def fetch_course_videos(
    course_id: Optional[str] = None,
    min_duration: int = 0,
) -> List[dict]:
    """
    Fetch course video content from LMS Postgres.

    Args:
        course_id: Optional course ID filter
        min_duration: Minimum video duration in seconds

    Returns:
        List of video records as dictionaries
    """
    dsn = build_lms_dsn()
    conn = await asyncpg.connect(dsn)

    try:
        # Build query based on LMS schema
        # Assumes: courses, course_versions, chapters, lessons, course_tags, tags tables
        query = """
            SELECT DISTINCT
                l.id::text as lesson_id,
                l.title as lesson_title,
                l.content_url as video_url,
                l.duration_seconds,
                l.type as lesson_type,
                c.id::text as course_id,
                c.title as course_title,
                c.difficulty::text as difficulty,
                cv.description as course_description,
                ch.id::text as chapter_id,
                ch.title as chapter_title,
                array_agg(DISTINCT t.name) FILTER (WHERE t.name IS NOT NULL) as tags,
                c.created_at,
                c.updated_at
            FROM lessons l
            JOIN chapters ch ON l.chapter_id = ch.id
            JOIN course_versions cv ON ch.course_version_id = cv.id
            JOIN courses c ON cv.course_id = c.id
            LEFT JOIN course_tags ct ON c.id = ct.course_id
            LEFT JOIN tags t ON ct.tag_id = t.id
            WHERE l.type = 'VIDEO'
                AND l.duration_seconds >= $1
                AND c.deleted_at IS NULL
                AND l.deleted_at IS NULL
        """

        params = [min_duration]

        if course_id:
            query += " AND c.id::text = $2"
            params.append(course_id)

        query += """
            GROUP BY
                l.id, l.title, l.content_url, l.duration_seconds, l.type,
                c.id, c.title, c.difficulty, cv.description,
                ch.id, ch.title, c.created_at, c.updated_at
            ORDER BY c.id, ch.id, l.id
        """

        rows = await conn.fetch(query, *params)

        # Transform to JSONL format
        videos = []
        for row in rows:
            # Extract tags (PostgreSQL array)
            tags_list = row["tags"] or []
            
            # Infer skills and topics from tags and course content
            skills = _infer_skills(tags_list, row["course_title"])
            topics = _infer_topics(tags_list, row["lesson_title"])

            # Generate video ID (use lesson_id as video_id for now)
            video_id = f"video_{row['lesson_id']}"

            # For transcript text, we'll use lesson description or placeholder
            # In production, you'd fetch actual transcript from a transcript table
            transcript_text = row.get("course_description", "") or f"{row['lesson_title']}. {row.get('course_description', '')}"

            video_record = {
                "id": video_id,
                "course_id": row["course_id"],
                "course_title": row["course_title"],
                "lesson_id": row["lesson_id"],
                "lesson_title": row["lesson_title"],
                "video_id": video_id,
                "video_title": row["lesson_title"],
                "video_url": row["video_url"] or "",
                "language": "en",  # Default, could be extracted from course metadata
                "difficulty": row["difficulty"] or "BEGINNER",
                "duration_sec": row["duration_seconds"] or 0,
                "start_time_sec": 0,  # For full video, start at 0
                "end_time_sec": row["duration_seconds"] or 0,
                "content_type": "video_transcript",
                "text": transcript_text,
                "tags": tags_list,
                "skills": skills,
                "topics": topics,
                "source": "lms_db",
                "created_at": row["created_at"].isoformat() if row["created_at"] else datetime.utcnow().isoformat() + "Z",
                "updated_at": row["updated_at"].isoformat() if row["updated_at"] else datetime.utcnow().isoformat() + "Z",
            }
            videos.append(video_record)

        return videos

    finally:
        await conn.close()


def _infer_skills(tags: List[str], course_title: str) -> List[str]:
    """Infer skills from tags and course title."""
    skills = []
    text_lower = course_title.lower() + " " + " ".join(tags).lower()
    
    skill_keywords = {
        "programming": ["programming", "code", "coding", "developer"],
        "data-analysis": ["data", "analysis", "analytics", "pandas", "numpy"],
        "machine-learning": ["machine learning", "ml", "ai", "neural", "model"],
        "statistics": ["statistics", "statistical", "probability"],
        "visualization": ["visualization", "plotting", "matplotlib", "seaborn"],
        "web-development": ["web", "html", "css", "javascript", "react"],
        "database": ["database", "sql", "postgres", "mysql"],
    }
    
    for skill, keywords in skill_keywords.items():
        if any(kw in text_lower for kw in keywords):
            skills.append(skill)
    
    return skills if skills else ["general"]


def _infer_topics(tags: List[str], lesson_title: str) -> List[str]:
    """Infer topics from tags and lesson title."""
    topics = []
    text_lower = lesson_title.lower() + " " + " ".join(tags).lower()
    
    topic_keywords = {
        "programming-languages": ["python", "java", "javascript", "language"],
        "data-structures": ["list", "dictionary", "array", "data structure"],
        "algorithms": ["algorithm", "sorting", "searching", "optimization"],
        "oop": ["object", "class", "inheritance", "polymorphism"],
        "web-frameworks": ["django", "flask", "spring", "react"],
        "databases": ["database", "sql", "query"],
    }
    
    for topic, keywords in topic_keywords.items():
        if any(kw in text_lower for kw in keywords):
            topics.append(topic)
    
    # Add tags as topics if they don't match known topics
    for tag in tags:
        if tag not in " ".join(topics).lower():
            topics.append(tag.replace("-", "_"))
    
    return topics[:5]  # Limit to 5 topics


async def export_to_jsonl(
    output_path: str,
    course_id: Optional[str] = None,
    min_duration: int = 0,
) -> None:
    """
    Export course videos to JSONL file.

    Args:
        output_path: Path to output JSONL file
        course_id: Optional course ID filter
        min_duration: Minimum video duration in seconds
    """
    print(f"Fetching course videos from LMS DB...")
    print(f"  Course ID filter: {course_id or 'all'}")
    print(f"  Min duration: {min_duration}s")

    videos = await fetch_course_videos(course_id=course_id, min_duration=min_duration)

    if not videos:
        print("No videos found matching criteria.")
        return

    # Ensure output directory exists
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    # Write JSONL file
    with open(output_file, "w", encoding="utf-8") as f:
        for video in videos:
            f.write(json.dumps(video, ensure_ascii=False) + "\n")

    print(f"Exported {len(videos)} videos to {output_path}")


@app.command()
def main(
    output: str = typer.Option(
        "data/course_videos.jsonl",
        "--output",
        "-o",
        help="Output JSONL file path",
    ),
    course_id: Optional[str] = typer.Option(
        None,
        "--course-id",
        "-c",
        help="Filter by specific course ID",
    ),
    min_duration: int = typer.Option(
        0,
        "--min-duration",
        "-d",
        help="Minimum video duration in seconds",
    ),
):
    """Export course videos from LMS DB to JSONL format."""
    asyncio.run(export_to_jsonl(output, course_id=course_id, min_duration=min_duration))


if __name__ == "__main__":
    app()

