"""
Vector-based knowledge base for automotive information using ChromaDB.
"""
try:
    import chromadb
    from chromadb.config import Settings
    CHROMADB_AVAILABLE = True
except ImportError:
    CHROMADB_AVAILABLE = False
    chromadb = None
    Settings = None

import asyncio
from typing import List, Optional, Dict, Any
from app.core.config import settings
from app.models.schemas import KnowledgeEntry, KnowledgeCategory, Document
from app.services.embedding_service import EmbeddingService
import logging
import uuid

logger = logging.getLogger(__name__)

class KnowledgeBase:
    """Vector-based knowledge base for automotive information"""
    
    def __init__(self, embedding_service: Optional[EmbeddingService] = None):
        self.client: Optional[Any] = None
        self.collection = None
        self._embedding_service = embedding_service
        self.initialized = False
        
        if not CHROMADB_AVAILABLE:
            logger.warning("ChromaDB not available. Knowledge base will use fallback mode.")
    
    @property
    def embedding_service(self):
        """Lazy load embedding service"""
        if self._embedding_service is None:
            self._embedding_service = EmbeddingService()
        return self._embedding_service
    
    async def initialize(self):
        """Initialize ChromaDB client and collection"""
        if not CHROMADB_AVAILABLE:
            logger.warning("ChromaDB not installed. Knowledge base features disabled.")
            self.initialized = False
            return
            
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
    
    def add_knowledge(
        self, 
        content: str, 
        category: KnowledgeCategory,
        metadata: Optional[Dict[str, Any]] = None,
        source: str = "manual",
        entry_id: Optional[str] = None
    ) -> str:
        """
        Add knowledge entry with embedding.
        
        Args:
            content: The text content to store
            category: Knowledge category
            metadata: Optional metadata about the entry
            source: Source of the knowledge
            entry_id: Optional custom ID, will generate UUID if not provided
            
        Returns:
            The ID of the stored entry
        """
        if not CHROMADB_AVAILABLE or not self.initialized:
            logger.warning("Knowledge base not available. Entry not stored.")
            return str(uuid.uuid4())
        
        try:
            # Generate ID if not provided
            if not entry_id:
                entry_id = str(uuid.uuid4())
            
            # Prepare metadata
            full_metadata = metadata or {}
            full_metadata.update({
                "category": category.value if isinstance(category, KnowledgeCategory) else category,
                "source": source
            })
            
            # Generate embedding
            embedding = self.embedding_service.generate_embedding(content)
            
            # Store in ChromaDB
            self.collection.add(
                ids=[entry_id],
                embeddings=[embedding],
                documents=[content],
                metadatas=[full_metadata]
            )
            
            logger.info(f"Added knowledge entry: {entry_id}")
            return entry_id
            
        except Exception as e:
            logger.error(f"Error adding knowledge: {e}")
            raise
    
    async def search(
        self, 
        query: str, 
        category: Optional[KnowledgeCategory] = None,
        limit: int = 5,
        min_score: float = 0.7,
        use_cache: bool = True
    ) -> List[KnowledgeEntry]:
        """
        Search knowledge base using semantic similarity with caching.
        
        Args:
            query: Search query text
            category: Optional category filter
            limit: Maximum number of results
            min_score: Minimum similarity score (0-1)
            use_cache: Whether to use cached results
            
        Returns:
            List of relevant knowledge entries with scores
        """
        if not CHROMADB_AVAILABLE or not self.initialized:
            logger.warning("Knowledge base not available. Returning empty results.")
            return []
        
        try:
            # Check cache first
            if use_cache:
                from app.core.cache import cache_service
                import hashlib
                
                query_hash = hashlib.sha256(query.lower().encode()).hexdigest()
                cat_value = category.value if category and isinstance(category, KnowledgeCategory) else category
                
                cached_results = await cache_service.get_knowledge_search(
                    query_hash,
                    cat_value
                )
                
                if cached_results:
                    logger.info(f"Returning cached search results for '{query}'")
                    # Convert cached dicts back to KnowledgeEntry objects
                    return [
                        KnowledgeEntry(**entry) for entry in cached_results
                    ]
            
            # Generate query embedding
            query_embedding = self.embedding_service.generate_embedding(query)
            
            # Build where filter for category
            where_filter = None
            if category:
                cat_value = category.value if isinstance(category, KnowledgeCategory) else category
                where_filter = {"category": cat_value}
            
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
            
            # Cache the results
            if use_cache and entries:
                from app.core.cache import cache_service
                import hashlib
                
                query_hash = hashlib.sha256(query.lower().encode()).hexdigest()
                cat_value = category.value if category and isinstance(category, KnowledgeCategory) else category
                
                # Convert entries to dicts for caching
                cached_data = [entry.dict() for entry in entries]
                await cache_service.set_knowledge_search(
                    query_hash,
                    cached_data,
                    cat_value
                )
            
            logger.info(f"Search for '{query}' returned {len(entries)} results")
            return entries
            
        except Exception as e:
            logger.error(f"Error searching knowledge base: {e}")
            return []
    
    def update_knowledge(
        self,
        entry_id: str,
        content: Optional[str] = None,
        category: Optional[KnowledgeCategory] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> bool:
        """
        Update an existing knowledge entry.
        
        Args:
            entry_id: ID of the entry to update
            content: New content (will regenerate embedding)
            category: New category
            metadata: New metadata
            
        Returns:
            True if successful, False otherwise
        """
        if not CHROMADB_AVAILABLE or not self.initialized:
            logger.warning("Knowledge base not available. Update skipped.")
            return False
        
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
                embedding = self.embedding_service.generate_embedding(content)
                update_data['embeddings'] = [embedding]
                update_data['documents'] = [content]
            
            if metadata or category:
                # Merge with existing metadata
                existing_metadata = existing['metadatas'][0] if existing['metadatas'] else {}
                if metadata:
                    existing_metadata.update(metadata)
                if category:
                    existing_metadata['category'] = category.value if isinstance(category, KnowledgeCategory) else category
                update_data['metadatas'] = [existing_metadata]
            
            # Update in ChromaDB
            self.collection.update(
                ids=[entry_id],
                **update_data
            )
            
            # Invalidate knowledge search caches
            asyncio.create_task(self._invalidate_knowledge_caches(category))
            
            logger.info(f"Updated knowledge entry: {entry_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error updating knowledge: {e}")
            return False
    
    def delete_knowledge(self, entry_id: str) -> bool:
        """
        Delete a knowledge entry.
        
        Args:
            entry_id: ID of the entry to delete
            
        Returns:
            True if successful, False otherwise
        """
        if not CHROMADB_AVAILABLE or not self.initialized:
            logger.warning("Knowledge base not available. Delete skipped.")
            return False
        
        try:
            self.collection.delete(ids=[entry_id])
            
            # Invalidate knowledge search caches
            asyncio.create_task(self._invalidate_knowledge_caches())
            
            logger.info(f"Deleted knowledge entry: {entry_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting knowledge: {e}")
            return False
    
    async def _invalidate_knowledge_caches(self, category: Optional[KnowledgeCategory] = None):
        """Invalidate knowledge search caches after updates"""
        try:
            from app.core.cache import cache_service
            cat_value = category.value if category and isinstance(category, KnowledgeCategory) else None
            await cache_service.invalidate_knowledge_searches(cat_value)
            logger.debug(f"Invalidated knowledge search caches for category: {cat_value}")
        except Exception as e:
            logger.error(f"Error invalidating knowledge caches: {e}")
    
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
                metadata = doc.metadata.copy() if doc.metadata else {}
                
                await self.add_knowledge(
                    content=doc.content,
                    category=doc.category,
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
    
    def get_stats(self) -> Dict[str, Any]:
        """
        Get statistics about the knowledge base.
        
        Returns:
            Dictionary with statistics
        """
        if not CHROMADB_AVAILABLE or not self.initialized:
            return {
                "total_entries": 0,
                "categories": {},
                "status": "unavailable"
            }
        
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
