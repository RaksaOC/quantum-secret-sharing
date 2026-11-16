from app.repositories.session_store import SessionStore
from app.schemas.threshold import (
    ThresholdRecoverRequest,
    ThresholdRecoverResponse,
    ThresholdSplitRequest,
    ThresholdSplitResponse,
)


def split(req: ThresholdSplitRequest, store: SessionStore) -> ThresholdSplitResponse:
    """Extension b (hybrid): crypto.shamir.split(K, k, n), then deliver each share over a
    2-party quantum link (run_protocol with N=1) and report each link's error rate."""
    raise NotImplementedError("services.threshold_service.split")


def recover(req: ThresholdRecoverRequest, store: SessionStore) -> ThresholdRecoverResponse:
    """Any k holders -> crypto.shamir.recover; fewer than k -> success=False."""
    raise NotImplementedError("services.threshold_service.recover")
