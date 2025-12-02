"""
Interaction logger: logs recommendation events to DB for training feedback loop.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import List, Optional

import asyncpg

from app.domain.models import Course


def build_rs_db_dsn() -> str:
    """Build Postgres DSN for RS service (can reuse LMS DB or use separate one)."""
    host = os.getenv("RS_DB_HOST") or os.getenv("LMS_DB_HOST", "localhost")
    port = os.getenv("RS_DB_PORT") or os.getenv("LMS_DB_PORT", "5432")
    name = os.getenv("RS_DB_NAME") or os.getenv("LMS_DB_NAME", "lms")
    user = os.getenv("RS_DB_USER") or os.getenv("LMS_DB_USER", "postgres")
    password = os.getenv("RS_DB_PASSWORD") or os.getenv("LMS_DB_PASSWORD", "postgres")
    return f"postgresql://{user}:{password}@{host}:{port}/{name}"


async def ensure_events_table(conn: asyncpg.Connection) -> None:
    """
    Create user_course_events table if it doesn't exist.

    This table stores interaction events for training the recommendation model.
    """
    await conn.execute("""
        CREATE TABLE IF NOT EXISTS user_course_events (
            id SERIAL PRIMARY KEY,
            user_id TEXT NOT NULL,
            course_id TEXT NOT NULL,
            event_type TEXT NOT NULL,
            source TEXT,
            timestamp TIMESTAMP NOT NULL DEFAULT NOW()
        )
    """)
    await conn.execute("""
        CREATE INDEX IF NOT EXISTS idx_user_course_events_user_id 
        ON user_course_events(user_id, timestamp DESC)
    """)


@dataclass
class InteractionLogger:
    """
    Log recommendation interactions to Postgres for training feedback loop.

    Events logged:
    - view: user viewed recommendations (home page, chatbot, etc.)
    - click: user clicked on a recommended course
    - enroll: user enrolled in a course from recommendation
    """

    dsn: Optional[str] = None
    _pool: Optional[asyncpg.Pool] = None

    async def _get_pool(self) -> asyncpg.Pool:
        """Lazy initialization of connection pool."""
        if self._pool is None:
            self.dsn = self.dsn or build_rs_db_dsn()
            self._pool = await asyncpg.create_pool(self.dsn, min_size=1, max_size=5)
            # Ensure table exists
            async with self._pool.acquire() as conn:
                await ensure_events_table(conn)
        return self._pool

    async def close(self) -> None:
        """Close the connection pool."""
        if self._pool:
            await self._pool.close()
            self._pool = None

    async def log_recommendations(
        self, user_id: str, courses: List[Course], source: str = "home"
    ) -> None:
        """
        Log that recommendations were shown to a user.

        Args:
            user_id: LMS user ID
            courses: List of recommended courses
            source: Where the recommendations came from (home, chatbot, etc.)
        """
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            for course in courses:
                await conn.execute(
                    """
                    INSERT INTO user_course_events (user_id, course_id, event_type, source)
                    VALUES ($1, $2, $3, $4)
                    """,
                    user_id,
                    course.id,
                    "view",
                    source,
                )

    async def log_click(self, user_id: str, course_id: str, source: str = "home") -> None:
        """Log that a user clicked on a recommended course."""
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO user_course_events (user_id, course_id, event_type, source)
                VALUES ($1, $2, $3, $4)
                """,
                user_id,
                course_id,
                "click",
                source,
            )

    async def log_enroll(
        self, user_id: str, course_id: str, source: str = "home"
    ) -> None:
        """Log that a user enrolled in a course from recommendation."""
        pool = await self._get_pool()
        async with pool.acquire() as conn:
            await conn.execute(
                """
                INSERT INTO user_course_events (user_id, course_id, event_type, source)
                VALUES ($1, $2, $3, $4)
                """,
                user_id,
                course_id,
                "enroll",
                source,
            )

    def log_similar_view(self, course_id: str, courses: List[Course]) -> None:
        """
        Log similar courses view (non-blocking, prints to stdout for now).

        TODO: Make this async and write to DB as well.
        """
        ids = [c.id for c in courses]
        print(f"[InteractionLogger] similar_for={course_id} results={ids}")

