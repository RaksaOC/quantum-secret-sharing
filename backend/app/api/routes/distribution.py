"""Pages 1–2: set up the participants and run the distribution."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_session_store
from app.repositories.session_store import SessionStore
from app.schemas.distribution import (
    DistributionRequest,
    DistributionResponse,
    TeachingRequest,
    TeachingResponse,
)
from app.services import distribution_service

router = APIRouter()
Store = Annotated[SessionStore, Depends(get_session_store)]


@router.post("/teaching", response_model=TeachingResponse)
def run_teaching(body: TeachingRequest) -> TeachingResponse:
    """One secret bit hidden in the GHZ phase; XOR of all results gives it back."""
    return distribution_service.run_teaching_mode(body)


@router.post("/run", response_model=DistributionResponse)
def run_distribution(body: DistributionRequest, store: Store) -> DistributionResponse:
    """Full HBB: random X/Y bases, sifting, check rounds, abort on high error rate."""
    return distribution_service.run_distribution(body, store)
