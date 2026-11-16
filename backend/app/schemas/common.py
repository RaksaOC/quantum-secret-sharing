from enum import StrEnum
from typing import Literal

from pydantic import BaseModel, Field


class Basis(StrEnum):
    """Measurement basis each person picks at random per round (HBB)."""

    X = "X"
    Y = "Y"


class Participant(BaseModel):
    name: str = Field(examples=["Maya"])
    role: str = Field(default="", examples=["Security Director"])


class NoiseConfig(BaseModel):
    """Aer noise model knobs (extension d)."""

    depolarizing: float = Field(0.0, ge=0, le=1, description="1- and 2-qubit depolarising prob.")
    readout: float = Field(0.0, ge=0, le=1, description="Readout bit-flip probability.")


class HealthResponse(BaseModel):
    status: Literal["ok"]
    qiskit: str | None
    qiskit_aer: str | None
    cryptography: str | None
