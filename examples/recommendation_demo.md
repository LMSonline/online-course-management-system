# Recommendation Service Demo

This guide demonstrates how to use the Recommendation Service API.

## Prerequisites

- Recommendation service running at `http://localhost:8002`
- Trained model (optional, service works with heuristics if no model)
- User interaction data in database

## Basic Usage

### 1. Get Home Page Recommendations

```bash
# Basic recommendations
curl "http://localhost:8002/api/v1/recommendations/home?user_id=user123"

# With explanations
curl "http://localhost:8002/api/v1/recommendations/home?user_id=user123&explain=true"

# Using specific strategy
curl "http://localhost:8002/api/v1/recommendations/home?user_id=user123&strategy=hybrid"
curl "http://localhost:8002/api/v1/recommendations/home?user_id=user123&strategy=popularity"
curl "http://localhost:8002/api/v1/recommendations/home?user_id=user123&strategy=content"
curl "http://localhost:8002/api/v1/recommendations/home?user_id=user123&strategy=two_tower"
```

### 2. Get Similar Courses

```bash
curl "http://localhost:8002/api/v1/recommendations/similar/course_python_basic"
```

## Analytics Endpoints

### Get User Statistics

```bash
curl "http://localhost:8002/api/v1/recommendations/stats/user/user123"
```

Response includes:
- `num_recommendations`: Total recommendations shown
- `num_clicks`: Total clicks on recommendations
- `num_enrolls`: Total enrollments from recommendations
- `ctr`: Click-through rate
- `top_categories`: Most recommended categories

### Get Global Statistics

```bash
curl "http://localhost:8002/api/v1/recommendations/stats/global"
```

Response includes:
- `global_ctr`: Overall click-through rate
- `most_popular_courses`: Most recommended courses
- `strategy_distribution`: Distribution of strategies used
- `daily_stats`: Time-series statistics

## Admin Endpoints

### Get Model Information

```bash
curl "http://localhost:8002/admin/recommendations/models"
```

### Rebuild Index

```bash
curl -X POST "http://localhost:8002/admin/recommendations/reindex"
```

## Simulating User Interactions

```python
import httpx
import asyncio

async def simulate_user_journey():
    async with httpx.AsyncClient() as client:
        user_id = "user123"
        
        # 1. Get recommendations
        response = await client.get(
            f"http://localhost:8002/api/v1/recommendations/home",
            params={"user_id": user_id, "explain": True}
        )
        recommendations = response.json()
        print(f"Received {len(recommendations)} recommendations")
        
        # 2. Simulate click (would normally be done by frontend)
        # This is logged automatically by the service
        
        # 3. Get updated stats
        stats_response = await client.get(
            f"http://localhost:8002/api/v1/recommendations/stats/user/{user_id}"
        )
        stats = stats_response.json()
        print(f"User CTR: {stats['ctr']}%")

asyncio.run(simulate_user_journey())
```

## Online Learning

### Update Bandit from Interactions

```bash
python -m app.scripts.update_online_model --hours 24 --min-interactions 10
```

This updates the epsilon-greedy bandit policy based on recent interactions.

