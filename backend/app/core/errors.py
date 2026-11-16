"""Shared error handling.

Every unimplemented piece of the protocol raises ``NotImplementedError``. The handler
below turns that into an HTTP 501 so the frontend can show "coming soon" instead of
crashing, and so the API contract is visible in /docs before the logic exists.
"""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse


class ProtocolAborted(Exception):
    """Raised when the check-round error rate is above the abort threshold."""

    def __init__(self, error_rate: float, threshold: float) -> None:
        super().__init__(f"error rate {error_rate:.1%} is above the threshold {threshold:.1%}")
        self.error_rate = error_rate
        self.threshold = threshold


class SessionNotFound(Exception):
    def __init__(self, session_id: str) -> None:
        super().__init__(f"no vault session with id {session_id!r}")
        self.session_id = session_id


def register_error_handlers(app: FastAPI) -> None:
    @app.exception_handler(NotImplementedError)
    async def not_implemented(_: Request, exc: NotImplementedError) -> JSONResponse:
        return JSONResponse(
            status_code=501,
            content={"detail": "Not implemented yet", "todo": str(exc) or None},
        )

    @app.exception_handler(ProtocolAborted)
    async def aborted(_: Request, exc: ProtocolAborted) -> JSONResponse:
        return JSONResponse(
            status_code=409,
            content={
                "detail": "Distribution aborted",
                "error_rate": exc.error_rate,
                "threshold": exc.threshold,
            },
        )

    @app.exception_handler(SessionNotFound)
    async def missing(_: Request, exc: SessionNotFound) -> JSONResponse:
        return JSONResponse(status_code=404, content={"detail": str(exc)})
