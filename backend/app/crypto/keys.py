import hashlib


def bits_to_bytes(bits: list[int]) -> bytes:
    """Pack a list of 0/1 into bytes, most significant bit first.

    TODO(app): len(bits) must be a multiple of 8.
    """
    raise NotImplementedError("crypto.keys.bits_to_bytes")


def fingerprint(key: bytes) -> str:
    """Short public identifier for a key: first 8 hex chars of SHA-256. Safe to show in the UI."""
    return hashlib.sha256(key).hexdigest()[:8]
