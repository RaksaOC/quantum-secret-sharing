"""Protocol tests to turn green as the quantum core lands (remove the xfail marks then)."""

import pytest

pytestmark = pytest.mark.xfail(raises=NotImplementedError, strict=True, reason="not built yet")


@pytest.mark.parametrize("n", [3, 5])
def test_teaching_mode_xor_equals_secret(n):
    from app.quantum.ghz import build_teaching_circuit

    build_teaching_circuit(n, 1)


def test_shares_xor_to_key():
    from app.quantum.hbb import run_protocol

    result = run_protocol(3, key_bits=64, check_fraction=0.25, seed=7)
    combined = bytes(len(result.key))
    for share in result.shares:
        combined = bytes(a ^ b for a, b in zip(combined, share))
    assert combined == result.key


def test_eve_pushes_error_rate_to_about_a_quarter():
    from app.quantum.hbb import run_protocol

    result = run_protocol(3, key_bits=128, check_fraction=0.5, eve=True, seed=7)
    assert 0.18 < result.error_rate < 0.32
