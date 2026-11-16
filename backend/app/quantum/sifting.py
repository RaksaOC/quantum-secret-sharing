"""Classical post-processing of HBB rounds (after bases are announced)."""

import random

from app.quantum.hbb import RawRound


def sift(rounds: list[RawRound]) -> list[RawRound]:
    """Keep only rounds whose bases have an even number of Y's (~50% of rounds).

    TODO(quantum-core): filter with bases.expected_parity(r.bases) is not None.
    """
    raise NotImplementedError("quantum.sifting.sift")


def split_check_rounds(
    sifted: list[RawRound], fraction: float, rng: random.Random
) -> tuple[list[RawRound], list[RawRound]]:
    """Randomly sacrifice `fraction` of sifted rounds as public check rounds.

    Returns (key_rounds, check_rounds). The order must be chosen AFTER measurement so
    Eve cannot know which rounds will be checked.
    """
    raise NotImplementedError("quantum.sifting.split_check_rounds")


def error_rate(check_rounds: list[RawRound]) -> float:
    """Share of check rounds whose revealed results break the expected parity.

    Ideal simulator: ~0. Eve intercept-and-resend: ~0.25. Noise: in between.
    """
    raise NotImplementedError("quantum.sifting.error_rate")
