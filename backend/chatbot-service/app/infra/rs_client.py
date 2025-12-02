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

    async def get_home_recommendations(self, user_id: str) -> List[Course]:
        url = f"{self.base_url}/api/v1/recommendations/home"
        async with httpx.AsyncClient() as client:
            resp = await client.get(url, params={"user_id": user_id}, timeout=10.0)
        resp.raise_for_status()
        data = resp.json()
        return [Course(**c) for c in data]