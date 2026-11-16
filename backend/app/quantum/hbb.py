"""Hillery–Bužek–Berthiaume (HBB) secret sharing, generalised to N participants.

One round:
  1. Prepare |GHZ_{N+1}>; dealer keeps qubit 0, participant i gets qubit i.
  2. (Optional) Eve intercepts the participants' qubits in transit (see eve.py).
  3. Everyone picks X or Y at random and measures (bases.py).
  4. Bases are announced publicly; results stay private.

Protocol loop:
  - Repeat rounds until enough rounds survive sifting to fill key_bits + check rounds.
  - Sifting, check rounds and the error rate live in sifting.py.
  - Result: dealer bits form K, participant i's bits form share k_i, with
    K == k_1 XOR ... XOR k_N (after flipping by the known parity of each round).
"""

import random
from dataclasses import dataclass

from app.schemas.common import Basis, NoiseConfig


@dataclass
class RawRound:
    index: int
    bases: list[Basis]
    results: list[int]
    """Dealer first, then participants. 0/1 measurement outcomes."""


@dataclass
class HbbResult:
    rounds: list[RawRound]
    key: bytes
    shares: list[bytes]
    sifted: int
    check_rounds: int
    error_rate: float


def run_round(
    index: int,
    n_participants: int,
    rng: random.Random,
    *,
    eve: bool = False,
    noise: NoiseConfig | None = None,
) -> RawRound:
    """Simulate one HBB round on Aer with shots=1.

    TODO(quantum-core): build_ghz(N+1) -> [eve.intercept] -> random_bases ->
    apply_measurement_bases -> run on get_simulator(noise) -> parse the single bitstring
    (mind Qiskit's little-endian bit order).
    """
    raise NotImplementedError("quantum.hbb.run_round")


def run_protocol(
    n_participants: int,
    *,
    key_bits: int,
    check_fraction: float,
    eve: bool = False,
    noise: NoiseConfig | None = None,
    seed: int | None = None,
    max_rounds: int = 50_000,
) -> HbbResult:
    """Run rounds until the key is full, then sift and estimate the error rate.

    Performance tip: batch many rounds into one Aer job (one circuit per basis combination,
    shots = how often that combination was drawn) instead of one job per round.

    TODO(quantum-core): loop run_round -> sifting.sift -> sifting.split_check_rounds ->
    sifting.error_rate -> pack bits into bytes (crypto.keys.bits_to_bytes).
    """
    raise NotImplementedError("quantum.hbb.run_protocol")
