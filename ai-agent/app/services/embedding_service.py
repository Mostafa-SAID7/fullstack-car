"""
Embedding generation service using SentenceTransformers.
"""
try:
    from sentence_transformers import SentenceTransformer
    SENTENCE_TRANSFORMERS_AVAILABLE = True
except ImportError:
    SENTENCE_TRANSFORMERS_AVAILABLE = False
    SentenceTransformer = None

from typing import List, Optional
import logging
import numpy as np

logger = logging.getLogger(__name__)

class EmbeddingService:
    """Service for generating text embeddings"""
    
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2'):
        """
        Initialize embedding service.
        
        Args:
            model_name: Name of the SentenceTransformer model to use
        """
        self.model_name = model_name
        self.model: Optional[any] = None
        
        if not SENTENCE_TRANSFORMERS_AVAILABLE:
            logger.warning("sentence-transformers not available. Using fallback embeddings.")
        else:
            self._initialize_model()
    
    def _initialize_model(self):
        """Initialize the embedding model"""
        if not SENTENCE_TRANSFORMERS_AVAILABLE:
            return
            
        try:
            self.model = SentenceTransformer(self.model_name)
            logger.info(f"Embedding model initialized: {self.model_name}")
        except Exception as e:
            logger.error(f"Error initializing embedding model: {e}")
            self.model = None
    
    def generate_embedding(self, text: str) -> List[float]:
        """
        Generate embedding for a single text.
        
        Args:
            text: Text to generate embedding for
            
        Returns:
            List of floats representing the embedding vector
        """
        if not SENTENCE_TRANSFORMERS_AVAILABLE or not self.model:
            # Return simple hash-based fallback embedding
            return self._fallback_embedding(text)
        
        try:
            # Generate embedding
            embedding = self.model.encode(text, convert_to_numpy=True)
            
            # Convert to list of floats
            return embedding.tolist()
            
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            return self._fallback_embedding(text)
    
    def _fallback_embedding(self, text: str) -> List[float]:
        """Generate a simple fallback embedding when model is not available"""
        # Simple hash-based embedding (384 dimensions to match all-MiniLM-L6-v2)
        import hashlib
        hash_obj = hashlib.sha256(text.encode())
        hash_bytes = hash_obj.digest()
        
        # Expand to 384 dimensions
        embedding = []
        for i in range(384):
            byte_val = hash_bytes[i % len(hash_bytes)]
            embedding.append((byte_val / 255.0) - 0.5)  # Normalize to [-0.5, 0.5]
        
        return embedding
    
    async def generate_embeddings_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts (more efficient).
        
        Args:
            texts: List of texts to generate embeddings for
            
        Returns:
            List of embedding vectors
        """
        if not self.model:
            self._initialize_model()
        
        try:
            # Generate embeddings in batch
            embeddings = self.model.encode(texts, convert_to_numpy=True, show_progress_bar=True)
            
            # Convert to list of lists
            return [emb.tolist() for emb in embeddings]
            
        except Exception as e:
            logger.error(f"Error generating batch embeddings: {e}")
            # Return zero vectors as fallback
            return [[0.0] * 384 for _ in texts]
    
    def calculate_similarity(self, embedding1: List[float], embedding2: List[float]) -> float:
        """
        Calculate cosine similarity between two embeddings.
        
        Args:
            embedding1: First embedding vector
            embedding2: Second embedding vector
            
        Returns:
            Similarity score between 0 and 1
        """
        try:
            # Convert to numpy arrays
            vec1 = np.array(embedding1)
            vec2 = np.array(embedding2)
            
            # Calculate cosine similarity
            dot_product = np.dot(vec1, vec2)
            norm1 = np.linalg.norm(vec1)
            norm2 = np.linalg.norm(vec2)
            
            if norm1 == 0 or norm2 == 0:
                return 0.0
            
            similarity = dot_product / (norm1 * norm2)
            
            # Normalize to 0-1 range
            return (similarity + 1) / 2
            
        except Exception as e:
            logger.error(f"Error calculating similarity: {e}")
            return 0.0
    
    def get_model_info(self) -> dict:
        """
        Get information about the embedding model.
        
        Returns:
            Dictionary with model information
        """
        if not self.model:
            return {
                'model_name': self.model_name,
                'status': 'not_initialized',
                'dimension': 384
            }
        
        return {
            'model_name': self.model_name,
            'status': 'initialized',
            'dimension': self.model.get_sentence_embedding_dimension(),
            'max_seq_length': self.model.max_seq_length
        }
