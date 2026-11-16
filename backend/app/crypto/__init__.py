"""Classical crypto layer. The quantum part ends with a classical key; this does the rest.

    keys.py      bits <-> bytes, fingerprints
    xor_split.py N-of-N XOR shares (K = k1 ^ ... ^ kN), also the classical baseline
    aes.py       AES-256-GCM encrypt / decrypt (a wrong key fails the tag check)
    shamir.py    K-of-N Shamir over GF(2^8) for extension b
"""
