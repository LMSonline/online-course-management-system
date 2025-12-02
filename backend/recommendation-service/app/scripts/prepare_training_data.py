"""
Prepare training data from interaction events.

Usage:
    python -m app.scripts.prepare_training_data --output data/training_data.csv

This script:
- Reads events from user_course_events table
- Builds dataset suitable for 2-tower training
- Saves to CSV/Parquet for use by train_two_tower.py
"""

from __future__ import annotations

import asyncio
import csv
import os
import sys
from pathlib import Path
from typing import List

import asyncpg

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))


def build_rs_db_dsn() -> str:
    """Build Postgres DSN from env vars."""
    host = os.getenv("RS_DB_HOST") or os.getenv("LMS_DB_HOST", "localhost")
    port = os.getenv("RS_DB_PORT") or os.getenv("LMS_DB_PORT", "5432")
    name = os.getenv("RS_DB_NAME") or os.getenv("LMS_DB_NAME", "lms")
    user = os.getenv("RS_DB_USER") or os.getenv("LMS_DB_USER", "postgres")
    password = os.getenv("RS_DB_PASSWORD") or os.getenv("LMS_DB_PASSWORD", "postgres")
    return f"postgresql://{user}:{password}@{host}:{port}/{name}"


async def fetch_interactions(dsn: str, event_types: List[str] | None = None) -> List[dict]:
    """Fetch interaction events from Postgres."""
    conn = await asyncpg.connect(dsn)
    try:
        sql = """
        SELECT user_id, course_id, event_type, timestamp
        FROM user_course_events
        """
        if event_types:
            placeholders = ",".join(f"${i+1}" for i in range(len(event_types)))
            sql += f" WHERE event_type IN ({placeholders})"
        sql += " ORDER BY timestamp DESC"
        
        if event_types:
            rows = await conn.fetch(sql, *event_types)
        else:
            rows = await conn.fetch(sql)
    finally:
        await conn.close()

    return [
        {
            "user_id": row["user_id"],
            "course_id": row["course_id"],
            "event_type": row["event_type"],
            "timestamp": row["timestamp"].isoformat() if row["timestamp"] else None,
        }
        for row in rows
    ]


async def async_main(output_path: str = "data/training_data.csv") -> None:
    """Main function."""
    dsn = build_rs_db_dsn()
    print(f"Fetching interactions from database...")

    # Fetch interactions (use all event types for now)
    interactions = await fetch_interactions(dsn, event_types=["view", "click", "enroll"])

    if not interactions:
        print("No interactions found.")
        return

    print(f"Found {len(interactions)} interactions")

    # Write to CSV
    output_file = Path(output_path)
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with open(output_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f, fieldnames=["user_id", "course_id", "event_type", "timestamp"]
        )
        writer.writeheader()
        writer.writerows(interactions)

    print(f"Saved {len(interactions)} interactions to {output_file}")


def main() -> None:
    """CLI entry point."""
    import sys

    output_path = sys.argv[1] if len(sys.argv) > 1 else "data/training_data.csv"
    asyncio.run(async_main(output_path))


if __name__ == "__main__":
    main()

