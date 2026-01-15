"""
API dependencies for route handlers
"""
from fastapi import Request
from typing import Any

def ensure_services_initialized(request: Request) -> Any:
    """
    Dependency that ensures services are initialized before handling requests.
    Returns the app state with initialized services.
    """
    from main import get_services
    return get_services()
