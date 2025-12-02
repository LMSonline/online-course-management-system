from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import recommendations as recommendations_router

app = FastAPI(
    title="Recommendation Service",
    version="1.0.0",
    description="Two-Tower based course recommendation API for LMS.",
)