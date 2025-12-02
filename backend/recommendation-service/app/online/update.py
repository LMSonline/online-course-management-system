"""
Online learning service that updates recommender models based on interaction logs.

Consumes interaction logs (views, clicks, enrolls) and updates:
- Bandit policies
- Recommender weights
- Model parameters (future: incremental model updates)
"""

import asyncpg
from typing import Dict, List, Optional
from datetime import datetime, timedelta
from app.bandit.epsilon_greedy import EpsilonGreedyBandit
from app.core.settings import settings


class OnlineUpdateService:
    """
    Service for online learning updates.
    
    Periodically processes interaction logs and updates:
    - Bandit exploration/exploitation policies
    - Hybrid recommender weights
    - Other online learning parameters
    """

    def __init__(self, bandit: Optional[EpsilonGreedyBandit] = None):
        """
        Initialize online update service.
        
        Args:
            bandit: Optional bandit instance (if None, will load from file)
        """
        self.bandit = bandit
        self._dsn = self._build_dsn()
        self.bandit_file = f"{settings.RS_MODELS_DIR}/bandit_state.json"

    def _build_dsn(self) -> str:
        """Build PostgreSQL connection string."""
        db_host = settings.RS_DB_HOST or settings.LMS_DB_HOST
        db_port = settings.RS_DB_PORT or settings.LMS_DB_PORT
        db_name = settings.RS_DB_NAME or settings.LMS_DB_NAME
        db_user = settings.RS_DB_USER or settings.LMS_DB_USER
        db_password = settings.RS_DB_PASSWORD or settings.LMS_DB_PASSWORD
        return f"postgresql://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"

    async def load_bandit(self) -> EpsilonGreedyBandit:
        """Load bandit from file or create new one."""
        from pathlib import Path
        
        if Path(self.bandit_file).exists():
            try:
                return EpsilonGreedyBandit.load(self.bandit_file)
            except Exception:
                pass
        
        # Create new bandit with default arms
        return EpsilonGreedyBandit(
            arms=["two_tower", "popularity", "content", "hybrid"],
            epsilon=0.1,
        )

    async def update_from_interactions(
        self,
        hours: int = 24,
        min_interactions: int = 10,
    ) -> Dict[str, any]:
        """
        Update bandit and recommender parameters from recent interactions.
        
        Args:
            hours: Number of hours to look back
            min_interactions: Minimum interactions required to update
            
        Returns:
            Dictionary with update statistics
        """
        # Load or create bandit
        if not self.bandit:
            self.bandit = await self.load_bandit()
        
        # Fetch recent interactions
        interactions = await self._fetch_recent_interactions(hours)
        
        if len(interactions) < min_interactions:
            return {
                "status": "skipped",
                "reason": f"Not enough interactions ({len(interactions)} < {min_interactions})",
                "interactions_processed": len(interactions),
            }
        
        # Process interactions and update bandit
        updates = 0
        for interaction in interactions:
            strategy = interaction.get("strategy") or "hybrid"
            reward = self._compute_reward(interaction)
            
            if strategy in self.bandit.arms:
                self.bandit.update(strategy, reward)
                updates += 1
        
        # Save updated bandit
        self.bandit.save(self.bandit_file)
        
        return {
            "status": "success",
            "interactions_processed": len(interactions),
            "bandit_updates": updates,
            "bandit_stats": self.bandit.get_stats(),
        }

    async def _fetch_recent_interactions(
        self, hours: int
    ) -> List[Dict[str, any]]:
        """Fetch recent interactions from database."""
        try:
            conn = await asyncpg.connect(self._dsn)
            try:
                since = datetime.utcnow() - timedelta(hours=hours)
                rows = await conn.fetch("""
                    SELECT 
                        user_id,
                        course_id,
                        event_type,
                        source,
                        timestamp,
                        metadata
                    FROM user_course_events
                    WHERE timestamp >= $1
                    ORDER BY timestamp DESC
                    LIMIT 10000
                """, since)
                
                interactions = []
                for row in rows:
                    metadata = row.get("metadata") or {}
                    interactions.append({
                        "user_id": row["user_id"],
                        "course_id": row["course_id"],
                        "event_type": row["event_type"],
                        "source": row["source"],
                        "strategy": metadata.get("strategy"),  # Which recommender was used
                        "timestamp": row["timestamp"],
                    })
                
                return interactions
            finally:
                await conn.close()
        except Exception:
            # If DB is not available, return empty list
            return []

    def _compute_reward(self, interaction: Dict[str, any]) -> float:
        """
        Compute reward for an interaction.
        
        Higher rewards for more valuable interactions:
        - enroll > click > view
        """
        event_type = interaction.get("event_type", "").lower()
        
        if event_type == "enroll":
            return 1.0
        elif event_type == "click":
            return 0.5
        elif event_type == "view":
            return 0.1
        else:
            return 0.0

    async def get_bandit_recommendation(self) -> str:
        """
        Get recommended strategy from bandit.
        
        Returns:
            Strategy name to use for next recommendation
        """
        if not self.bandit:
            self.bandit = await self.load_bandit()
        
        return self.bandit.select_arm()

