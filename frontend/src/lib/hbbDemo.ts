/* Illustrative HBB rounds for the onboarding animation only.
   The real protocol runs in backend/app/quantum on Qiskit Aer. */
import { bit, mulberry32 } from "./prng";

export type Basis = "X" | "Y";

export interface DemoRound {
  index: number;
  bases: Basis[]; // dealer first
  yCount: number;
  kept: boolean;
  dealerBit: number | null;
  shareBits: number[] | null;
}

export function demoRounds(participants: number, count: number, seed: number): DemoRound[] {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, (_, index) => {
    const bases: Basis[] = Array.from({ length: participants + 1 }, () => (rand() < 0.5 ? "X" : "Y"));
    const yCount = bases.filter((b) => b === "Y").length;
    const kept = yCount % 2 === 0;
    if (!kept) return { index, bases, yCount, kept, dealerBit: null, shareBits: null };
    // Correlated round: parity of all results is fixed by (yCount / 2) mod 2.
    const flip = (yCount / 2) % 2;
    const dealerBit = bit(rand);
    const shareBits = Array.from({ length: participants - 1 }, () => bit(rand));
    const last = shareBits.reduce((acc, b) => acc ^ b, dealerBit ^ flip);
    return { index, bases, yCount, kept, dealerBit, shareBits: [...shareBits, last] };
  });
}
