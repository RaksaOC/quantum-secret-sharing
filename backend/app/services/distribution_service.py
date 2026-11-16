from app.repositories.session_store import SessionStore
from app.schemas.distribution import (
    DistributionRequest,
    DistributionResponse,
    TeachingRequest,
    TeachingResponse,
)


def run_teaching_mode(req: TeachingRequest) -> TeachingResponse:
    """1. quantum.ghz.build_teaching_circuit(n, s)
    2. run on quantum.simulator.get_simulator() with req.shots
    3. parity_ok_ratio = share of shots whose XOR == s (should be 1.0 when ideal)
    4. return QASM (qiskit.qasm3.dumps) + optional SVG drawing for the UI
    """
    raise NotImplementedError("services.distribution_service.run_teaching_mode")


def run_distribution(req: DistributionRequest, store: SessionStore) -> DistributionResponse:
    """1. quantum.noise.build_noise_model(req.noise)
    2. quantum.hbb.run_protocol(N, key_bits, check_fraction, eve, noise, seed)
    3. error_rate > settings.abort_threshold -> aborted=True, nothing stored
       (or raise core.errors.ProtocolAborted, depending on how the UI wants it)
    4. otherwise store a domain.models.VaultSession(key, shares) and return its id
    5. rounds_preview = first ~20 rounds for the round table
    """
    raise NotImplementedError("services.distribution_service.run_distribution")
