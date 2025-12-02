"""Loader for transcript/subtitle files (SRT, VTT, TXT)."""

from pathlib import Path
from typing import List, Dict, Any
import re
from app.ingestion.loaders.base import BaseLoader, ContentDocument


class TranscriptLoader(BaseLoader):
    """Loads content from transcript/subtitle files."""

    def __init__(self):
        self.supported_extensions = {".srt", ".vtt", ".txt"}

    async def load(self, source: str, **kwargs) -> List[ContentDocument]:
        """
        Load transcript content from file or directory.
        
        Args:
            source: File path or directory path
            **kwargs: 
                - course_id: Optional course ID
                - lesson_id: Optional lesson ID
        """
        path = Path(source)
        docs: List[ContentDocument] = []
        
        if path.is_file():
            docs.append(await self._load_file(path, kwargs))
        elif path.is_dir():
            for ext in self.supported_extensions:
                for file_path in path.rglob(f"*{ext}"):
                    docs.append(await self._load_file(file_path, kwargs))
        else:
            raise ValueError(f"Source path does not exist: {source}")
        
        return docs

    async def _load_file(
        self, path: Path, kwargs: Dict[str, Any]
    ) -> ContentDocument:
        """Load a single transcript file."""
        content = path.read_text(encoding="utf-8")
        
        # Parse based on file type
        if path.suffix.lower() == ".srt":
            text = self._parse_srt(content)
        elif path.suffix.lower() == ".vtt":
            text = self._parse_vtt(content)
        else:  # .txt
            text = content
        
        course_id = kwargs.get("course_id") or path.parent.name
        lesson_id = kwargs.get("lesson_id") or path.stem
        
        return ContentDocument(
            content=text,
            metadata={
                "course_id": course_id,
                "lesson_id": lesson_id,
                "section_id": None,
                "language": self._detect_language(text),
                "source_type": "transcript",
                "file_path": str(path),
                "title": path.stem,
            }
        )

    def _parse_srt(self, content: str) -> str:
        """Parse SRT subtitle format."""
        # Remove timestamps and sequence numbers, keep only text
        lines = []
        for line in content.splitlines():
            line = line.strip()
            # Skip empty lines, sequence numbers, and timestamps
            if not line or re.match(r'^\d+$', line) or '-->' in line:
                continue
            lines.append(line)
        return "\n".join(lines)

    def _parse_vtt(self, content: str) -> str:
        """Parse VTT subtitle format."""
        lines = []
        for line in content.splitlines():
            line = line.strip()
            # Skip WEBVTT header, timestamps, and empty lines
            if (
                not line
                or line.startswith("WEBVTT")
                or '-->' in line
                or line.startswith("NOTE")
            ):
                continue
            lines.append(line)
        return "\n".join(lines)

    def _detect_language(self, content: str) -> str | None:
        """Simple language detection."""
        if any(ord(c) >= 0x0100 for c in content[:500]):
            return "vi"
        return "en"

    def supports(self, source: str) -> bool:
        """Check if source is a transcript file or directory."""
        path = Path(source)
        if path.is_file():
            return path.suffix.lower() in self.supported_extensions
        if path.is_dir():
            return True
        return False

