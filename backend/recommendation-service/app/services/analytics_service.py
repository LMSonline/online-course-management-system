"""Analytics service for recommendation system."""

from typing import Dict, List, Any
from datetime import datetime, timedelta
import asyncpg
from app.core.settings import settings


class AnalyticsService:
    """Service for computing recommendation analytics and statistics."""

    def __init__(self):
        self._dsn = self._build_dsn()

    def _build_dsn(self) -> str:
        """Build PostgreSQL connection string."""
        db_host = settings.RS_DB_HOST or settings.LMS_DB_HOST
        db_port = settings.RS_DB_PORT or settings.LMS_DB_PORT
        db_name = settings.RS_DB_NAME or settings.LMS_DB_NAME
        db_user = settings.RS_DB_USER or settings.LMS_DB_USER
        db_password = settings.RS_DB_PASSWORD or settings.LMS_DB_PASSWORD
        return f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

    async def get_user_stats(self, user_id: str) -> Dict[str, Any]:
        """
        Get statistics for a specific user.
        
        Returns:
            Dictionary with:
            - num_recommendations: Total recommendations shown
            - num_clicks: Total clicks on recommendations
            - num_enrolls: Total enrollments from recommendations
            - ctr: Click-through rate
            - top_categories: Most recommended categories
        """
        try:
            conn = await asyncpg.connect(self._dsn)
            try:
                # Count recommendations
                rec_count = await conn.fetchval("""
                    SELECT COUNT(*) FROM user_course_events
                    WHERE user_id = $1 AND event_type = 'view' AND source IN ('home', 'chatbot')
                """, user_id)
                
                # Count clicks
                click_count = await conn.fetchval("""
                    SELECT COUNT(*) FROM user_course_events
                    WHERE user_id = $1 AND event_type = 'click' AND source IN ('home', 'chatbot')
                """, user_id)
                
                # Count enrolls
                enroll_count = await conn.fetchval("""
                    SELECT COUNT(*) FROM user_course_events
                    WHERE user_id = $1 AND event_type = 'enroll' AND source IN ('home', 'chatbot')
                """, user_id)
                
                # Calculate CTR
                ctr = (click_count / rec_count * 100) if rec_count > 0 else 0.0
                
                # Get top categories (simplified - would need course metadata)
                top_categories = []  # TODO: join with course table to get categories
                
                return {
                    "user_id": user_id,
                    "num_recommendations": rec_count or 0,
                    "num_clicks": click_count or 0,
                    "num_enrolls": enroll_count or 0,
                    "ctr": round(ctr, 2),
                    "top_categories": top_categories,
                }
            finally:
                await conn.close()
        except Exception:
            # Return empty stats if DB is not available
            return {
                "user_id": user_id,
                "num_recommendations": 0,
                "num_clicks": 0,
                "num_enrolls": 0,
                "ctr": 0.0,
                "top_categories": [],
            }

    async def get_global_stats(self) -> Dict[str, Any]:
        """
        Get global statistics across all users.
        
        Returns:
            Dictionary with:
            - global_ctr: Overall click-through rate
            - most_popular_courses: Most recommended courses
            - strategy_distribution: Distribution of strategies used
            - daily_stats: Time-series statistics
        """
        try:
            conn = await asyncpg.connect(self._dsn)
            try:
                # Global CTR
                total_views = await conn.fetchval("""
                    SELECT COUNT(*) FROM user_course_events
                    WHERE event_type = 'view' AND source IN ('home', 'chatbot')
                """)
                total_clicks = await conn.fetchval("""
                    SELECT COUNT(*) FROM user_course_events
                    WHERE event_type = 'click' AND source IN ('home', 'chatbot')
                """)
                global_ctr = (total_clicks / total_views * 100) if total_views and total_views > 0 else 0.0
                
                # Most popular courses (by recommendation count)
                popular_courses = await conn.fetch("""
                    SELECT course_id, COUNT(*) as rec_count
                    FROM user_course_events
                    WHERE event_type = 'view' AND source IN ('home', 'chatbot')
                    GROUP BY course_id
                    ORDER BY rec_count DESC
                    LIMIT 10
                """)
                
                # Strategy distribution
                strategy_dist = await conn.fetch("""
                    SELECT metadata->>'strategy' as strategy, COUNT(*) as count
                    FROM user_course_events
                    WHERE event_type = 'view' AND source IN ('home', 'chatbot')
                    GROUP BY metadata->>'strategy'
                """)
                
                # Daily stats (last 30 days)
                since = datetime.utcnow() - timedelta(days=30)
                daily_stats = await conn.fetch("""
                    SELECT 
                        DATE(timestamp) as date,
                        COUNT(*) FILTER (WHERE event_type = 'view') as views,
                        COUNT(*) FILTER (WHERE event_type = 'click') as clicks,
                        COUNT(*) FILTER (WHERE event_type = 'enroll') as enrolls
                    FROM user_course_events
                    WHERE timestamp >= $1 AND source IN ('home', 'chatbot')
                    GROUP BY DATE(timestamp)
                    ORDER BY date DESC
                """, since)
                
                return {
                    "global_ctr": round(global_ctr, 2),
                    "most_popular_courses": [
                        {"course_id": row["course_id"], "count": row["rec_count"]}
                        for row in popular_courses
                    ],
                    "strategy_distribution": [
                        {"strategy": row["strategy"] or "unknown", "count": row["count"]}
                        for row in strategy_dist
                    ],
                    "daily_stats": [
                        {
                            "date": row["date"].isoformat(),
                            "views": row["views"],
                            "clicks": row["clicks"],
                            "enrolls": row["enrolls"],
                        }
                        for row in daily_stats
                    ],
                }
            finally:
                await conn.close()
        except Exception:
            return {
                "global_ctr": 0.0,
                "most_popular_courses": [],
                "strategy_distribution": [],
                "daily_stats": [],
            }

