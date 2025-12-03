"""
Epsilon-greedy multi-armed bandit implementation.

Used for online learning and A/B testing of different recommender strategies.
"""

from typing import Dict, List, Optional
import random
import json
from pathlib import Path


class EpsilonGreedyBandit:
    """
    Epsilon-greedy bandit for selecting recommender strategies.
    
    With probability epsilon, explores (random selection).
    With probability 1-epsilon, exploits (selects best performing arm).
    """

    def __init__(
        self,
        arms: List[str],
        epsilon: float = 0.1,
        initial_reward: float = 0.5,
    ):
        """
        Initialize epsilon-greedy bandit.
        
        Args:
            arms: List of arm names (e.g., ["two_tower", "popularity", "content", "hybrid"])
            epsilon: Exploration rate (0.0 = pure exploitation, 1.0 = pure exploration)
            initial_reward: Initial reward estimate for each arm
        """
        self.arms = arms
        self.epsilon = epsilon
        self.initial_reward = initial_reward
        
        # Track counts and rewards for each arm
        self.counts: Dict[str, int] = {arm: 0 for arm in arms}
        self.rewards: Dict[str, float] = {arm: initial_reward for arm in arms}
        self.total_rewards: Dict[str, float] = {arm: 0.0 for arm in arms}

    def select_arm(self) -> str:
        """
        Select an arm using epsilon-greedy strategy.
        
        Returns:
            Selected arm name
        """
        if random.random() < self.epsilon:
            # Explore: random selection
            return random.choice(self.arms)
        else:
            # Exploit: select arm with highest average reward
            return max(self.arms, key=lambda arm: self.rewards[arm])

    def update(self, arm: str, reward: float) -> None:
        """
        Update bandit with observed reward for an arm.
        
        Args:
            arm: Arm that was selected
            reward: Observed reward (e.g., click-through rate, engagement score)
        """
        if arm not in self.arms:
            raise ValueError(f"Unknown arm: {arm}")
        
        self.counts[arm] += 1
        self.total_rewards[arm] += reward
        
        # Update average reward (incremental update)
        n = self.counts[arm]
        self.rewards[arm] = self.total_rewards[arm] / n

    def get_stats(self) -> Dict[str, Dict[str, float]]:
        """
        Get statistics for all arms.
        
        Returns:
            Dictionary mapping arm names to stats (count, reward, total_reward)
        """
        return {
            arm: {
                "count": self.counts[arm],
                "average_reward": self.rewards[arm],
                "total_reward": self.total_rewards[arm],
            }
            for arm in self.arms
        }

    def save(self, filepath: str) -> None:
        """Save bandit state to file."""
        state = {
            "arms": self.arms,
            "epsilon": self.epsilon,
            "initial_reward": self.initial_reward,
            "counts": self.counts,
            "rewards": self.rewards,
            "total_rewards": self.total_rewards,
        }
        Path(filepath).parent.mkdir(parents=True, exist_ok=True)
        with open(filepath, "w") as f:
            json.dump(state, f, indent=2)

    @classmethod
    def load(cls, filepath: str) -> "EpsilonGreedyBandit":
        """Load bandit state from file."""
        with open(filepath, "r") as f:
            state = json.load(f)
        
        bandit = cls(
            arms=state["arms"],
            epsilon=state["epsilon"],
            initial_reward=state["initial_reward"],
        )
        bandit.counts = state["counts"]
        bandit.rewards = state["rewards"]
        bandit.total_rewards = state["total_rewards"]
        
        return bandit

