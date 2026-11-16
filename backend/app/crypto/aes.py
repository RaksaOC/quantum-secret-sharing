"""AES-256-GCM via the `cryptography` package.

GCM is authenticated: decrypting with a wrong key raises InvalidTag instead of returning
garbage. The Unlock page uses exactly that as the "someone is missing" signal.
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class Sealed:
    nonce: bytes
    ciphertext: bytes
    """Ciphertext with the 16-byte GCM tag appended."""


def encrypt(key: bytes, plaintext: bytes, associated_data: bytes | None = None) -> Sealed:
    """TODO(app): AESGCM(key).encrypt(os.urandom(12), plaintext, associated_data)."""
    raise NotImplementedError("crypto.aes.encrypt")


def decrypt(key: bytes, sealed: Sealed, associated_data: bytes | None = None) -> bytes:
    """TODO(app): AESGCM(key).decrypt(...); let InvalidTag propagate to the service."""
    raise NotImplementedError("crypto.aes.decrypt")
