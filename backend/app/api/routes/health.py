"""The only fully working endpoint for now: proves the stack is wired up."""

from importlib.metadata import PackageNotFoundError, version

from fastapi import APIRouter

from app.schemas.common import HealthResponse

router = APIRouter()


def _version(package: str) -> str | None:
    try:
        return version(package)
    except PackageNotFoundError:
        return None


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(
        status="ok",
        qiskit=_version("qiskit"),
        qiskit_aer=_version("qiskit-aer"),
        cryptography=_version("cryptography"),
    )
