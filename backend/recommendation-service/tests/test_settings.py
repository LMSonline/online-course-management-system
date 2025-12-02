"""Tests for settings configuration."""

import pytest
import os
from app.core.settings import Settings, get_settings


def test_default_settings():
    """Test that default settings are loaded correctly."""
    settings = Settings()
    
    assert settings.ENV == "dev"
    assert settings.DEFAULT_RECOMMENDER in ["two_tower", "popularity", "content", "hybrid"]
    assert settings.EMBEDDING_DIM > 0


def test_test_environment_defaults():
    """Test that test environment has safe defaults."""
    # Temporarily set ENV to test
    original_env = os.environ.get("ENV")
    os.environ["ENV"] = "test"
    
    try:
        # Clear cache to force reload
        get_settings.cache_clear()
        settings = get_settings()
        
        assert settings.ENV.lower() == "test"
    finally:
        # Restore original ENV
        if original_env:
            os.environ["ENV"] = original_env
        else:
            os.environ.pop("ENV", None)
        get_settings.cache_clear()


def test_settings_override_with_env_vars(monkeypatch):
    """Test that environment variables override defaults."""
    monkeypatch.setenv("DEFAULT_RECOMMENDER", "popularity")
    monkeypatch.setenv("BANDIT_EPSILON", "0.2")
    
    # Clear cache to force reload
    get_settings.cache_clear()
    settings = get_settings()
    
    assert settings.DEFAULT_RECOMMENDER == "popularity"
    assert settings.BANDIT_EPSILON == 0.2
    
    # Cleanup
    get_settings.cache_clear()

