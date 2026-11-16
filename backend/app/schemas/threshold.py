from pydantic import BaseModel, Field


class ThresholdSplitRequest(BaseModel):
    """Hybrid K-of-N: Shamir split, each share delivered over a GHZ/QKD-protected link."""

    k: int = Field(3, ge=2)
    n: int = Field(5, ge=2, le=10)
    secret_hex: str | None = Field(None, description="Leave empty to generate a random 256-bit key.")


class ThresholdShare(BaseModel):
    holder: int
    share_hex: str
    link_error_rate: float
    """Error rate of the quantum link that carried this share."""


class ThresholdSplitResponse(BaseModel):
    session_id: str
    k: int
    n: int
    shares: list[ThresholdShare]


class ThresholdRecoverRequest(BaseModel):
    session_id: str
    holders: list[int]


class ThresholdRecoverResponse(BaseModel):
    success: bool
    secret_fingerprint: str | None = None
