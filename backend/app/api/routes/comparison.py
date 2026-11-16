"""Page 5: the same story with XOR / Shamir / quantum, Eve switched on."""

from fastapi import APIRouter

from app.schemas.comparison import ComparisonRequest, ComparisonResponse
from app.services import comparison_service

router = APIRouter()


@router.post("", response_model=ComparisonResponse)
def compare(body: ComparisonRequest) -> ComparisonResponse:
    return comparison_service.compare(body)
