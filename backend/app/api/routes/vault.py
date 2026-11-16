"""Pages 3–4: encrypt a file with K, then unlock it by combining shares."""

from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, UploadFile

from app.api.deps import get_session_store
from app.repositories.session_store import SessionStore
from app.schemas.vault import EncryptResponse, UnlockRequest, UnlockResponse
from app.services import vault_service

router = APIRouter()
Store = Annotated[SessionStore, Depends(get_session_store)]


@router.post("/encrypt", response_model=EncryptResponse)
async def encrypt(
    store: Store,
    session_id: Annotated[str, Form()],
    file: Annotated[UploadFile, File()],
) -> EncryptResponse:
    data = await file.read()
    return vault_service.encrypt_file(store, session_id, file.filename or "upload.bin", data)


@router.post("/unlock", response_model=UnlockResponse)
def unlock(body: UnlockRequest, store: Store) -> UnlockResponse:
    return vault_service.unlock(store, body)
