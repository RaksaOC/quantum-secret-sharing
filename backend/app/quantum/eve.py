"""Eve: intercept-and-resend on the channel that carries the participants' qubits.

She measures each intercepted qubit in a random X/Y basis and sends on a fresh qubit
prepared in the state she observed. That breaks the GHZ correlation in about half of the
rounds where her basis was wrong, which shows up as ~25% errors on check rounds.
"""

import random

from qiskit import QuantumCircuit


def intercept(circuit: QuantumCircuit, targets: list[int], rng: random.Random) -> QuantumCircuit:
    """Insert Eve's measure-and-resend on the given qubits (mid-circuit measure + reset/prep).

    TODO(security): for each target pick X/Y, rotate, measure into an extra classical
    register, then re-prepare that eigenstate. Owner: Man Arafat, Rith Seyhak.
    """
    raise NotImplementedError("quantum.eve.intercept")
