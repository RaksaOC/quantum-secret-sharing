from app.repositories.session_store import SessionStore
from app.schemas.vault import EncryptResponse, UnlockRequest, UnlockResponse


def encrypt_file(store: SessionStore, session_id: str, filename: str, data: bytes) -> EncryptResponse:
    """1. session = store.get(session_id)
    2. sealed = crypto.aes.encrypt(session.key, data, associated_data=filename)
    3. keep ciphertext + nonce on the session; return them base64/hex encoded
    """
    raise NotImplementedError("services.vault_service.encrypt_file")


def unlock(store: SessionStore, req: UnlockRequest) -> UnlockResponse:
    """1. shares of the holders in req.present only
    2. candidate = crypto.xor_split.combine(those shares)
    3. try crypto.aes.decrypt(candidate, sealed); InvalidTag -> success=False,
       reason="authentication failed"
    """
    raise NotImplementedError("services.vault_service.unlock")
