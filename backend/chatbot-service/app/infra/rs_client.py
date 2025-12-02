import os
from typing import List
import httpx
from app.domain.models import Course


class RecommendationClient:
    """
    Client HTTP gọi Recommendation Service (RS).
    """

    def __init__(self, base_url: str | None = None):
        # Nếu chạy bằng docker-compose: base_url nên là http://rs-service:8002
        self.base_url = base_url or os.getenv("RS_BASE_URL", "http://localhost:8002")