"""Simulator factory. Everything runs on Qiskit Aer; nothing here talks to real hardware."""

from qiskit_aer import AerSimulator
from qiskit_aer.noise import NoiseModel


def get_simulator(noise_model: NoiseModel | None = None, seed: int | None = None) -> AerSimulator:
    """Return an AerSimulator, optionally noisy and seeded for reproducible demos.

    TODO(quantum-core): AerSimulator(noise_model=noise_model, seed_simulator=seed).
    """
    raise NotImplementedError("quantum.simulator.get_simulator")
