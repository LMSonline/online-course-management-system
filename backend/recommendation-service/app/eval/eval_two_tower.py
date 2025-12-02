"""
Evaluation script for two-tower recommendation model.

Usage:
    python -m app.eval.eval_two_tower

This script:
- Loads a held-out test set of interactions
- Generates top-K recommendations for each user
- Computes metrics: Recall@K, Precision@K, NDCG@K
- Prints summary table and optionally saves chart
"""

from __future__ import annotations

import asyncio
import json
import os
import sys
from pathlib import Path
from typing import Dict, List, Set

import asyncpg

# Add parent to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.eval.metrics import compute_all_metrics
from app.infra.repositories import InMemoryCourseRepository
from app.services.recommendation_service import RecommendationService
from app.api.deps import get_recommendation_service


def build_rs_db_dsn() -> str:
    """Build Postgres DSN from env vars."""
    host = os.getenv("RS_DB_HOST") or os.getenv("LMS_DB_HOST", "localhost")
    port = os.getenv("RS_DB_PORT") or os.getenv("LMS_DB_PORT", "5432")
    name = os.getenv("RS_DB_NAME") or os.getenv("LMS_DB_NAME", "lms")
    user = os.getenv("RS_DB_USER") or os.getenv("LMS_DB_USER", "postgres")
    password = os.getenv("RS_DB_PASSWORD") or os.getenv("LMS_DB_PASSWORD", "postgres")
    return f"postgresql://{user}:{password}@{host}:{port}/{name}"


async def load_test_set(dsn: str, test_split: float = 0.2) -> Dict[str, Set[str]]:
    """
    Load test set of user-course interactions.

    Returns:
        Dict mapping user_id -> set of relevant course_ids
    """
    conn = await asyncpg.connect(dsn)
    try:
        # Get recent interactions as test set
        rows = await conn.fetch("""
            SELECT DISTINCT user_id, course_id
            FROM user_course_events
            WHERE event_type IN ('click', 'enroll')
            ORDER BY timestamp DESC
            LIMIT 1000
        """)
    finally:
        await conn.close()

    # Group by user
    user_relevant: Dict[str, Set[str]] = {}
    for row in rows:
        user_id = row["user_id"]
        course_id = row["course_id"]
        user_relevant.setdefault(user_id, set()).add(course_id)

    return user_relevant


async def async_main(k: int = 5) -> None:
    """Main evaluation function."""
    print("Loading test set...")
    dsn = build_rs_db_dsn()
    test_set = await load_test_set(dsn)

    if not test_set:
        print("No test data found. Exiting.")
        return

    print(f"Loaded test set with {len(test_set)} users")

    # Get recommendation service
    service = get_recommendation_service()

    # Evaluate for each user
    all_metrics = []
    results = []

    for user_id, relevant_courses in test_set.items():
        # Generate recommendations
        try:
            recommended_courses = await service.get_home_recommendations(
                user_id=user_id, top_k=k, explain=False
            )
            recommended_ids = [c.id for c in recommended_courses]
        except Exception as exc:
            print(f"Error generating recommendations for user {user_id}: {exc}")
            continue

        # Compute metrics
        metrics = compute_all_metrics(recommended_ids, relevant_courses, k=k)
        all_metrics.append(metrics)
        results.append(
            {
                "user_id": user_id,
                "recommended": recommended_ids,
                "relevant": list(relevant_courses),
                **metrics,
            }
        )

    if not all_metrics:
        print("No valid evaluations. Exiting.")
        return

    # Aggregate metrics
    avg_recall = sum(m["recall@k"] for m in all_metrics) / len(all_metrics)
    avg_precision = sum(m["precision@k"] for m in all_metrics) / len(all_metrics)
    avg_ndcg = sum(m["ndcg@k"] for m in all_metrics) / len(all_metrics)

    # Print report
    print("\n" + "=" * 60)
    print("Recommendation Evaluation Report")
    print("=" * 60)
    print(f"Number of users evaluated: {len(all_metrics)}")
    print(f"K (top-K): {k}")
    print(f"\nAverage Metrics:")
    print(f"  Recall@{k}: {avg_recall:.3f}")
    print(f"  Precision@{k}: {avg_precision:.3f}")
    print(f"  NDCG@{k}: {avg_ndcg:.3f}")

    # Save report
    reports_dir = Path(__file__).parent.parent.parent / "reports"
    reports_dir.mkdir(exist_ok=True)
    report_path = reports_dir / "rec_eval.json"

    report = {
        "k": k,
        "num_users": len(all_metrics),
        "average_metrics": {
            "recall@k": avg_recall,
            "precision@k": avg_precision,
            "ndcg@k": avg_ndcg,
        },
        "per_user_results": results,
    }

    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)

    print(f"\nReport saved to: {report_path}")


def main() -> None:
    """CLI entry point."""
    import sys

    k = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    asyncio.run(async_main(k=k))


if __name__ == "__main__":
    main()

