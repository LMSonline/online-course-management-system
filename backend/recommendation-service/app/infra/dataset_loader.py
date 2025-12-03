"""
Dataset loader for course video content from JSONL files.

This module provides utilities to load course video data from JSONL format
for use in content-based recommendation algorithms.
"""

import json
from pathlib import Path
from typing import Dict, List, Optional

from app.domain.models import Course


class CourseVideoDataset:
    """Dataset loader for course video JSONL files."""

    def __init__(self, jsonl_path: str):
        """
        Initialize dataset loader.

        Args:
            jsonl_path: Path to JSONL file containing course videos
        """
        self.jsonl_path = Path(jsonl_path)
        self._videos: List[Dict] = []
        self._load()

    def _load(self) -> None:
        """Load videos from JSONL file."""
        if not self.jsonl_path.exists():
            print(f"Warning: JSONL file not found: {self.jsonl_path}")
            return

        with open(self.jsonl_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                try:
                    video = json.loads(line)
                    self._videos.append(video)
                except json.JSONDecodeError as e:
                    print(f"Warning: Failed to parse line: {e}")
                    continue

    def get_videos_by_course(self, course_id: str) -> List[Dict]:
        """
        Get all videos for a specific course.

        Args:
            course_id: Course ID

        Returns:
            List of video dictionaries
        """
        return [v for v in self._videos if v.get("course_id") == course_id]

    def get_all_videos(self) -> List[Dict]:
        """Get all videos in the dataset."""
        return self._videos.copy()

    def get_course_text_content(self, course_id: str) -> str:
        """
        Get aggregated text content for a course (all video transcripts).

        Args:
            course_id: Course ID

        Returns:
            Concatenated text from all videos in the course
        """
        videos = self.get_videos_by_course(course_id)
        texts = [v.get("text", "") for v in videos]
        return " ".join(texts)

    def get_course_tags(self, course_id: str) -> List[str]:
        """
        Get all unique tags for a course.

        Args:
            course_id: Course ID

        Returns:
            List of unique tags
        """
        videos = self.get_videos_by_course(course_id)
        all_tags = []
        for video in videos:
            all_tags.extend(video.get("tags", []))
            all_tags.extend(video.get("skills", []))
            all_tags.extend(video.get("topics", []))
        return list(set(all_tags))

    def get_course_metadata(self, course_id: str) -> Dict:
        """
        Get aggregated metadata for a course.

        Args:
            course_id: Course ID

        Returns:
            Dictionary with course metadata
        """
        videos = self.get_videos_by_course(course_id)
        if not videos:
            return {}

        # Use first video's course metadata
        first_video = videos[0]
        return {
            "course_id": course_id,
            "course_title": first_video.get("course_title"),
            "difficulty": first_video.get("difficulty"),
            "language": first_video.get("language", "en"),
            "tags": self.get_course_tags(course_id),
            "total_videos": len(videos),
            "total_duration_sec": sum(v.get("duration_sec", 0) for v in videos),
        }

    def to_courses(self) -> List[Course]:
        """
        Convert dataset to Course objects for use with recommenders.

        Returns:
            List of Course objects
        """
        # Group videos by course_id
        courses_dict: Dict[str, Dict] = {}
        for video in self._videos:
            course_id = video.get("course_id")
            if not course_id:
                continue

            if course_id not in courses_dict:
                metadata = self.get_course_metadata(course_id)
                courses_dict[course_id] = {
                    "id": course_id,
                    "title": metadata.get("course_title", course_id),
                    "description": self.get_course_text_content(course_id)[:500],  # First 500 chars
                    "level": metadata.get("difficulty", "BEGINNER").lower(),
                    "tags": metadata.get("tags", []),
                }

        return [
            Course(
                id=c["id"],
                title=c["title"],
                description=c["description"],
                level=c["level"],
                tags=c["tags"],
            )
            for c in courses_dict.values()
        ]


def load_course_videos_dataset(jsonl_path: str = "data/course_videos.jsonl") -> CourseVideoDataset:
    """
    Convenience function to load course videos dataset.

    Args:
        jsonl_path: Path to JSONL file

    Returns:
        CourseVideoDataset instance
    """
    return CourseVideoDataset(jsonl_path)

