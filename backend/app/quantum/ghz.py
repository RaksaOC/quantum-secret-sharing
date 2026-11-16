"""GHZ state preparation.

    |GHZ_n> = (|00...0> + |11...1>) / sqrt(2)

Built with one H on qubit 0 and a chain of CNOTs: CNOT(0,1), CNOT(1,2), ..., CNOT(n-2, n-1).
In HBB the dealer keeps qubit 0 and participant i gets qubit i, so n = N + 1.
"""

from qiskit import QuantumCircuit


def build_ghz(n_qubits: int) -> QuantumCircuit:
    """Return an n-qubit circuit (no measurements) that prepares |GHZ_n>.

    TODO(quantum-core): H(0) then CNOT chain. Assert n_qubits >= 2.
    """
    raise NotImplementedError("quantum.ghz.build_ghz")


def build_teaching_circuit(n_qubits: int, secret_bit: int) -> QuantumCircuit:
    """Teaching mode from the proposal: hide one bit s in the GHZ phase.

        GHZ  ->  Z on qubit 0 if s == 1  ->  H on every qubit  ->  measure all

    After the H layer only bitstrings with XOR parity == s can appear, so each result
    alone is a fair coin but x_1 XOR ... XOR x_n == s on every shot.

    TODO(quantum-core): compose build_ghz + conditional Z + H layer + measure_all.
    """
    raise NotImplementedError("quantum.ghz.build_teaching_circuit")
