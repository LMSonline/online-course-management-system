"""
Loader for JSONL (JSON Lines) files containing course video content.

This loader reads course_videos.jsonl files where each line is a JSON object
representing a video with transcript, metadata, and tags.
"""

import json
from pathlib import Path
from typing import List, Optional

from app.ingestion.loaders.base import BaseLoader, ContentDocument


class JSONLLoader(BaseLoader):
    """Loads content from JSONL files (one JSON object per line)."""

    async def load(self, source: str, **kwargs) -> List[ContentDocument]:
        """
        Load content from a JSONL file.

        Args:
            source: Path to JSONL file
            **kwargs:
                - course_id: Optional course ID to filter or override

        Returns:
            List of ContentDocument objects
        """
        source_path = Path(source)
        if not source_path.exists():
            raise FileNotFoundError(f"JSONL file not found: {source}")

        # Get course_id from kwargs (can be used for filtering or overriding)
        course_id_from_kwargs = kwargs.get("course_id")

        documents = []
        with open(source_path, "r", encoding="utf-8") as f:
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if not line:
                    continue

                try:
                    data = json.loads(line)
                    
                    # Filter by course_id if specified in kwargs
                    if course_id_from_kwargs and data.get("course_id") != course_id_from_kwargs:
                        continue

                    # Extract text content (transcript)
                    text = data.get("text", "")
                    if not text:
                        continue  # Skip entries without text

                    # Build metadata from JSONL fields
                    # Override course_id if provided in kwargs
                    metadata = {
                        "course_id": course_id_from_kwargs or data.get("course_id"),
                        "lesson_id": data.get("lesson_id"),
                        "video_id": data.get("video_id"),
                        "course_title": data.get("course_title"),
                        "lesson_title": data.get("lesson_title"),
                        "video_title": data.get("video_title"),
                        "video_url": data.get("video_url"),
                        "language": data.get("language", "en"),
                        "difficulty": data.get("difficulty"),
                        "duration_sec": data.get("duration_sec"),
                        "content_type": data.get("content_type", "video_transcript"),
                        "tags": data.get("tags", []),
                        "skills": data.get("skills", []),
                        "topics": data.get("topics", []),
                        "source": data.get("source", "jsonl"),
                        "source_type": "jsonl",
                        "source_file": str(source_path),
                        "line_number": line_num,
                    }

                    # Create document
                    doc = ContentDocument(
                        content=text,
                        metadata=metadata,
                    )
                    documents.append(doc)

                except json.JSONDecodeError as e:
                    # Log error but continue processing
                    print(f"Warning: Failed to parse line {line_num} in {source}: {e}")
                    continue

        return documents

    def supports(self, source: str) -> bool:
        """Check if source is a JSONL file."""
        source_path = Path(source)
        return source_path.is_file() and source_path.suffix == ".jsonl"

