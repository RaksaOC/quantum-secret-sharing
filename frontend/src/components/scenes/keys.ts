/* Fixed demo key material shared by the Encrypt and Unlock scenes (first 8 of 32 bytes). */
import { mulberry32, randomHex, xorBytes } from "@/lib/prng";

const rand = mulberry32(2026);
export const K = randomHex(rand, 8);
const k1 = randomHex(rand, 8);
const k2 = randomHex(rand, 8);
const k3 = xorBytes(K, k1, k2);
export const SHARES = [k1, k2, k3];
export const CIPHERTEXT = randomHex(rand, 30);
