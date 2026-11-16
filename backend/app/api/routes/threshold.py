"""Page 7 (extension b): hybrid K-of-N with Shamir over quantum-protected links."""

from typing import Annotated

from fastapi import APIRouter, Depends

from app.api.deps import get_session_store
from app.repositories.session_store import SessionStore
from app.schemas.threshold import (
    ThresholdRecoverRequest,
    ThresholdRecoverResponse,
    ThresholdSplitRequest,
    ThresholdSplitResponse,
)
from app.services import threshold_service

router = APIRouter()
Store = Annotated[SessionStore, Depends(get_session_store)]


@router.post("/split", response_model=ThresholdSplitResponse)
def split(body: ThresholdSplitRequest, store: Store) -> ThresholdSplitResponse:
    return threshold_service.split(body, store)


@router.post("/recover", response_model=ThresholdRecoverResponse)
def recover(body: ThresholdRecoverRequest, store: Store) -> ThresholdRecoverResponse:
    return threshold_service.recover(body, store)
