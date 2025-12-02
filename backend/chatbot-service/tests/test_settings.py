"""Tests for settings configuration."""

import pytest
import os
from pathlib import Path
import tempfile

from app.core.settings import Settings, get_settings, get_env_file


def test_default_settings():
    """Test that default settings are loaded correctly."""
    settings = Settings()
    
    assert settings.ENV == "dev"
    assert settings.VECTOR_STORE_BACKEND in ["inmemory", "faiss"]
    assert settings.LLM_PROVIDER in ["dummy", "llama3"]


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
        assert settings.VECTOR_STORE_BACKEND == "inmemory"
        assert settings.LLM_PROVIDER == "dummy"
    finally:
        # Restore original ENV
        if original_env:
            os.environ["ENV"] = original_env
        else:
            os.environ.pop("ENV", None)
        get_settings.cache_clear()


def test_env_file_selection(tmp_path, monkeypatch):
    """Test that correct .env file is selected based on ENV."""
    # Create test .env files
    (tmp_path / ".env.dev").write_text("ENV=dev\nTEST_VAR=dev_value")
    (tmp_path / ".env.test").write_text("ENV=test\nTEST_VAR=test_value")
    (tmp_path / ".env.prod").write_text("ENV=prod\nTEST_VAR=prod_value")
    
    # Change to temp directory
    original_cwd = os.getcwd()
    monkeypatch.chdir(tmp_path)
    
    try:
        # Test dev environment
        os.environ["ENV"] = "dev"
        env_file = get_env_file()
        assert env_file == ".env.dev"
        
        # Test test environment
        os.environ["ENV"] = "test"
        env_file = get_env_file()
        assert env_file == ".env.test"
        
        # Test prod environment
        os.environ["ENV"] = "prod"
        env_file = get_env_file()
        assert env_file == ".env.prod"
    finally:
        os.chdir(original_cwd)
        os.environ.pop("ENV", None)


def test_settings_caching():
    """Test that settings are cached."""
    settings1 = get_settings()
    settings2 = get_settings()
    
    # Should be the same instance (cached)
    assert settings1 is settings2


def test_settings_override_with_env_vars(monkeypatch):
    """Test that environment variables override defaults."""
    monkeypatch.setenv("VECTOR_STORE_BACKEND", "faiss")
    monkeypatch.setenv("LLM_PROVIDER", "llama3")
    
    # Clear cache to force reload
    get_settings.cache_clear()
    settings = get_settings()
    
    assert settings.VECTOR_STORE_BACKEND == "faiss"
    assert settings.LLM_PROVIDER == "llama3"
    
    # Cleanup
    get_settings.cache_clear()

