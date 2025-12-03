"""
Pytest configuration and shared fixtures.
"""

import pytest
import numpy as np
import torch

from app.encoders import UserFeatureEncoder, ItemFeatureEncoder
from app.domain.models import Course
from app.models.two_tower import TwoTowerTorchModel, TwoTowerModel
from app.infra.repositories import InMemoryCourseRepository


@pytest.fixture
def user_encoder():
    """User feature encoder for testing."""
    return UserFeatureEncoder()


@pytest.fixture
def item_encoder():
    """Item feature encoder for testing."""
    return ItemFeatureEncoder()


@pytest.fixture
def sample_courses():
    """Sample courses for testing."""
    return [
        Course(
            id="course1",
            title="Python Basics",
            description="Introduction to Python",
            level="beginner",
            tags=["python", "programming"],
        ),
        Course(
            id="course2",
            title="Advanced Python",
            description="Advanced Python features",
            level="intermediate",
            tags=["python", "advanced"],
        ),
        Course(
            id="course3",
            title="Machine Learning",
            description="ML fundamentals",
            level="intermediate",
            tags=["ml", "data-science"],
        ),
    ]


@pytest.fixture
def course_repo(sample_courses):
    """Course repository with sample data."""
    repo = InMemoryCourseRepository()
    # Clear default seed and add our courses
    repo._courses = {c.id: c for c in sample_courses}
    return repo


@pytest.fixture
def two_tower_torch_model(user_encoder, item_encoder):
    """PyTorch two-tower model for testing."""
    return TwoTowerTorchModel(
        user_input_dim=user_encoder.feature_dim,
        item_input_dim=item_encoder.feature_dim,
        embedding_dim=64,
        hidden_dims=[128, 64],
    )


@pytest.fixture
def two_tower_model(user_encoder, item_encoder):
    """TwoTowerModel wrapper for testing."""
    return TwoTowerModel(
        user_encoder=user_encoder,
        item_encoder=item_encoder,
    )

