# Recommendation Service

Two-tower neural recommendation system for course recommendations in LMS.

## Overview

This service provides personalized course recommendations using a two-tower deep learning model:
- **User Tower**: Encodes user features into embeddings
- **Item Tower**: Encodes course features into embeddings
- **Similarity**: Dot-product similarity between user and item embeddings

## Architecture

- **Two-Tower Model**: PyTorch-based neural network with user and item towers
- **Feature Encoders**: Deterministic feature extraction (user_id, course metadata)
- **Candidate Generation**: ANN search using FAISS index
- **Ranking Service**: Re-ranking with explainable reasons
- **Interaction Logging**: Postgres-backed event logging for training feedback loop

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
curl "http://localhost:8002/api/v1/recommendations/home?user_id=user1"
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

## Project Structure

```
app/
├── api/           # FastAPI routes
├── core/          # Settings, logging
├── domain/        # Domain models
├── encoders/      # User and item feature encoders
├── models/        # PyTorch two-tower model
├── candidate/     # Candidate generation
├── ranking/       # Ranking service
├── logging/       # Interaction logger
├── scripts/       # Training and export scripts
└── eval/          # Evaluation metrics and scripts
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

