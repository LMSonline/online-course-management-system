"""
Tests for TwoTowerModel.
"""

import pytest
import torch
import numpy as np

from app.models.two_tower import TwoTowerTorchModel
from app.encoders import UserFeatureEncoder, ItemFeatureEncoder


def test_two_tower_torch_model_forward(two_tower_torch_model, user_encoder, item_encoder):
    """Test TwoTowerTorchModel forward pass."""
    batch_size = 4
    
    # Create dummy features
    user_features = torch.randn(batch_size, user_encoder.feature_dim)
    pos_item_features = torch.randn(batch_size, item_encoder.feature_dim)
    neg_item_features = torch.randn(batch_size, item_encoder.feature_dim)
    
    # Forward pass
    pos_scores, neg_scores = two_tower_torch_model(
        user_features, pos_item_features, neg_item_features
    )
    
    # Check output shapes
    assert pos_scores.shape == (batch_size,)
    assert neg_scores.shape == (batch_size,)
    assert all(isinstance(s.item(), float) for s in pos_scores)


def test_two_tower_torch_model_encode_user(two_tower_torch_model, user_encoder):
    """Test user encoding produces correct embedding dimension."""
    user_features = torch.randn(1, user_encoder.feature_dim)
    
    user_emb = two_tower_torch_model.encode_user(user_features)
    
    assert user_emb.shape == (1, two_tower_torch_model.embedding_dim)


def test_two_tower_torch_model_encode_item(two_tower_torch_model, item_encoder):
    """Test item encoding produces correct embedding dimension."""
    item_features = torch.randn(1, item_encoder.feature_dim)
    
    item_emb = two_tower_torch_model.encode_item(item_features)
    
    assert item_emb.shape == (1, two_tower_torch_model.embedding_dim)


def test_two_tower_torch_model_score(two_tower_torch_model):
    """Test score computation (dot product)."""
    user_emb = torch.randn(1, two_tower_torch_model.embedding_dim)
    item_emb = torch.randn(1, two_tower_torch_model.embedding_dim)
    
    score = two_tower_torch_model.score(user_emb, item_emb)
    
    assert score.shape == (1,)
    assert isinstance(score.item(), float)


def test_two_tower_torch_model_same_embedding_dim(two_tower_torch_model, user_encoder, item_encoder):
    """Test that user and item embeddings have same dimension."""
    user_features = torch.randn(1, user_encoder.feature_dim)
    item_features = torch.randn(1, item_encoder.feature_dim)
    
    user_emb = two_tower_torch_model.encode_user(user_features)
    item_emb = two_tower_torch_model.encode_item(item_features)
    
    assert user_emb.shape[1] == item_emb.shape[1]
    assert user_emb.shape[1] == two_tower_torch_model.embedding_dim

