/* Mirrors backend/app/schemas. Keep the two in sync (or generate from /openapi.json later). */

export type Basis = "X" | "Y";

export interface Participant {
  name: string;
  role?: string;
}

export interface NoiseConfig {
  depolarizing: number;
  readout: number;
}

export interface HealthResponse {
  status: "ok";
  qiskit: string | null;
  qiskit_aer: string | null;
  cryptography: string | null;
}

export interface TeachingRequest {
  n_participants: number;
  secret_bit: 0 | 1;
  shots?: number;
}

export interface TeachingResponse {
  circuit_qasm: string;
  circuit_svg: string | null;
  counts: Record<string, number>;
  parity_ok_ratio: number;
}

export interface DistributionRequest {
  participants: Participant[];
  rounds?: number;
  eve?: boolean;
  noise?: NoiseConfig;
  seed?: number | null;
}

export interface RoundRecord {
  index: number;
  bases: Basis[];
  kept: boolean;
  check: boolean;
  dealer_bit: number | null;
  share_bits: number[] | null;
  error: boolean | null;
}

export interface DistributionResponse {
  session_id: string;
  n_qubits: number;
  total_rounds: number;
  sifted_rounds: number;
  check_rounds: number;
  error_rate: number;
  threshold: number;
  aborted: boolean;
  key_bits: number;
  rounds_preview: RoundRecord[];
}

export interface EncryptResponse {
  session_id: string;
  filename: string;
  nonce_hex: string;
  ciphertext_b64: string;
  key_fingerprint: string;
}

export interface UnlockRequest {
  session_id: string;
  present: string[];
}

export interface UnlockResponse {
  success: boolean;
  combined_key_fingerprint: string;
  plaintext_b64: string | null;
  reason: string | null;
}

export interface ComparisonResponse {
  outcomes: { scheme: "xor" | "shamir" | "quantum"; eve_got_share: boolean; detected: boolean; error_rate: number | null }[];
}

export interface ExperimentResponse {
  name: string;
  threshold: number;
  points: { x: number; error_rate: number; qubits?: number; depth?: number; seconds_per_round?: number }[];
}

export interface ThresholdSplitResponse {
  session_id: string;
  k: number;
  n: number;
  shares: { holder: number; share_hex: string; link_error_rate: number }[];
}

export interface ThresholdRecoverResponse {
  success: boolean;
  secret_fingerprint: string | null;
}
