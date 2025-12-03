"""Tests for epsilon-greedy bandit."""

import pytest
from app.bandit.epsilon_greedy import EpsilonGreedyBandit
import tempfile
import os


def test_bandit_initialization():
    """Test bandit initialization."""
    bandit = EpsilonGreedyBandit(
        arms=["arm1", "arm2", "arm3"],
        epsilon=0.1,
    )
    
    assert len(bandit.arms) == 3
    assert bandit.epsilon == 0.1
    assert all(arm in bandit.counts for arm in bandit.arms)
    assert all(arm in bandit.rewards for arm in bandit.arms)


def test_bandit_select_arm():
    """Test arm selection."""
    bandit = EpsilonGreedyBandit(
        arms=["arm1", "arm2"],
        epsilon=0.0,  # Pure exploitation
    )
    
    # Set different rewards
    bandit.rewards["arm1"] = 0.9
    bandit.rewards["arm2"] = 0.1
    
    # Should select arm1 (highest reward)
    selected = bandit.select_arm()
    assert selected == "arm1"


def test_bandit_update():
    """Test bandit update."""
    bandit = EpsilonGreedyBandit(
        arms=["arm1", "arm2"],
        epsilon=0.1,
    )
    
    # Update arm1 with reward
    bandit.update("arm1", 1.0)
    assert bandit.counts["arm1"] == 1
    assert bandit.rewards["arm1"] == 1.0
    
    # Update again
    bandit.update("arm1", 0.5)
    assert bandit.counts["arm1"] == 2
    assert bandit.rewards["arm1"] == 0.75  # (1.0 + 0.5) / 2


def test_bandit_save_load():
    """Test bandit save and load."""
    bandit = EpsilonGreedyBandit(
        arms=["arm1", "arm2"],
        epsilon=0.1,
    )
    
    bandit.update("arm1", 1.0)
    bandit.update("arm2", 0.5)
    
    # Save to temp file
    with tempfile.NamedTemporaryFile(mode='w', delete=False, suffix='.json') as f:
        temp_path = f.name
    
    try:
        bandit.save(temp_path)
        
        # Load and verify
        loaded = EpsilonGreedyBandit.load(temp_path)
        assert loaded.arms == bandit.arms
        assert loaded.epsilon == bandit.epsilon
        assert loaded.counts == bandit.counts
        assert loaded.rewards == bandit.rewards
    finally:
        if os.path.exists(temp_path):
            os.unlink(temp_path)

