from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Tuple

import asyncpg


@dataclass
class InteractionEvent:
    """
    Single user-course interaction used for training.

    This assumes a table with schema roughly:
    - user_course_events(user_id TEXT, course_id TEXT, event_type TEXT, timestamp TIMESTAMPTZ)

    The exact table / column names can be configured via env vars in the
    training script if needed.
    """

    user_id: str
    course_id: str
    event_type: str


@dataclass
class PostgresInteractionLoader:
    """
    Minimal async loader that pulls interaction events from Postgres.

    This is used by the training script to build a dataset for the two-tower
    model. It intentionally lives in `infra` so it can be reused later by
    any online-learning or logging components.
    """

    dsn: str

    async def fetch_interactions(self, limit: int | None = None) -> List[InteractionEvent]:
        conn = await asyncpg.connect(self.dsn)
        try:
            sql = """
            SELECT user_id, course_id, event_type
            FROM user_course_events
            ORDER BY timestamp DESC
            """
            if limit is not None:
                sql += " LIMIT $1"
                rows = await conn.fetch(sql, limit)
            else:
                rows = await conn.fetch(sql)
        finally:
            await conn.close()

        return [
            InteractionEvent(
                user_id=row["user_id"],
                course_id=row["course_id"],
                event_type=row["event_type"],
            )
            for row in rows
        ]


def generate_training_triples(
    interactions: Iterable[InteractionEvent],
) -> List[Tuple[str, str, str]]:
    """
    Very small helper that turns raw events into (user, positive_course, negative_course) triples.

    Currently it only returns (user_id, course_id, "") i.e. no hard negatives,
    so the training script can decide how to sample negatives. This keeps the
    infra layer simple.
    """

    triples: List[Tuple[str, str, str]] = []
    for ev in interactions:
        triples.append((ev.user_id, ev.course_id, ""))
    return triples


