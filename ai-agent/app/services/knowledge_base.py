"""
Vector-based knowledge base for automotive information using ChromaDB.
"""
import chromadb
from chromadb.config import Settings
from typing import List, Optional, Dict, Any
from app.core.config import settings
from app.models.schemas import KnowledgeEntry, KnowledgeCategory, Document
from app.services.embedding_service import EmbeddingService
import logging
import uuid

logger = logging.getLogger(__name__)

class KnowledgeBase:
    """Vector-based knowledge base for automotive information"""
    
    def __init__(self):
        self.client: Optional[chromadb.Client] = None
        self.collection = None
        self.embedding_service = EmbeddingService()
        self.initialized = False
    
    async def initialize(self):
        """Initialize ChromaDB client and collection"""
        try:
            # Initialize ChromaDB client with persistent storage
            self.client = chromadb.Client(Settings(
                chroma_db_impl="duckdb+parquet",
                persist_directory=settings.CHROMA_PERSIST_DIR
            ))
            
            # Get or create collection
            self.collection = self.client.get_or_create_collection(
                name=settings.CHROMA_COLLECTION_NAME,
                metadata={"description": "Automotive knowledge base for car community AI"}
            )
            
            self.initialized = True
            logger.info(f"Knowledge base initialized with collection: {settings.CHROMA_COLLECTION_NAME}")
            logger.info(f"Collection contains {self.collection.count()} entries")
            
        except Exception as e:
            logger.error(f"Error initializing knowledge base: {e}")
            self.initialized = False
    
    async def add_knowledge(
        self, 
        content: str, 
        metadata: Dict[str, Any],
        entry_id: Optional[str] = None
    ) -> str:
        """
        Add knowledge entry with embedding.
        
        Args:
            content: The text content to store
            metadata: Metadata about the entry (category, source, etc.)
            entry_id: Optional custom ID, will generate UUID if not provided
            
        Returns:
            The ID of the stored entry
        """
        if not self.initialized:
            await self.initialize()
        
        try:
            # Generate ID if not provided
            if not entry_id:
                entry_id = str(uuid.uuid4())
            
            # Generate embedding
            embedding = await self.embedding_service.generate_embedding(content)
            
            # Store in ChromaDB
            self.collection.add(
                ids=[entry_id],
                embeddings=[embedding],
                documents=[content],
                metadatas=[metadata]
            )
            
            logger.info(f"Added knowledge entry: {entry_id}")
            return entry_id
            
        except Exception as e:
            logger.error(f"Error adding knowledge: {e}")
            raise
    
    async def search(
        self, 
        query: str, 
        category: Optional[str] = None,
        limit: int = 5,
        min_score: float = 0.7
    ) -> List[KnowledgeEntry]:
        """
        Search knowledge base using semantic similarity.
        
        Args:
            query: Search query text
            category: Optional category filter
            limit: Maximum number of results
            min_score: Minimum similarity score (0-1)
            
        Returns:
            List of relevant knowledge entries with scores
        """
        if not self.initialized:
            await self.initialize()
        
        try:
            # Generate query embedding
            query_embedding = await self.embedding_service.generate_embedding(query)
            
            # Build where filter for category
            where_filter = None
            if category:
                where_filter = {"category": category}
            
            # Search ChromaDB
            results = self.collection.query(
                query_embeddings=[query_embedding],
                n_results=limit,
                where=where_filter
            )
            
            # Convert to KnowledgeEntry objects
            entries = []
            if results and results['ids'] and len(results['ids'][0]) > 0:
                for i in range(len(results['ids'][0])):
                    # Calculate similarity score (ChromaDB returns distances, convert to similarity)
                    distance = results['distances'][0][i] if 'distances' in results else 0
                    score = 1 / (1 + distance)  # Convert distance to similarity score
                    
                    # Only include results above minimum score
                    if score >= min_score:
                        entry = KnowledgeEntry(
                            id=results['ids'][0][i],
                            content=results['documents'][0][i],
                            category=KnowledgeCategory(results['metadatas'][0][i].get('category', 'maintenance')),
                            metadata=results['metadatas'][0][i],
                            source=results['metadatas'][0][i].get('source', 'unknown'),
                            verified=results['metadatas'][0][i].get('verified', False),
                            score=score
                        )
                        entries.append(entry)
            
            logger.info(f"Search for '{query}' returned {len(entries)} results")
            return entries
            
        except Exception as e:
            logger.error(f"Error searching knowledge base: {e}")
            return []
    
    async def update_knowledge(
        self,
        entry_id: str,
        content: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Update an existing knowledge entry.
        
        Args:
            entry_id: ID of the entry to update
            content: New content (will regenerate embedding)
            metadata: New metadata
            
        Returns:
            True if successful, False otherwise
        """
        if not self.initialized:
            await self.initialize()
        
        try:
            # Get existing entry
            existing = self.collection.get(ids=[entry_id])
            
            if not existing or not existing['ids']:
                logger.warning(f"Entry {entry_id} not found")
                return False
            
            # Prepare update data
            update_data = {}
            
            if content:
                # Generate new embedding
                embedding = await self.embedding_service.generate_embedding(content)
                update_data['embeddings'] = [embedding]
                update_data['documents'] = [content]
            
            if metadata:
                # Merge with existing metadata
                existing_metadata = existing['metadatas'][0] if existing['metadatas'] else {}
                existing_metadata.update(metadata)
                update_data['metadatas'] = [existing_metadata]
            
            # Update in ChromaDB
            self.collection.update(
                ids=[entry_id],
                **update_data
            )
            
            logger.info(f"Updated knowledge entry: {entry_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating knowledge: {e}")
            return False
    
    async def delete_knowledge(self, entry_id: str) -> bool:
        """
        Delete a knowledge entry.
        
        Args:
            entry_id: ID of the entry to delete
            
        Returns:
            True if successful, False otherwise
        """
        if not self.initialized:
            await self.initialize()
        
        try:
            self.collection.delete(ids=[entry_id])
            logger.info(f"Deleted knowledge entry: {entry_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting knowledge: {e}")
            return False
    
    async def bulk_import(self, documents: List[Document]) -> int:
        """
        Import multiple documents at once.
        
        Args:
            documents: List of Document objects to import
            
        Returns:
            Number of documents successfully imported
        """
        if not self.initialized:
            await self.initialize()
        
        count = 0
        for doc in documents:
            try:
                metadata = doc.metadata.copy()
                metadata['category'] = doc.category.value
                
                await self.add_knowledge(
                    content=doc.content,
                    metadata=metadata
                )
                count += 1
                
            except Exception as e:
                logger.error(f"Error importing document: {e}")
                continue
        
        logger.info(f"Bulk imported {count}/{len(documents)} documents")
        return count
    
    async def get_by_category(self, category: str, limit: int = 100) -> List[KnowledgeEntry]:
        """
        Get all entries in a specific category.
        
        Args:
            category: Category to filter by
            limit: Maximum number of results
            
        Returns:
            List of knowledge entries
        """
        if not self.initialized:
            await self.initialize()
        
        try:
            results = self.collection.get(
                where={"category": category},
                limit=limit
            )
            
            entries = []
            if results and results['ids']:
                for i in range(len(results['ids'])):
                    entry = KnowledgeEntry(
                        id=results['ids'][i],
                        content=results['documents'][i],
                        category=KnowledgeCategory(results['metadatas'][i].get('category', 'maintenance')),
                        metadata=results['metadatas'][i],
                        source=results['metadatas'][i].get('source', 'unknown'),
                        verified=results['metadatas'][i].get('verified', False)
                    )
                    entries.append(entry)
            
            return entries
            
        except Exception as e:
            logger.error(f"Error getting entries by category: {e}")
            return []
    
    async def get_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the knowledge base.
        
        Returns:
            Dictionary with statistics
        """
        if not self.initialized:
            await self.initialize()
        
        try:
            total_count = self.collection.count()
            
            # Count by category
            category_counts = {}
            for category in KnowledgeCategory:
                results = self.collection.get(
                    where={"category": category.value},
                    limit=1
                )
                # Note: ChromaDB doesn't have a direct count with filter, so we get all and count
                all_in_category = self.collection.get(
                    where={"category": category.value}
                )
                category_counts[category.value] = len(all_in_category['ids']) if all_in_category['ids'] else 0
            
            return {
                'total_entries': total_count,
                'by_category': category_counts,
                'collection_name': settings.CHROMA_COLLECTION_NAME
            }
            
        except Exception as e:
            logger.error(f"Error getting knowledge base stats: {e}")
            return {'total_entries': 0, 'by_category': {}}
    
    def persist(self):
        """Persist the knowledge base to disk"""
        if self.client:
            try:
                self.client.persist()
                logger.info("Knowledge base persisted to disk")
            except Exception as e:
                logger.error(f"Error persisting knowledge base: {e}")
