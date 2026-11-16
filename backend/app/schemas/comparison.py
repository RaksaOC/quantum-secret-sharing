from typing import Literal

from pydantic import BaseModel, Field


class ComparisonRequest(BaseModel):
    n_participants: int = Field(3, ge=2, le=10)
    eve: bool = True
    rounds: int = Field(1024, ge=8, le=20_000)


class SchemeOutcome(BaseModel):
    scheme: Literal["xor", "shamir", "quantum"]
    eve_got_share: bool
    detected: bool
    error_rate: float | None = None


class ComparisonResponse(BaseModel):
    outcomes: list[SchemeOutcome]
