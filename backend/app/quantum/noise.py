"""Aer noise models for extension d (error rate vs noise level)."""

from qiskit_aer.noise import NoiseModel

from app.schemas.common import NoiseConfig


def build_noise_model(config: NoiseConfig) -> NoiseModel | None:
    """Depolarising error on 1- and 2-qubit gates plus a symmetric readout error.

    Returns None when every knob is 0 so the ideal simulator is used.

    TODO(security): depolarizing_error(p, 1) on h/s/sdg/z, depolarizing_error(p, 2) on cx,
    ReadoutError([[1-r, r], [r, 1-r]]) on all qubits.
    """
    raise NotImplementedError("quantum.noise.build_noise_model")
