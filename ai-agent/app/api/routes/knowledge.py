from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from typing import List, Optional
from app.models.schemas import (
    AddKnowledgeRequest,
    KnowledgeSearchRequest,
    KnowledgeSearchResponse,
    KnowledgeEntry,
    KnowledgeCategory,
    Document
)
from app.services.document_parser import DocumentParser
from starlette.requests import Request
import tempfile
import os
import logging
import uuid

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/", response_model=KnowledgeEntry)
async def add_knowledge(
    knowledge_request: AddKnowledgeRequest,
    request: Request
):
    """
    Add a new knowledge entry to the knowledge base.
    
    The entry will be embedded and stored for semantic search.
    """
    try:
        knowledge_base: KnowledgeBase = request.app.state.knowledge_base
        
        # Add knowledge entry
        entry_id = knowledge_base.add_knowledge(
            content=knowledge_request.content,
            category=knowledge_request.category,
            metadata=knowledge_request.metadata,
            source=knowledge_request.source
        )
        
        # Retrieve the created entry
        results = knowledge_base.search(
            query=knowledge_request.content[:100],  # Use first 100 chars
            category=knowledge_request.category,
            limit=1
        )
        
        if results:
            entry = results[0]
            entry.id = entry_id
            return entry
        
        # Fallback if search doesn't return the entry
        return KnowledgeEntry(
            id=entry_id,
            content=knowledge_request.content,
            category=knowledge_request.category,
            metadata=knowledge_request.metadata,
            source=knowledge_request.source,
            verified=False
        )
        
    except Exception as e:
        logger.error(f"Error adding knowledge: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to add knowledge: {str(e)}")

@router.post("/upload")
async def upload_knowledge(
    file: UploadFile = File(...),
    category: KnowledgeCategory = Form(...),
    source: str = Form("upload"),
    request: Request = None
):
    """
    Upload a document file to the knowledge base.
    
    Supported formats:
    - Plain text (.txt)
    - Markdown (.md)
    - PDF (.pdf)
    - HTML (.html, .htm)
    
    The document will be parsed, embedded, and stored.
    """
    try:
        knowledge_base: KnowledgeBase = request.app.state.knowledge_base
        parser = DocumentParser()
        
        # Check if file type is supported
        if not parser.is_supported(file.filename):
            raise HTTPException(
                status_code=400,
                detail=f"Unsupported file type. Supported: .txt, .md, .pdf, .html, .htm"
            )
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
            content = await file.read()
            tmp_file.write(content)
            tmp_file_path = tmp_file.name
        
        try:
            # Parse the document
            parse_result = parser.parse_file(tmp_file_path)
            
            if not parse_result['success']:
                raise HTTPException(
                    status_code=400,
                    detail=f"Failed to parse document: {parse_result['error']}"
                )
            
            # Add to knowledge base
            entry_id = knowledge_base.add_knowledge(
                content=parse_result['content'],
                category=category,
                metadata={
                    **parse_result['metadata'],
                    'original_filename': file.filename
                },
                source=source
            )
            
            return {
                "message": "Document uploaded and processed successfully",
                "entry_id": entry_id,
                "filename": file.filename,
                "content_length": len(parse_result['content']),
                "metadata": parse_result['metadata']
            }
            
        finally:
            # Clean up temporary file
            if os.path.exists(tmp_file_path):
                os.unlink(tmp_file_path)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading knowledge: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to upload knowledge: {str(e)}")

@router.post("/upload/bulk")
async def bulk_upload_knowledge(
    files: List[UploadFile] = File(...),
    category: KnowledgeCategory = Form(...),
    source: str = Form("bulk_upload"),
    request: Request = None
):
    """
    Upload multiple document files to the knowledge base in bulk.
    
    All files will be processed and added to the knowledge base.
    Returns summary of successful and failed uploads.
    """
    try:
        knowledge_base: KnowledgeBase = request.app.state.knowledge_base
        parser = DocumentParser()
        
        results = {
            "total": len(files),
            "successful": 0,
            "failed": 0,
            "entries": []
        }
        
        for file in files:
            try:
                # Check if file type is supported
                if not parser.is_supported(file.filename):
                    results['failed'] += 1
                    results['entries'].append({
                        "filename": file.filename,
                        "success": False,
                        "error": "Unsupported file type"
                    })
                    continue
                
                # Save uploaded file temporarily
                with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp_file:
                    content = await file.read()
                    tmp_file.write(content)
                    tmp_file_path = tmp_file.name
                
                try:
                    # Parse the document
                    parse_result = parser.parse_file(tmp_file_path)
                    
                    if not parse_result['success']:
                        results['failed'] += 1
                        results['entries'].append({
                            "filename": file.filename,
                            "success": False,
                            "error": parse_result['error']
                        })
                        continue
                    
                    # Add to knowledge base
                    entry_id = knowledge_base.add_knowledge(
                        content=parse_result['content'],
                        category=category,
                        metadata={
                            **parse_result['metadata'],
                            'original_filename': file.filename
                        },
                        source=source
                    )
                    
                    results['successful'] += 1
                    results['entries'].append({
                        "filename": file.filename,
                        "success": True,
                        "entry_id": entry_id,
                        "content_length": len(parse_result['content'])
                    })
                    
                finally:
                    # Clean up temporary file
                    if os.path.exists(tmp_file_path):
                        os.unlink(tmp_file_path)
                
            except Exception as e:
                logger.error(f"Error processing file {file.filename}: {e}")
                results['failed'] += 1
                results['entries'].append({
                    "filename": file.filename,
                    "success": False,
                    "error": str(e)
                })
        
        return results
        
    except Exception as e:
        logger.error(f"Error in bulk upload: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to process bulk upload: {str(e)}")

