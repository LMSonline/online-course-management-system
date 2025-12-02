"""
Evaluation metrics for recommendation systems.

Implements:
- Recall@K
- Precision@K
- NDCG@K (Normalized Discounted Cumulative Gain)
"""

from __future__ import annotations

from typing import List, Set
import numpy as np


def recall_at_k(recommended: List[str], relevant: Set[str], k: int) -> float:
    """
    Compute Recall@K: fraction of relevant items found in top-K recommendations.

    Args:
        recommended: List of recommended item IDs (ordered by score)
        relevant: Set of relevant item IDs (ground truth)
        k: Top-K to consider

    Returns:
        Recall@K score (0.0 to 1.0)
    """
    if not relevant:
        return 0.0

    top_k = recommended[:k]
    num_relevant_found = len(set(top_k) & relevant)
    return num_relevant_found / len(relevant)


def precision_at_k(recommended: List[str], relevant: Set[str], k: int) -> float:
    """
    Compute Precision@K: fraction of top-K recommendations that are relevant.

    Args:
        recommended: List of recommended item IDs (ordered by score)
        relevant: Set of relevant item IDs (ground truth)
        k: Top-K to consider

    Returns:
        Precision@K score (0.0 to 1.0)
    """
    if k == 0:
        return 0.0

    top_k = recommended[:k]
    num_relevant_found = len(set(top_k) & relevant)
    return num_relevant_found / k


def ndcg_at_k(recommended: List[str], relevant: Set[str], k: int) -> float:
    """
    Compute NDCG@K (Normalized Discounted Cumulative Gain).

    NDCG measures ranking quality by giving higher weight to relevant items
    that appear earlier in the recommendation list.

    Args:
        recommended: List of recommended item IDs (ordered by score)
        relevant: Set of relevant item IDs (ground truth)
        k: Top-K to consider

    Returns:
        NDCG@K score (0.0 to 1.0)
    """
    if not relevant:
        return 0.0

    top_k = recommended[:k]
    dcg = 0.0
    for i, item in enumerate(top_k):
        if item in relevant:
            # DCG: relevance / log2(rank + 1)
            # Here relevance is 1 if item is relevant
            dcg += 1.0 / np.log2(i + 2)  # i+2 because rank starts at 1

    # Ideal DCG: all relevant items at the top
    ideal_dcg = 0.0
    num_relevant = len(relevant)
    for i in range(min(k, num_relevant)):
        ideal_dcg += 1.0 / np.log2(i + 2)

    if ideal_dcg == 0:
        return 0.0

    return dcg / ideal_dcg


def compute_all_metrics(
    recommended: List[str], relevant: Set[str], k: int = 5
) -> dict:
    """
    Compute all metrics (Recall@K, Precision@K, NDCG@K) at once.

    Returns:
        Dict with keys: recall, precision, ndcg
    """
    return {
        "recall@k": recall_at_k(recommended, relevant, k),
        "precision@k": precision_at_k(recommended, relevant, k),
        "ndcg@k": ndcg_at_k(recommended, relevant, k),
    }

