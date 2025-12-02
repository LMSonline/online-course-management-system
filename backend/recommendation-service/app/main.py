from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import recommendations as recommendations_router

app = FastAPI(
    title="Recommendation Service",
    version="1.0.0",
    description="Two-Tower based course recommendation API for LMS.",
)

# Cho phép service khác gọi (monolith hoặc frontend):
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # sau này có thể thu hẹp domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount router
app.include_router(
    recommendations_router.router,
    prefix="/api/v1",
    tags=["recommendations"],
)


@app.get("/health")
async def health_check():
    return {"status": "ok"}
