/* FAKE HBB distribution for the demo. Nothing quantum runs here: the rounds are drawn from a
   seeded random generator with the same statistics the real protocol (backend, Qiskit Aer)
   produces, so the numbers and the spy/noise behaviour look right. */
import { mulberry32 } from "@/lib/prng";
import type { Basis, Noise, VaultConfig } from "./types";

/** Abort when more than 11% of check rounds disagree (the usual QKD bound). */
export const THRESHOLD = 0.11;
export const TOTAL_ROUNDS = 1024;
export const KEY_BITS = 256;

export const NOISE: Record<Noise, { label: string; p: number; description: string }> = {
  none: { label: "Clean", p: 0.004, description: "Almost perfect links, like a short lab fibre." },
  low: { label: "Some noise", p: 0.035, description: "A few qubits flip on the way. Error correction fixes them." },
  high: { label: "Very noisy", p: 0.21, description: "So many flips that a spy can't be ruled out." },
};

/** Error rate a spy causes: measuring a GHZ qubit in the wrong basis breaks the correlation in 1 of 4 check rounds. */
export const SPY_ERROR = 0.25;

export interface Round {
  index: number;
  bases: Basis[]; // dealer first, then each holder
  kept: boolean; // even number of Y bases: the results are correlated and usable
  check: boolean; // kept round sacrificed to test for errors
  error: boolean | null; // only for check rounds
}

export interface Distribution {
  rounds: Round[];
  kept: number;
  checks: number;
  errors: number;
  errorRate: number;
  aborted: boolean;
  reason: "ok" | "spy" | "noise";
}

export function distribute(cfg: VaultConfig, seed: number): Distribution {
  const rand = mulberry32(seed);
  const parties = cfg.holders.length + 1;
  const p = Math.min(0.5, (cfg.eve ? SPY_ERROR : 0) + NOISE[cfg.noise].p);
  const rounds: Round[] = Array.from({ length: TOTAL_ROUNDS }, (_, index) => {
    const bases: Basis[] = Array.from({ length: parties }, () => (rand() < 0.5 ? "X" : "Y"));
    const kept = bases.filter((b) => b === "Y").length % 2 === 0;
    const check = kept && rand() < 0.25;
    return { index, bases, kept, check, error: check ? rand() < p : null };
  });
  return summarise(rounds, cfg);
}

/** Counts over the rounds seen so far (the UI calls this while the animation plays). */
export function summarise(rounds: Round[], cfg: VaultConfig): Distribution {
  const kept = rounds.filter((r) => r.kept).length;
  const checks = rounds.filter((r) => r.check).length;
  const errors = rounds.filter((r) => r.error).length;
  const errorRate = checks ? errors / checks : 0;
  const aborted = errorRate > THRESHOLD;
  return { rounds, kept, checks, errors, errorRate, aborted, reason: !aborted ? "ok" : cfg.eve ? "spy" : "noise" };
}
