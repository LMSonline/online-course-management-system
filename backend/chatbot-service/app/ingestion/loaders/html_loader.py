"""Loader for HTML files."""

from pathlib import Path
from typing import List, Dict, Any
from app.ingestion.loaders.base import BaseLoader, ContentDocument


class HTMLLoader(BaseLoader):
    """Loads content from HTML files."""

    def __init__(self):
        self.supported_extensions = {".html", ".htm"}

    async def load(self, source: str, **kwargs) -> List[ContentDocument]:
        """
        Load HTML content from file or directory.
        
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
            for html_file in path.rglob("*.html"):
                docs.append(await self._load_file(html_file, kwargs))
            for html_file in path.rglob("*.htm"):
                docs.append(await self._load_file(html_file, kwargs))
        else:
            raise ValueError(f"Source path does not exist: {source}")
        
        return docs

    async def _load_file(
        self, path: Path, kwargs: Dict[str, Any]
    ) -> ContentDocument:
        """Load a single HTML file and extract text content."""
        try:
            from bs4 import BeautifulSoup
        except ImportError:
            raise ImportError(
                "BeautifulSoup4 is required for HTML loading. "
                "Install with: pip install beautifulsoup4"
            )
        
        html_content = path.read_text(encoding="utf-8")
        soup = BeautifulSoup(html_content, "html.parser")
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Extract text
        text = soup.get_text(separator="\n", strip=True)
        
        # Try to extract title
        title = soup.title.string if soup.title else path.stem
        
        course_id = kwargs.get("course_id") or path.parent.name
        lesson_id = kwargs.get("lesson_id") or path.stem
        
        return ContentDocument(
            content=text,
            metadata={
                "course_id": course_id,
                "lesson_id": lesson_id,
                "section_id": None,
                "language": self._detect_language(text),
                "source_type": "html",
                "file_path": str(path),
                "title": title,
            }
        )

    def _detect_language(self, content: str) -> str | None:
        """Simple language detection."""
        if any(ord(c) >= 0x0100 for c in content[:500]):
            return "vi"
        return "en"

    def supports(self, source: str) -> bool:
        """Check if source is an HTML file or directory."""
        path = Path(source)
        if path.is_file():
            return path.suffix.lower() in self.supported_extensions
        if path.is_dir():
            return True
        return False

