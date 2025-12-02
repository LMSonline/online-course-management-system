"""
Tests for feature encoders.
"""

import pytest

from app.encoders import UserFeatureEncoder, ItemFeatureEncoder
from app.domain.models import Course


def test_user_feature_encoder_shape(user_encoder):
    """Test UserFeatureEncoder produces correct feature shape."""
    features = user_encoder.encode("user123")
    
    assert isinstance(features, list)
    assert len(features) == user_encoder.feature_dim
    assert all(isinstance(f, float) for f in features)
    # Features should be normalized (0-1 range)
    assert all(0.0 <= f <= 1.0 for f in features)


def test_user_feature_encoder_consistency(user_encoder):
    """Test UserFeatureEncoder produces consistent features for same user."""
    features1 = user_encoder.encode("user123")
    features2 = user_encoder.encode("user123")
    
    assert features1 == features2


def test_item_feature_encoder_shape(item_encoder, sample_courses):
    """Test ItemFeatureEncoder produces correct feature shape."""
    course = sample_courses[0]
    features = item_encoder.encode(course)
    
    assert isinstance(features, list)
    assert len(features) == item_encoder.feature_dim
    assert all(isinstance(f, float) for f in features)


def test_item_feature_encoder_level_encoding(item_encoder):
    """Test ItemFeatureEncoder encodes level correctly."""
    beginner_course = Course(
        id="c1",
        title="Beginner Course",
        description="For beginners",
        level="beginner",
        tags=[],
    )
    advanced_course = Course(
        id="c2",
        title="Advanced Course",
        description="For advanced",
        level="advanced",
        tags=[],
    )
    
    beginner_features = item_encoder.encode(beginner_course)
    advanced_features = item_encoder.encode(advanced_course)
    
    # Level encoding should be different
    # (beginner = [1,0,0], advanced = [0,0,1] in one-hot-ish encoding)
    assert beginner_features != advanced_features


def test_item_feature_encoder_tags(item_encoder):
    """Test ItemFeatureEncoder includes tag information."""
    course_with_tags = Course(
        id="c1",
        title="Course",
        description="Desc",
        level="beginner",
        tags=["python", "ml"],
    )
    course_no_tags = Course(
        id="c2",
        title="Course",
        description="Desc",
        level="beginner",
        tags=[],
    )
    
    features_with = item_encoder.encode(course_with_tags)
    features_without = item_encoder.encode(course_no_tags)
    
    # Features should differ based on tags
    assert features_with != features_without

