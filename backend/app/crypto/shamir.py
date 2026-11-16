"""Shamir secret sharing over GF(2^8), byte by byte (extension b, hybrid K-of-N).

Each share is then delivered over a GHZ/QKD-protected link, so the hand-out stays
spy-detectable. A fully quantum threshold scheme (Cleve–Gottesman–Lo) needs qutrits and
is listed as further work.
"""


def split(secret: bytes, k: int, n: int) -> list[tuple[int, bytes]]:
    """Return n shares (x, y_bytes); any k of them recover the secret.

    TODO(app): random degree k-1 polynomial per byte with constant term = secret byte.
    """
    raise NotImplementedError("crypto.shamir.split")


def recover(shares: list[tuple[int, bytes]]) -> bytes:
    """Lagrange interpolation at x = 0 over GF(2^8)."""
    raise NotImplementedError("crypto.shamir.recover")
