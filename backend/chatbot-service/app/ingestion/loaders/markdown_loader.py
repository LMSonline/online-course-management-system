"""Loader for Markdown files."""

import os
from pathlib import Path
from typing import List, Dict, Any
from app.ingestion.loaders.base import BaseLoader, ContentDocument


class MarkdownLoader(BaseLoader):
    """Loads content from Markdown files."""

    def __init__(self):
        self.supported_extensions = {".md", ".markdown"}

    async def load(self, source: str, **kwargs) -> List[ContentDocument]:
        """
        Load Markdown content from file or directory.
        
        Args:
            source: File path or directory path
            **kwargs: 
                - course_id: Optional course ID to assign
                - lesson_id: Optional lesson ID to assign
        """
        path = Path(source)
        docs: List[ContentDocument] = []
        
        if path.is_file():
            docs.append(await self._load_file(path, kwargs))
        elif path.is_dir():
            for md_file in path.rglob("*.md"):
                docs.extend(await self._load_file(md_file, kwargs))
            for md_file in path.rglob("*.markdown"):
                docs.extend(await self._load_file(md_file, kwargs))
        else:
            raise ValueError(f"Source path does not exist: {source}")
        
        return docs

    async def _load_file(
        self, path: Path, kwargs: Dict[str, Any]
    ) -> List[ContentDocument]:
        """Load a single Markdown file."""
        content = path.read_text(encoding="utf-8")
        
        # Try to extract metadata from frontmatter
        metadata = self._extract_frontmatter(content)
        
        # Use provided metadata or defaults
        course_id = kwargs.get("course_id") or metadata.get("course_id") or path.parent.name
        lesson_id = kwargs.get("lesson_id") or metadata.get("lesson_id") or path.stem
        
        return [ContentDocument(
            content=content,
            metadata={
                "course_id": course_id,
                "lesson_id": lesson_id,
                "section_id": metadata.get("section"),
                "language": metadata.get("language") or self._detect_language(content),
                "source_type": "markdown",
                "file_path": str(path),
                "title": metadata.get("title") or path.stem,
            }
        )]

    def _extract_frontmatter(self, content: str) -> Dict[str, Any]:
        """Extract YAML frontmatter from Markdown if present."""
        import re
        frontmatter_match = re.match(r'^---\n(.*?)\n---\n', content, re.DOTALL)
        if frontmatter_match:
            try:
                import yaml
                return yaml.safe_load(frontmatter_match.group(1)) or {}
            except Exception:
                pass
        return {}

    def _detect_language(self, content: str) -> str | None:
        """Simple language detection (can be enhanced)."""
        # Simple heuristic: check for Vietnamese characters
        if any(ord(c) >= 0x0100 for c in content[:500]):
            return "vi"
        return "en"

    def supports(self, source: str) -> bool:
        """Check if source is a Markdown file or directory."""
        path = Path(source)
        if path.is_file():
            return path.suffix.lower() in self.supported_extensions
        if path.is_dir():
            return True  # Assume directory might contain markdown files
        return False

