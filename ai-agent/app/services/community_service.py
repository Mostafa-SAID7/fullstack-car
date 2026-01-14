import logging
import httpx
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from app.core.config import settings
from app.services.knowledge_base import KnowledgeBase
from app.models.schemas import KnowledgeCategory

logger = logging.getLogger(__name__)

class CommunityService:
    """
    Service for integrating with community features (groups, events, QA, posts, members).
    """
    
    def __init__(self, knowledge_base: Optional[KnowledgeBase] = None):
        """
        Initialize CommunityService.
        
        Args:
            knowledge_base: Optional KnowledgeBase instance for QA search
        """
        self.backend_url = settings.BACKEND_API_URL
        self.api_key = settings.BACKEND_API_KEY
        self.knowledge_base = knowledge_base
        self.timeout = 10.0
    
    def _get_headers(self) -> Dict[str, str]:
        """Get HTTP headers for backend API requests."""
        headers = {"Content-Type": "application/json"}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        return headers
    
    async def get_user_profile(self, user_id: str) -> Optional[Dict]:
        """
        Retrieve user profile from backend API.
        
        Args:
            user_id: User ID to retrieve
            
        Returns:
            User profile dictionary or None if not found
        """
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.backend_url}/api/users/{user_id}",
                    headers=self._get_headers()
                )
                
                if response.status_code == 200:
                    return response.json()
                elif response.status_code == 404:
                    logger.warning(f"User {user_id} not found")
                    return None
                else:
                    logger.error(f"Error fetching user profile: {response.status_code}")
                    return None
                    
        except httpx.TimeoutException:
            logger.error(f"Timeout fetching user profile for {user_id}")
            return None
        except Exception as e:
            logger.error(f"Error fetching user profile: {e}")
            return None
    
    async def recommend_groups(
        self, 
        user_id: str, 
        car_interests: Optional[List[str]] = None,
        limit: int = 5
    ) -> List[Dict]:
        """
        Recommend groups based on user's car interests.
        
        Args:
            user_id: User ID
            car_interests: List of car makes/models user is interested in
            limit: Maximum number of recommendations
            
        Returns:
            List of recommended group dictionaries
        """
        try:
            # If no interests provided, try to get from user profile
            if not car_interests:
                profile = await self.get_user_profile(user_id)
                if profile:
                    car_interests = profile.get('car_interests', [])
            
            # Build query parameters
            params = {"limit": limit}
            if car_interests:
                params["interests"] = ",".join(car_interests)
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.backend_url}/api/groups/recommendations",
                    params=params,
                    headers=self._get_headers()
                )
                
                if response.status_code == 200:
                    return response.json().get('groups', [])
                else:
                    logger.error(f"Error fetching group recommendations: {response.status_code}")
                    return []
                    
        except Exception as e:
            logger.error(f"Error recommending groups: {e}")
            return []
    
    async def suggest_events(
        self,
        user_location: Optional[Dict[str, float]] = None,
        radius_km: int = 50,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        limit: int = 10
    ) -> List[Dict]:
        """
        Suggest events within specified radius and date range.
        
        Args:
            user_location: Dictionary with 'latitude' and 'longitude'
            radius_km: Search radius in kilometers (default 50km)
            start_date: Start date for event search
            end_date: End date for event search
            limit: Maximum number of events
            
        Returns:
            List of event dictionaries
        """
        try:
            params = {
                "limit": limit,
                "radius_km": radius_km
            }
            
            if user_location:
                params["latitude"] = user_location.get('latitude')
                params["longitude"] = user_location.get('longitude')
            
            if start_date:
                params["start_date"] = start_date.isoformat()
            
            if end_date:
                params["end_date"] = end_date.isoformat()
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.backend_url}/api/events/nearby",
                    params=params,
                    headers=self._get_headers()
                )
                
                if response.status_code == 200:
                    return response.json().get('events', [])
                else:
                    logger.error(f"Error fetching events: {response.status_code}")
                    return []
                    
        except Exception as e:
            logger.error(f"Error suggesting events: {e}")
            return []
    
    def search_qa(
        self,
        question: str,
        similarity_threshold: float = 0.7,
        limit: int = 5
    ) -> List[Dict]:
        """
        Search existing QA answers before asking new question.
        
        Args:
            question: Question to search for
            similarity_threshold: Minimum similarity score (0.7 = 70%)
            limit: Maximum number of results
            
        Returns:
            List of QA entries with answers
        """
        if not self.knowledge_base:
            logger.warning("KnowledgeBase not available for QA search")
            return []
        
        try:
            # Search knowledge base for similar questions
            results = self.knowledge_base.search(
                query=question,
                category=KnowledgeCategory.COMMUNITY_HELP,
                limit=limit
            )
            
            # Filter by similarity threshold
            qa_results = []
            for entry in results:
                if entry.score and entry.score >= similarity_threshold:
                    qa_results.append({
                        "question": entry.metadata.get('question', ''),
                        "answer": entry.content,
                        "similarity": entry.score,
                        "source": entry.source,
                        "verified": entry.verified
                    })
            
            return qa_results
            
        except Exception as e:
            logger.error(f"Error searching QA: {e}")
            return []
    
    def create_post_helper(
        self,
        post_content: str,
        post_type: str = "general"
    ) -> Dict:
        """
        Suggest tags, format, and optimal posting time for a post.
        
        Args:
            post_content: Content of the post
            post_type: Type of post (general, question, showcase, event)
            
        Returns:
            Dictionary with suggestions
        """
        try:
            # Extract potential tags from content (simple keyword extraction)
            tags = self._extract_tags(post_content)
            
            # Suggest format improvements
            format_suggestions = self._suggest_format(post_content, post_type)
            
            # Suggest optimal posting time (based on community activity patterns)
            optimal_time = self._suggest_posting_time()
            
            return {
                "suggested_tags": tags[:5],  # Top 5 tags
                "format_suggestions": format_suggestions,
                "optimal_posting_time": optimal_time,
                "character_count": len(post_content),
                "estimated_read_time": max(1, len(post_content.split()) // 200)  # minutes
            }
            
        except Exception as e:
            logger.error(f"Error creating post helper: {e}")
            return {
                "suggested_tags": [],
                "format_suggestions": [],
                "optimal_posting_time": None
            }
    
    def _extract_tags(self, content: str) -> List[str]:
        """Extract relevant tags from post content."""
        # Common automotive keywords
        automotive_keywords = [
            "maintenance", "repair", "modification", "performance", "engine",
            "transmission", "suspension", "brakes", "tires", "oil", "battery",
            "electrical", "bodywork", "paint", "interior", "audio", "navigation",
            "safety", "insurance", "buying", "selling", "trade", "financing",
            "warranty", "recall", "diagnostic", "troubleshooting", "diy",
            "mechanic", "dealership", "parts", "accessories", "upgrade"
        ]
        
        content_lower = content.lower()
        found_tags = []
        
        for keyword in automotive_keywords:
            if keyword in content_lower:
                found_tags.append(keyword)
        
        # Also extract car makes if mentioned (simplified)
        common_makes = [
            "toyota", "honda", "ford", "chevrolet", "nissan", "bmw", "mercedes",
            "audi", "volkswagen", "hyundai", "kia", "mazda", "subaru", "lexus"
        ]
        
        for make in common_makes:
            if make in content_lower:
                found_tags.append(make)
        
        return found_tags
    
    def _suggest_format(self, content: str, post_type: str) -> List[str]:
        """Suggest format improvements for post."""
        suggestions = []
        
        # Check length
        if len(content) < 50:
            suggestions.append("Consider adding more details to help community members understand your post better")
        
        # Check for questions
        if post_type == "question" and "?" not in content:
            suggestions.append("Add a clear question mark to make your question more obvious")
        
        # Check for paragraphs
        if len(content) > 300 and "\n" not in content:
            suggestions.append("Break your post into paragraphs for better readability")
        
        # Check for car details
        car_keywords = ["year", "make", "model", "mileage"]
        has_car_details = any(keyword in content.lower() for keyword in car_keywords)
        
        if not has_car_details and post_type in ["question", "showcase"]:
            suggestions.append("Include your car's year, make, and model for more relevant responses")
        
        return suggestions
    
    def _suggest_posting_time(self) -> Dict:
        """Suggest optimal posting time based on community activity."""
        now = datetime.now()
        
        # Peak activity times (simplified - would be based on actual analytics)
        # Weekdays: 7-9 AM, 12-1 PM, 6-9 PM
        # Weekends: 10 AM - 8 PM
        
        current_hour = now.hour
        is_weekend = now.weekday() >= 5
        
        if is_weekend:
            if 10 <= current_hour <= 20:
                return {
                    "is_optimal": True,
                    "message": "Great time to post! Weekend activity is high."
                }
            else:
                optimal_time = now.replace(hour=10, minute=0, second=0, microsecond=0)
                if current_hour > 20:
                    optimal_time += timedelta(days=1)
                return {
                    "is_optimal": False,
                    "message": "Consider posting during weekend peak hours (10 AM - 8 PM)",
                    "suggested_time": optimal_time.isoformat()
                }
        else:
            if (7 <= current_hour <= 9) or (12 <= current_hour <= 13) or (18 <= current_hour <= 21):
                return {
                    "is_optimal": True,
                    "message": "Great time to post! Weekday peak activity."
                }
            else:
                # Suggest next peak time
                if current_hour < 7:
                    optimal_time = now.replace(hour=7, minute=0, second=0, microsecond=0)
                elif current_hour < 12:
                    optimal_time = now.replace(hour=12, minute=0, second=0, microsecond=0)
                else:
                    optimal_time = now.replace(hour=18, minute=0, second=0, microsecond=0)
                    if current_hour >= 21:
                        optimal_time += timedelta(days=1)
                        optimal_time = optimal_time.replace(hour=7)
                
                return {
                    "is_optimal": False,
                    "message": "Consider posting during peak hours (7-9 AM, 12-1 PM, 6-9 PM)",
                    "suggested_time": optimal_time.isoformat()
                }
    
    async def search_members(
        self,
        expertise: Optional[str] = None,
        car_specialty: Optional[str] = None,
        location: Optional[str] = None,
        limit: int = 10
    ) -> List[Dict]:
        """
        Find community members by expertise.
        
        Args:
            expertise: Type of expertise (mechanic, modification, buying, selling)
            car_specialty: Specific car make/model specialty
            location: Location to search near
            limit: Maximum number of results
            
        Returns:
            List of member profiles
        """
        try:
            params = {"limit": limit}
            
            if expertise:
                params["expertise"] = expertise
            
            if car_specialty:
                params["car_specialty"] = car_specialty
            
            if location:
                params["location"] = location
            
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(
                    f"{self.backend_url}/api/members/search",
                    params=params,
                    headers=self._get_headers()
                )
                
                if response.status_code == 200:
                    return response.json().get('members', [])
                else:
                    logger.error(f"Error searching members: {response.status_code}")
                    return []
                    
        except Exception as e:
            logger.error(f"Error searching members: {e}")
            return []
