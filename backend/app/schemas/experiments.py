from pydantic import BaseModel, Field


class NoiseSweepRequest(BaseModel):
    n_participants: int = Field(3, ge=2, le=10)
    levels: list[float] = Field(default=[0.0, 0.01, 0.02, 0.05, 0.08, 0.1, 0.15])
    rounds: int = Field(1024, ge=8, le=20_000)
    eve: bool = False


class ScalingRequest(BaseModel):
    sizes: list[int] = Field(default=[3, 5, 8, 10])
    rounds: int = Field(512, ge=8, le=20_000)
    depolarizing: float = 0.01


class SeriesPoint(BaseModel):
    x: float
    error_rate: float
    qubits: int | None = None
    depth: int | None = None
    seconds_per_round: float | None = None


class ExperimentResponse(BaseModel):
    name: str
    threshold: float
    points: list[SeriesPoint]
