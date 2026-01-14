import logging
from typing import List, Dict, Optional
from pathlib import Path
import re

logger = logging.getLogger(__name__)

class DocumentParser:
    """
    Service for parsing various document formats into text.
    
    Supports:
    - Plain text (.txt)
    - Markdown (.md)
    - PDF (.pdf) - requires PyPDF2
    - HTML (.html, .htm)
    """
    
    def __init__(self):
        self.supported_extensions = {'.txt', '.md', '.pdf', '.html', '.htm'}
    
    def parse_file(self, file_path: str) -> Dict[str, any]:
        """
        Parse a file and extract text content.
        
        Args:
            file_path: Path to the file
            
        Returns:
            Dictionary with:
            - content: Extracted text
            - metadata: File metadata (name, size, type)
            - success: Whether parsing succeeded
            - error: Error message if failed
        """
        try:
            path = Path(file_path)
            
            if not path.exists():
                return {
                    "content": "",
                    "metadata": {},
                    "success": False,
                    "error": "File not found"
                }
            
            extension = path.suffix.lower()
            
            if extension not in self.supported_extensions:
                return {
                    "content": "",
                    "metadata": {},
                    "success": False,
                    "error": f"Unsupported file type: {extension}"
                }
            
            # Parse based on file type
            if extension == '.txt':
                content = self._parse_text(path)
            elif extension == '.md':
                content = self._parse_markdown(path)
            elif extension == '.pdf':
                content = self._parse_pdf(path)
            elif extension in {'.html', '.htm'}:
                content = self._parse_html(path)
            else:
                content = ""
            
            metadata = {
                "filename": path.name,
                "size_bytes": path.stat().st_size,
                "extension": extension,
                "type": self._get_content_type(extension)
            }
            
            return {
                "content": content,
                "metadata": metadata,
                "success": True,
                "error": None
            }
            
        except Exception as e:
            logger.error(f"Error parsing file {file_path}: {e}")
            return {
                "content": "",
                "metadata": {},
                "success": False,
                "error": str(e)
            }
    
    def parse_text(self, text: str, file_type: str = "txt") -> Dict[str, any]:
        """
        Parse text content directly (for uploaded content).
        
        Args:
            text: Text content to parse
            file_type: Type of content (txt, md, html)
            
        Returns:
            Dictionary with parsed content and metadata
        """
        try:
            if file_type == "md":
                # Strip markdown formatting for plain text
                content = self._strip_markdown(text)
            elif file_type == "html":
                # Strip HTML tags
                content = self._strip_html(text)
            else:
                content = text
            
            return {
                "content": content,
                "metadata": {
                    "type": file_type,
                    "size_bytes": len(text.encode('utf-8'))
                },
                "success": True,
                "error": None
            }
            
        except Exception as e:
            logger.error(f"Error parsing text: {e}")
            return {
                "content": "",
                "metadata": {},
                "success": False,
                "error": str(e)
            }
    
    def _parse_text(self, path: Path) -> str:
        """Parse plain text file."""
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            return f.read()
    
    def _parse_markdown(self, path: Path) -> str:
        """Parse markdown file (strip formatting for plain text)."""
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        return self._strip_markdown(content)
    
    def _parse_pdf(self, path: Path) -> str:
        """Parse PDF file."""
        try:
            import PyPDF2
            
            text = []
            with open(path, 'rb') as f:
                pdf_reader = PyPDF2.PdfReader(f)
                for page in pdf_reader.pages:
                    text.append(page.extract_text())
            
            return '\n'.join(text)
            
        except ImportError:
            logger.warning("PyPDF2 not installed. Cannot parse PDF files.")
            return "[PDF parsing requires PyPDF2 library]"
        except Exception as e:
            logger.error(f"Error parsing PDF: {e}")
            return f"[Error parsing PDF: {str(e)}]"
    
    def _parse_html(self, path: Path) -> str:
        """Parse HTML file (strip tags)."""
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        return self._strip_html(content)
    
    def _strip_markdown(self, text: str) -> str:
        """Strip markdown formatting to get plain text."""
        # Remove headers
        text = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
        
        # Remove bold/italic
        text = re.sub(r'\*\*(.+?)\*\*', r'\1', text)
        text = re.sub(r'\*(.+?)\*', r'\1', text)
        text = re.sub(r'__(.+?)__', r'\1', text)
        text = re.sub(r'_(.+?)_', r'\1', text)
        
        # Remove links but keep text
        text = re.sub(r'\[(.+?)\]\(.+?\)', r'\1', text)
        
        # Remove images
        text = re.sub(r'!\[.+?\]\(.+?\)', '', text)
        
        # Remove code blocks
        text = re.sub(r'```.*?```', '', text, flags=re.DOTALL)
        text = re.sub(r'`(.+?)`', r'\1', text)
        
        # Remove horizontal rules
        text = re.sub(r'^[-*_]{3,}$', '', text, flags=re.MULTILINE)
        
        return text.strip()
    
    def _strip_html(self, text: str) -> str:
        """Strip HTML tags to get plain text."""
        # Remove script and style elements
        text = re.sub(r'<script.*?</script>', '', text, flags=re.DOTALL | re.IGNORECASE)
        text = re.sub(r'<style.*?</style>', '', text, flags=re.DOTALL | re.IGNORECASE)
        
        # Remove HTML tags
        text = re.sub(r'<[^>]+>', '', text)
        
        # Decode HTML entities
        text = text.replace('&nbsp;', ' ')
        text = text.replace('&lt;', '<')
        text = text.replace('&gt;', '>')
        text = text.replace('&amp;', '&')
        text = text.replace('&quot;', '"')
        text = text.replace('&#39;', "'")
        
        return text.strip()
    
    def _get_content_type(self, extension: str) -> str:
        """Get MIME type for file extension."""
        types = {
            '.txt': 'text/plain',
            '.md': 'text/markdown',
            '.pdf': 'application/pdf',
            '.html': 'text/html',
            '.htm': 'text/html'
        }
        return types.get(extension, 'application/octet-stream')
    
    def parse_bulk(self, file_paths: List[str]) -> List[Dict[str, any]]:
        """
        Parse multiple files in bulk.
        
        Args:
            file_paths: List of file paths to parse
            
        Returns:
            List of parse results for each file
        """
        results = []
        for file_path in file_paths:
            result = self.parse_file(file_path)
            result['file_path'] = file_path
            results.append(result)
        
        return results
    
    def is_supported(self, filename: str) -> bool:
        """Check if file type is supported."""
        extension = Path(filename).suffix.lower()
        return extension in self.supported_extensions