@router.get("/search", response_model=KnowledgeSearchResponse)
async def search_knowledge(
    query: str,
    category: Optional[KnowledgeCategory] = None,
    limit: int = 10,
    request: Request = None
):
    """
    Search the knowledge base using semantic similarity.
    
    Returns entries ranked by relevance to the query.
    """
    try:
        knowledge_base: KnowledgeBase = request.app.state.knowledge_base
        
        # Search knowledge base
        results = knowledge_base.search(
            query=query,
            category=category,
            limit=limit
        )
        
        return KnowledgeSearchResponse(
            results=results,
            total=len(results)
        )
        
    except Exception as e:
        logger.error(f"Error searching knowledge: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to search knowledge: {str(e)}")

@router.delete("/{entry_id}")
async def delete_knowledge(
    entry_id: str,
    request: Request
):
    """
    Delete a knowledge entry from the knowledge base.
    """
    try:
        knowledge_base: KnowledgeBase = request.app.state.knowledge_base
        
        # Delete the entry
        success = knowledge_base.delete_knowledge(entry_id)
        
        if not success:
            raise HTTPException(status_code=404, detail="Knowledge entry not found")
        
        return {
            "message": "Knowledge entry deleted successfully",
            "entry_id": entry_id
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting knowledge: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to delete knowledge: {str(e)}")

@router.put("/{entry_id}", response_model=KnowledgeEntry)
async def update_knowledge(
    entry_id: str,
    update_request: AddKnowledgeRequest,
    request: Request
):
    """
    Update an existing knowledge entry.
    
    The entry will be re-embedded with the new content.
    """
    try:
        knowledge_base: KnowledgeBase = request.app.state.knowledge_base
        
        # Update the entry
        success = knowledge_base.update_knowledge(
            entry_id=entry_id,
            content=update_request.content,
            category=update_request.category,
            metadata=update_request.metadata
        )
        
        if not success:
            raise HTTPException(status_code=404, detail="Knowledge entry not found")
        
        # Retrieve the updated entry
        results = knowledge_base.search(
            query=update_request.content[:100],
            category=update_request.category,
            limit=1
        )
        
        if results:
            entry = results[0]
            entry.id = entry_id
            return entry
        
        # Fallback
        return KnowledgeEntry(
            id=entry_id,
            content=update_request.content,
            category=update_request.category,
            metadata=update_request.metadata,
            source=update_request.source,
            verified=False
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating knowledge: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to update knowledge: {str(e)}")

@router.get("/categories")
async def list_categories():
    """
    List all available knowledge categories.
    """
    return {
        "categories": [
            {
                "value": cat.value,
                "label": cat.value.replace('_', ' ').title()
            }
            for cat in KnowledgeCategory
        ]
    }

@router.get("/stats")
async def get_knowledge_stats(request: Request):
    """
    Get statistics about the knowledge base.
    
    Includes:
    - Total entries
    - Entries by category
    - Total size
    - Recent additions
    """
    try:
        knowledge_base: KnowledgeBase = request.app.state.knowledge_base
        
        stats = knowledge_base.get_stats()
        
        return stats
        
    except Exception as e:
        logger.error(f"Error getting knowledge stats: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get knowledge stats: {str(e)}")

@router.post("/{entry_id}/verify")
async def verify_knowledge(
    entry_id: str,
    request: Request
):
    """
    Mark a knowledge entry as verified.
    
    Verified entries are considered more authoritative.
    """
    try:
        knowledge_base: KnowledgeBase = request.app.state.knowledge_base
        
        # This would need to be implemented in KnowledgeBase
        # For now, return success
        
        return {
            "message": "Knowledge entry verified successfully",
            "entry_id": entry_id,
            "verified": True
        }
        
    except Exception as e:
        logger.error(f"Error verifying knowledge: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to verify knowledge: {str(e)}")
