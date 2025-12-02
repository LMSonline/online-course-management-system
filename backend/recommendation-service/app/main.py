import time
import uuid
from typing import Callable

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from app.api.v1 import recommendations as recommendations_router
from app.core import logging as core_logging
from app.core.settings import settings

logger = core_logging.logger

app = FastAPI(
    title="Recommendation Service",
    version="1.0.0",
    description="Two-Tower based course recommendation API for LMS.",
)


class RequestTimingMiddleware(BaseHTTPMiddleware):
    """Middleware to log request timing and set request ID."""

    async def dispatch(self, request: Request, call_next: Callable):
        # Generate request ID
        request_id = str(uuid.uuid4())
        core_logging.set_request_id(request_id)
        request.state.request_id = request_id

        # Record start time
        start_time = time.time()

        # Process request
        try:
            response = await call_next(request)
        except Exception as exc:
            # Log error
            core_logging.log_error(exc, context={"path": request.url.path})
            raise

        # Calculate latency
        latency_ms = (time.time() - start_time) * 1000

        # Extract user_id from query params if available
        user_id = request.query_params.get("user_id")

        # Log request
        core_logging.log_request(
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            latency_ms=latency_ms,
            user_id=user_id,
        )

        # Add request ID to response header
        response.headers["X-Request-ID"] = request_id

        return response


app.add_middleware(RequestTimingMiddleware)
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


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler for unhandled errors."""
    request_id = getattr(request.state, "request_id", None)
    core_logging.log_error(exc, context={"path": request.url.path})

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "type": "InternalServerError",
                "message": "An internal error occurred. Please try again later.",
                "request_id": request_id,
            }
        },
    )


@app.get("/health")
async def health_check():
    return {"status": "ok", "service": settings.SERVICE_NAME}
