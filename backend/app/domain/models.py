"""Plain domain objects that live between the quantum layer and the API schemas.

They hold secrets (the key K and each share), so they never go to the client as-is.
"""

from dataclasses import dataclass, field
from datetime import UTC, datetime


@dataclass(frozen=True)
class Holder:
    name: str
    role: str = ""


@dataclass
class VaultSession:
    """Everything produced by one successful distribution."""

    id: str
    holders: list[Holder]
    key: bytes
    """Dealer key K (32 bytes for AES-256)."""
    shares: dict[str, bytes]
    """Holder name -> share k_i, with K = k_1 XOR ... XOR k_N."""
    error_rate: float
    created_at: datetime = field(default_factory=lambda: datetime.now(UTC))
    ciphertext: bytes | None = None
    nonce: bytes | None = None
    filename: str | None = None
