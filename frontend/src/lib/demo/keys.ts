/* FAKE key material. The 256-bit key and the shares are random bytes, and "reconstructing"
   checks who handed in a share instead of doing real Shamir maths. Enough to show the rules. */
import { mulberry32, randomHex, toHex, xorBytes } from "@/lib/prng";
import type { VaultConfig } from "./types";

/** What step 2 (Encrypt) produces: the key K and the AES-256-GCM output. */
export interface VaultKey {
  key: number[]; // K, 32 bytes = 256 bits
  nonce: number[]; // 12 bytes
  cipherHead: number[]; // first bytes of the encrypted PDF
  tag: number[]; // 16-byte GCM tag
}

export function makeVaultKey(seed: number): VaultKey {
  const rand = mulberry32(seed ^ 0x9e3779b9);
  return { key: randomHex(rand, 32), nonce: randomHex(rand, 12), cipherHead: randomHex(rand, 24), tag: randomHex(rand, 16) };
}

export interface Share {
  holderId: string;
  x: number; // share number (the x in Shamir's (x, y) points)
  bytes: number[];
}

/**
 * All N: shares that XOR to K (K = S1 ⊕ S2 ⊕ … ⊕ SN), the outcome GHZ-based sharing gives.
 * k of N: Shamir points (random-looking here).
 */
export function makeShares(cfg: VaultConfig, key: number[], seed: number): Share[] {
  const rand = mulberry32(seed ^ 0x5bd1e995);
  if (cfg.rule === "all") {
    const rest = cfg.holders.slice(1).map(() => randomHex(rand, 32));
    return [xorBytes(key, ...rest), ...rest].map((bytes, i) => ({ holderId: cfg.holders[i].id, x: i + 1, bytes }));
  }
  return cfg.holders.map((h, i) => ({ holderId: h.id, x: i + 1, bytes: randomHex(rand, 32) }));
}

export interface ReconstructResult {
  ok: boolean;
  combined: number[]; // the key the shares produce
  have: number;
  need: number;
}

export function reconstruct(cfg: VaultConfig, key: number[], shares: Share[], present: string[]): ReconstructResult {
  const need = cfg.rule === "all" ? cfg.holders.length : cfg.k;
  const used = shares.filter((s) => present.includes(s.holderId)).map((s) => s.bytes);
  const have = used.length;
  if (have >= need) return { ok: true, combined: key, have, need };
  // too few shares: the result looks just as random as K, but isn't K
  const mixed = used.length ? xorBytes(...used) : key.map(() => 0);
  return {
    ok: false,
    combined:
      cfg.rule === "all"
        ? mixed
        : xorBytes(
            mixed,
            key.map((b, i) => (b * 7 + i * 13) & 255),
          ),
    have,
    need,
  };
}

/** Short public fingerprint of a key (safe to show: it doesn't reveal the key). */
export function fingerprint(bytes: number[]) {
  let h = 0x811c9dc5;
  for (const b of bytes) h = Math.imul(h ^ b, 0x01000193);
  const hex = (h >>> 0).toString(16).padStart(8, "0");
  return `${hex.slice(0, 4)} ${hex.slice(4)}`;
}

export const hex = (bytes: number[], max = bytes.length) =>
  toHex(bytes.slice(0, max))
    .replace(/(.{4})/g, "$1 ")
    .trim() + (bytes.length > max ? " …" : "");
