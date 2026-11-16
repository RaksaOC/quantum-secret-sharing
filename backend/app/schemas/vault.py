from pydantic import BaseModel


class EncryptResponse(BaseModel):
    session_id: str
    filename: str
    nonce_hex: str
    ciphertext_b64: str
    key_fingerprint: str
    """Short SHA-256 of K, so the UI can show the key without revealing it."""


class UnlockRequest(BaseModel):
    session_id: str
    present: list[str]
    """Names of the participants who showed up with their share."""


class UnlockResponse(BaseModel):
    success: bool
    combined_key_fingerprint: str
    plaintext_b64: str | None = None
    reason: str | None = None
    """e.g. 'authentication failed' when AES-GCM rejects a wrong key."""
