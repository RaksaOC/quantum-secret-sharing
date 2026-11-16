from app.schemas.experiments import ExperimentResponse, NoiseSweepRequest, ScalingRequest


def noise_sweep(req: NoiseSweepRequest) -> ExperimentResponse:
    """Extension d: error rate for each depolarising level; mark where it crosses the threshold."""
    raise NotImplementedError("services.experiment_service.noise_sweep")


def scaling(req: ScalingRequest) -> ExperimentResponse:
    """Extension c: for N in sizes record qubits (N+1), circuit depth, error rate, s/round."""
    raise NotImplementedError("services.experiment_service.scaling")
