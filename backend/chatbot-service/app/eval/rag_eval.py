"""
RAG evaluation script.

Usage:
    python -m app.eval.rag_eval

This script:
- Loads test questions from app/eval/rag_eval_dataset.json
- Runs retrieval (vector/hybrid search) for each question
- Computes metrics: Recall@k, MRR (Mean Reciprocal Rank)
- Prints a report and optionally saves to reports/rag_eval.json
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path
from typing import List, Optional

# Add parent directory to path so we can import app modules
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.infra.vector_store import VectorStore
from app.services.retrieval_service import RetrievalParams, RetrievalService
from app.api.deps import get_vector_store


def load_eval_dataset() -> List[dict]:
    """Load evaluation dataset from JSON file."""
    dataset_path = Path(__file__).parent / "rag_eval_dataset.json"
    if not dataset_path.exists():
        print(f"Warning: {dataset_path} not found. Using empty dataset.")
        return []
    with open(dataset_path, "r", encoding="utf-8") as f:
        return json.load(f)


async def compute_recall_at_k(
    retrieved_doc_ids: List[str],
    expected_doc_id: Optional[str],
    k: int,
) -> float:
    """
    Compute Recall@k: whether expected doc is in top-k retrieved.

    Returns 1.0 if found, 0.0 otherwise.
    """
    if expected_doc_id is None:
        return 0.0  # Can't evaluate if no expected doc
    top_k_ids = retrieved_doc_ids[:k]
    return 1.0 if expected_doc_id in top_k_ids else 0.0


async def compute_mrr(
    retrieved_doc_ids: List[str],
    expected_doc_id: Optional[str],
) -> float:
    """
    Compute MRR (Mean Reciprocal Rank): 1/rank of first expected doc, or 0.

    Returns 1/rank if found, 0.0 otherwise.
    """
    if expected_doc_id is None:
        return 0.0
    try:
        rank = retrieved_doc_ids.index(expected_doc_id) + 1  # 1-indexed
        return 1.0 / rank
    except ValueError:
        return 0.0


async def run_eval(
    vector_store: VectorStore,
    dataset: List[dict],
    top_k: int = 5,
) -> dict:
    """
    Run evaluation on the dataset.

    Returns a dict with metrics and per-question results.
    """
    retrieval_service = RetrievalService(store=vector_store)

    results = []
    recall_scores = []
    mrr_scores = []

    for item in dataset:
        question = item["question"]
        expected_course_id = item["expected_course_id"]
        expected_doc_id = item.get("expected_doc_id")

        # Run retrieval
        params = RetrievalParams(course_ids=[expected_course_id], top_k=top_k)
        docs = await retrieval_service.retrieve(question=question, params=params)
        retrieved_doc_ids = [d.id for d in docs]

        # Compute metrics
        recall = await compute_recall_at_k(retrieved_doc_ids, expected_doc_id, k=top_k)
        mrr = await compute_mrr(retrieved_doc_ids, expected_doc_id)

        recall_scores.append(recall)
        mrr_scores.append(mrr)

        results.append(
            {
                "question": question,
                "expected_course_id": expected_course_id,
                "expected_doc_id": expected_doc_id,
                "retrieved_doc_ids": retrieved_doc_ids,
                "recall@k": recall,
                "mrr": mrr,
            }
        )

    avg_recall = sum(recall_scores) / len(recall_scores) if recall_scores else 0.0
    avg_mrr = sum(mrr_scores) / len(mrr_scores) if mrr_scores else 0.0

    return {
        "metrics": {
            "recall@k": avg_recall,
            "mrr": avg_mrr,
            "num_questions": len(dataset),
        },
        "results": results,
    }


def print_report(eval_result: dict) -> None:
    """Print evaluation report to stdout."""
    metrics = eval_result["metrics"]
    print("\n" + "=" * 60)
    print("RAG Evaluation Report")
    print("=" * 60)
    print(f"Number of questions: {metrics['num_questions']}")
    print(f"Recall@{5}: {metrics['recall@k']:.3f}")
    print(f"MRR: {metrics['mrr']:.3f}")
    print("\nPer-question results:")
    print("-" * 60)
    for r in eval_result["results"]:
        print(f"\nQ: {r['question']}")
        print(f"  Expected doc: {r['expected_doc_id']}")
        print(f"  Retrieved: {r['retrieved_doc_ids']}")
        print(f"  Recall@{5}: {r['recall@k']:.3f}, MRR: {r['mrr']:.3f}")


async def async_main() -> None:
    """Main async entry point."""
    dataset = load_eval_dataset()
    if not dataset:
        print("No evaluation dataset found. Exiting.")
        return

    print(f"Loaded {len(dataset)} test questions.")
    print("Running retrieval evaluation...")

    vector_store = get_vector_store()
    eval_result = await run_eval(vector_store, dataset, top_k=5)

    print_report(eval_result)

    # Save report to file
    reports_dir = Path(__file__).parent.parent.parent / "reports"
    reports_dir.mkdir(exist_ok=True)
    report_path = reports_dir / "rag_eval.json"
    with open(report_path, "w", encoding="utf-8") as f:
        json.dump(eval_result, f, indent=2, ensure_ascii=False)
    print(f"\nReport saved to: {report_path}")


def main() -> None:
    """Entry point for the script."""
    import asyncio

    asyncio.run(async_main())


if __name__ == "__main__":
    main()

