"""Basis rotations applied just before a Z-basis measurement.

    X basis:  H
    Y basis:  S^dagger then H

For an (N+1)-qubit GHZ state measured in X/Y bases, the product of +/-1 outcomes is
deterministic only when the number of Y bases is even:

    parity(results) == (number_of_Y / 2) mod 2

Rounds with an odd number of Y's give uncorrelated results and are discarded in sifting.
"""

import random

from qiskit import QuantumCircuit

from app.schemas.common import Basis


def random_bases(n_qubits: int, rng: random.Random) -> list[Basis]:
    """Each party picks X or Y uniformly at random. Index 0 is the dealer."""
    return [rng.choice((Basis.X, Basis.Y)) for _ in range(n_qubits)]


def apply_measurement_bases(circuit: QuantumCircuit, bases: list[Basis]) -> QuantumCircuit:
    """Append the rotation for each qubit's basis, then measure all.

    TODO(quantum-core): X -> h(q); Y -> sdg(q), h(q); then measure_all().
    """
    raise NotImplementedError("quantum.bases.apply_measurement_bases")


def expected_parity(bases: list[Basis]) -> int | None:
    """Parity the results must have for a correlated round, or None if the round is discarded.

    TODO(quantum-core): count Y; odd -> None; even -> (count // 2) % 2.
    """
    raise NotImplementedError("quantum.bases.expected_parity")
