"""Collects every route module under one /api router.

Each module maps to one page of the web app:

    health        status pill in the UI
    distribution  1. Setup + 2. Distribute (teaching mode and full HBB)
    vault         3. Encrypt + 4. Unlock
    comparison    5. Classical vs quantum
    experiments   6. Experiments (noise sweep, scaling N)
    threshold     7. K-of-N extension
"""

from fastapi import APIRouter

from app.api.routes import comparison, distribution, experiments, health, threshold, vault

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(distribution.router, prefix="/distribution", tags=["distribution"])
api_router.include_router(vault.router, prefix="/vault", tags=["vault"])
api_router.include_router(comparison.router, prefix="/comparison", tags=["comparison"])
api_router.include_router(experiments.router, prefix="/experiments", tags=["experiments"])
api_router.include_router(threshold.router, prefix="/threshold", tags=["threshold"])
