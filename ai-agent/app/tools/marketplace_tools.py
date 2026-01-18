"""
Marketplace Tools - Gemini function definitions for interacting with the marketplace.
"""
from typing import List, Dict, Any, Optional
import logging

logger = logging.getLogger(__name__)

def search_products(query: str, category: Optional[str] = None, max_price: Optional[float] = None) -> List[Dict[str, Any]]:
    """
    Search for car parts or accessories in the marketplace.
    
    Args:
        query: What to look for (e.g. 'BMW oil filter')
        category: Optional category filter
        max_price: Optional maximum price filter
    """
    logger.info(f"Tool execution: search_products(query='{query}', category='{category}')")
    # This will be called by the agent loop. 
    # In a real implementation, this would call the ProductApiService.
    # For now, we return mock data that the LLM will use to respond.
    return [
        {"id": "p1", "name": f"{query} Premium", "price": 45.0, "rating": 4.8, "in_stock": True},
        {"id": "p2", "name": f"{query} Standard", "price": 25.0, "rating": 4.2, "in_stock": True}
    ]

def search_services(query: str, location: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Search for car services or mechanics nearby.
    
    Args:
        query: Type of service (e.g. 'brake repair')
        location: Optional location name or coordinates
    """
    logger.info(f"Tool execution: search_services(query='{query}', location='{location}')")
    return [
        {"id": "s1", "name": "Expert Auto Care", "service": query, "location": location or "Downtown", "availability": "Today"},
        {"id": "s2", "name": "Mobile Mechanic Pros", "service": query, "location": "Mobile / Home", "availability": "Tomorrow"}
    ]

# Tool Definitions for Gemini
MARKETPLACE_TOOLS = [
    {
        "function_declarations": [
            {
                "name": "search_products",
                "description": "Search for car parts, components, and accessories in the marketplace.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "The search term for the product."},
                        "category": {"type": "string", "description": "Optional category of the product."},
                        "max_price": {"type": "number", "description": "Optional maximum price filter."}
                    },
                    "required": ["query"]
                }
            },
            {
                "name": "search_services",
                "description": "Find mechanics, repair shops, and car services.",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "query": {"type": "string", "description": "The type of service required."},
                        "location": {"type": "string", "description": "Preferred location for the service."}
                    },
                    "required": ["query"]
                }
            }
        ]
    }
]

# Mapping names to actual functions for execution
TOOL_FUNCTIONS = {
    "search_products": search_products,
    "search_services": search_services
}
