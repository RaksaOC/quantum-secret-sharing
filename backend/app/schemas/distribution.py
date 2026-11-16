from pydantic import BaseModel, Field

from app.schemas.common import Basis, NoiseConfig, Participant


# ---- Teaching mode: one secret bit hidden in the GHZ phase -------------------------------
class TeachingRequest(BaseModel):
    n_participants: int = Field(3, ge=2, le=10)
    secret_bit: int = Field(1, ge=0, le=1)
    shots: int = Field(1024, ge=1, le=100_000)


class TeachingResponse(BaseModel):
    circuit_qasm: str
    circuit_svg: str | None = None
    counts: dict[str, int]
    """Raw measurement counts; every bitstring should have XOR parity == secret_bit."""
    parity_ok_ratio: float


# ---- Full HBB distribution ---------------------------------------------------------------
class DistributionRequest(BaseModel):
    participants: list[Participant] = Field(min_length=2, max_length=10)
    rounds: int = Field(2048, ge=8, le=50_000)
    eve: bool = Field(False, description="Insert an intercept-and-resend eavesdropper.")
    noise: NoiseConfig = NoiseConfig()
    seed: int | None = None


class RoundRecord(BaseModel):
    index: int
    bases: list[Basis]
    """Dealer first, then one basis per participant."""
    kept: bool
    """True when the number of Y bases is even, so the results are correlated."""
    check: bool = False
    dealer_bit: int | None = None
    share_bits: list[int] | None = None
    error: bool | None = None
    """Only set on check rounds: did the revealed results disagree?"""


class DistributionResponse(BaseModel):
    session_id: str
    n_qubits: int
    total_rounds: int
    sifted_rounds: int
    check_rounds: int
    error_rate: float
    threshold: float
    aborted: bool
    key_bits: int
    rounds_preview: list[RoundRecord]
    """First rounds only, for the round table in the UI."""
