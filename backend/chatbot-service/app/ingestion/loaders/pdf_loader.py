"""Loader for PDF files."""

from pathlib import Path
from typing import List, Dict, Any
from app.ingestion.loaders.base import BaseLoader, ContentDocument


class PDFLoader(BaseLoader):
    """Loads content from PDF files."""

    def __init__(self):
        self.supported_extensions = {".pdf"}

    async def load(self, source: str, **kwargs) -> List[ContentDocument]:
        """
        Load PDF content from file or directory.
        
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
            for pdf_file in path.rglob("*.pdf"):
                docs.append(await self._load_file(pdf_file, kwargs))
        else:
            raise ValueError(f"Source path does not exist: {source}")
        
        return docs

    async def _load_file(
        self, path: Path, kwargs: Dict[str, Any]
    ) -> ContentDocument:
        """Load a single PDF file and extract text."""
        try:
            import pymupdf  # PyMuPDF (fitz)
        except ImportError:
            raise ImportError(
                "PyMuPDF is required for PDF loading. "
                "Install with: pip install pymupdf"
            )
        
        import pymupdf as fitz
        
        doc = fitz.open(str(path))
        text_parts = []
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            text = page.get_text()
            text_parts.append(text)
        
        doc.close()
        
        full_text = "\n\n".join(text_parts)
        
        course_id = kwargs.get("course_id") or path.parent.name
        lesson_id = kwargs.get("lesson_id") or path.stem
        
        return ContentDocument(
            content=full_text,
            metadata={
                "course_id": course_id,
                "lesson_id": lesson_id,
                "section_id": None,
                "language": self._detect_language(full_text),
                "source_type": "pdf",
                "file_path": str(path),
                "title": path.stem,
            }
        )

    def _detect_language(self, content: str) -> str | None:
        """Simple language detection."""
        if any(ord(c) >= 0x0100 for c in content[:500]):
            return "vi"
        return "en"

    def supports(self, source: str) -> bool:
        """Check if source is a PDF file or directory."""
        path = Path(source)
        if path.is_file():
            return path.suffix.lower() in self.supported_extensions
        if path.is_dir():
            return True
        return False

