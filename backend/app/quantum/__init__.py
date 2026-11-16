"""Quantum layer: everything that touches Qiskit. Owners: Quantum core (Sao Visal, Chey Rotana),
Security & noise (Man Arafat, Rith Seyhak).

    ghz.py        build GHZ / teaching circuits
    bases.py      X / Y basis rotations before measurement
    simulator.py  AerSimulator factory (ideal or noisy)
    hbb.py        one HBB round and the full protocol loop
    sifting.py    keep even-Y rounds, pick check rounds, estimate error rate
    eve.py        intercept-and-resend eavesdropper
    noise.py      Aer noise models (extension d)
"""
