"""Page 6: charts. Error rate vs noise, and cost vs N."""

from fastapi import APIRouter

from app.schemas.experiments import ExperimentResponse, NoiseSweepRequest, ScalingRequest
from app.services import experiment_service

router = APIRouter()


@router.post("/noise-sweep", response_model=ExperimentResponse)
def noise_sweep(body: NoiseSweepRequest) -> ExperimentResponse:
    return experiment_service.noise_sweep(body)


@router.post("/scaling", response_model=ExperimentResponse)
def scaling(body: ScalingRequest) -> ExperimentResponse:
    return experiment_service.scaling(body)
