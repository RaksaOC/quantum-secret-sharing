"""FastAPI entry point.

Run with:  uv run uvicorn app.main:app --reload --port 8000
Docs:      http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import get_settings
from app.core.errors import register_error_handlers


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        version="0.1.0",
        description=(
            "N-party quantum secret sharing on GHZ states (HBB protocol), simulated with "
            "Qiskit Aer. The quantum layer produces a classical key; AES-256-GCM does the "
            "encryption."
        ),
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    register_error_handlers(app)
    app.include_router(api_router, prefix=settings.api_prefix)
    return app


app = create_app()
