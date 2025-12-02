# Recommendation Service

Two-tower neural recommendation system for course recommendations in LMS.

## Overview

This service provides personalized course recommendations using multiple algorithms:
- **Two-Tower Model**: Deep learning-based collaborative filtering
- **Popularity-Based**: Trending/popular courses
- **Content-Based**: TF-IDF similarity on course metadata
- **Hybrid**: Combines multiple strategies with configurable weights
- **Online Learning**: Epsilon-greedy bandit for strategy selection

## Architecture

- **Recommender Interface**: Pluggable recommender algorithms (Strategy pattern)
- **Two-Tower Model**: PyTorch-based neural network with user and item towers
- **Popularity Recommender**: Based on interaction counts
- **Content-Based Recommender**: TF-IDF + cosine similarity
- **Hybrid Recommender**: Weighted combination of multiple strategies
- **Online Learning**: Epsilon-greedy bandit for adaptive strategy selection
- **Feature Encoders**: Deterministic feature extraction (user_id, course metadata)
- **Candidate Generation**: ANN search using FAISS index
- **Ranking Service**: Re-ranking with explainable reasons
- **Interaction Logging**: Postgres-backed event logging for training feedback loop
- **Analytics**: User stats, global stats, CTR tracking

## Setup

### Prerequisites

- Python 3.11+
- Postgres database (for interaction events)
- PyTorch (CPU version is fine)

### Installation

```bash
cd backend/recommendation-service
pip install -r requirements.txt
pip install -r requirements-dev.txt  # For development
```

### Environment Variables

Create a `.env` file:

```bash
# Environment
ENV=dev

# Database (interaction events)
RS_DB_HOST=localhost
RS_DB_PORT=5432
RS_DB_NAME=lms
RS_DB_USER=postgres
RS_DB_PASSWORD=postgres

# Model Configuration
RS_MODELS_DIR=models
EMBEDDING_DIM=64
USER_FEATURE_DIM=16
ITEM_FEATURE_DIM=32

# Recommender Configuration
DEFAULT_RECOMMENDER=hybrid  # two_tower | popularity | content | hybrid
HYBRID_WEIGHTS_TWO_TOWER=0.5
HYBRID_WEIGHTS_POPULARITY=0.3
HYBRID_WEIGHTS_CONTENT=0.2
```

## Training the Model

### 1. Prepare Training Data

```bash
# Export interactions from DB to CSV
python -m app.scripts.prepare_training_data --output data/training_data.csv
```

### 2. Train Two-Tower Model

```bash
# Use default config
python -m app.scripts.train_two_tower

# Or specify config file
python -m app.scripts.train_two_tower --config configs/two_tower.yaml
```

This will:
- Load interactions from Postgres
- Train PyTorch model
- Save model weights to `models/two_tower_model.pt`
- Precompute and save item embeddings to `models/item_embeddings.npy`

### 3. Export FAISS Index (Optional)

For faster candidate retrieval:

```bash
python -m app.scripts.export_item_embeddings
```

This builds a FAISS index and saves it to `models/item_index.faiss`.

## CLI Tools

The service includes a CLI tool for common operations:

```bash
# Train two-tower model
python -m app.cli train-two-tower --epochs 10 --batch-size 32

# Export embeddings and build FAISS index
python -m app.cli export-embeddings

# Evaluate model
python -m app.cli eval-two-tower

# Rebuild FAISS index
python -m app.cli rebuild-index

# Show configuration
python -m app.cli show-config
```

## Online Learning

The service supports online learning via epsilon-greedy bandit:

```bash
# Update bandit and recommender weights from recent interactions
python -m app.scripts.update_online_model --hours 24 --min-interactions 10
```

This will:
1. Fetch recent interactions from database
2. Compute rewards (enroll > click > view)
3. Update bandit policy
4. Save updated state to `models/bandit_state.json`

The bandit automatically selects the best-performing recommender strategy based on observed rewards.

## Running the Service

```bash
uvicorn app.main:app --reload --port 8002
```

The service will automatically load trained model artifacts if they exist in `RS_MODELS_DIR`.

## Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app --cov-report=html
```

## Running Evaluation

Evaluate recommendation quality:

```bash
python -m app.eval.eval_two_tower
```

This computes Recall@K, Precision@K, and NDCG@K metrics on a held-out test set.

## API Examples

### Get home page recommendations

```bash
# Using default recommender
curl "http://localhost:8002/api/v1/recommendations/home?user_id=user1"

# Using specific strategy
curl "http://localhost:8002/api/v1/recommendations/home?user_id=user1&strategy=hybrid"
curl "http://localhost:8002/api/v1/recommendations/home?user_id=user1&strategy=popularity"
curl "http://localhost:8002/api/v1/recommendations/home?user_id=user1&strategy=content"
curl "http://localhost:8002/api/v1/recommendations/home?user_id=user1&strategy=two_tower"
```

### Get recommendations with explanations

```bash
curl "http://localhost:8002/api/v1/recommendations/home?user_id=user1&explain=true"
```

Response includes `reason` field explaining why each course was recommended.

### Get similar courses

```bash
curl "http://localhost:8002/api/v1/recommendations/similar/course_python_basic"
```

### Get user analytics

```bash
curl "http://localhost:8002/api/v1/recommendations/stats/user/user1"
```

Returns: num_recommendations, num_clicks, num_enrolls, CTR, top_categories

### Get global analytics

```bash
curl "http://localhost:8002/api/v1/recommendations/stats/global"
```

Returns: global CTR, most popular courses, strategy distribution, daily stats

### Admin: Get model info

```bash
curl "http://localhost:8002/admin/recommendations/models"
```

Returns: loaded models, embedding dimension, number of indexed items

### Admin: Rebuild index

```bash
curl -X POST "http://localhost:8002/admin/recommendations/reindex"
```

Triggers full re-export of item embeddings and FAISS index rebuild.

## Project Structure

```
app/
├── api/           # FastAPI routes
│   └── v1/
│       ├── recommendations.py  # Recommendation endpoints
│       ├── analytics.py         # Analytics endpoints
│       └── admin.py            # Admin endpoints
├── core/          # Settings, logging
├── domain/        # Domain models
├── encoders/      # User and item feature encoders
├── models/        # PyTorch two-tower model
├── recommenders/  # Recommender algorithms
│   ├── base.py              # BaseRecommender interface
│   ├── two_tower_recommender.py
│   ├── popularity_recommender.py
│   ├── content_based_recommender.py
│   └── hybrid_recommender.py
├── bandit/        # Online learning
│   └── epsilon_greedy.py    # Epsilon-greedy bandit
├── online/        # Online learning service
│   └── update.py            # Online update service
├── candidate/     # Candidate generation
├── ranking/       # Ranking service
├── logging/       # Interaction logger
├── services/      # Business logic
│   ├── recommendation_service.py
│   ├── recommender_factory.py
│   └── analytics_service.py
├── scripts/       # Training and export scripts
├── eval/          # Evaluation metrics and scripts
└── cli.py         # Typer CLI tool
```

## Development

### Code Formatting

```bash
black app/ tests/
ruff check app/ tests/
```

### Training Configuration

Edit `configs/two_tower.yaml` to adjust:
- Model architecture (embedding_dim, hidden_dims)
- Training hyperparameters (epochs, batch_size, learning_rate)
- Data filtering (event_types, min_interactions_per_user)

## License

MIT

