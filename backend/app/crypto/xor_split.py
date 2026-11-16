"""N-of-N XOR sharing. In this project the shares come out of HBB; this module is used to
combine them on unlock and as the classical baseline on the comparison page."""


def xor_bytes(*parts: bytes) -> bytes:
    """XOR equal-length byte strings together.

    TODO(app): validate lengths, fold with ^.
    """
    raise NotImplementedError("crypto.xor_split.xor_bytes")


def split(secret: bytes, n: int) -> list[bytes]:
    """Classical split: n-1 random shares, last = secret ^ all others."""
    raise NotImplementedError("crypto.xor_split.split")


def combine(shares: list[bytes]) -> bytes:
    """K = k1 ^ k2 ^ ... ^ kN. With any share missing the result is just noise."""
    raise NotImplementedError("crypto.xor_split.combine")
