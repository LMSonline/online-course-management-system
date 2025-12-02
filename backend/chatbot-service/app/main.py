from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import chat as chat_router

app = FastAPI(
    title="Chatbot Service",
    version="1.0.0",
    description="NLP chatbot for LMS (RAG + LLM + recommendations).",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # sau này có thể thu hẹp
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router.router, prefix="/api/v1", tags=["chatbot"])


@app.get("/health")
async def health_check():
    return {"status": "ok"}
