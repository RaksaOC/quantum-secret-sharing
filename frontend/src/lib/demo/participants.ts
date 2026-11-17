import type { Holder, VaultConfig } from "./types";

/* Alice, Bob, Charlie… and Eve as the eavesdropper, as in most cryptography examples. */
export const DEFAULT_HOLDERS: Holder[] = [
  { id: "h1", name: "Alice", role: "Founder" },
  { id: "h2", name: "Bob", role: "Founder" },
  { id: "h3", name: "Charlie", role: "Founder" },
];
export const EXTRA_HOLDERS: Omit<Holder, "id">[] = [
  { name: "Dave", role: "Founder" },
  { name: "Erin", role: "Founder" },
  { name: "Frank", role: "Founder" },
];

export const HOLDER_COLORS = ["#6ab2e0", "#e8b23a", "#b48cf2", "#4cc38a", "#f68a4c", "#f0649e"];

/** 3 participants, all 3 needed, clean channel. */
export const DEFAULT_CONFIG: VaultConfig = { holders: DEFAULT_HOLDERS, rule: "all", k: 2, eve: null, noise: "none" };

/** The three channel cases the demo shows. */
export type Channel = "normal" | "eve" | "noisy";
export const CHANNELS: { value: Channel; label: string; note: string }[] = [
  { value: "normal", label: "Normal", note: "Clean links. Test rounds should almost all agree." },
  { value: "eve", label: "Eavesdropper", note: "Eve measures the qubits going to the second participant." },
  { value: "noisy", label: "Noisy", note: "Bad links flip many qubits, which looks just like a spy." },
];

export const channelOf = (cfg: VaultConfig): Channel => (cfg.eve ? "eve" : cfg.noise === "high" ? "noisy" : "normal");

export function withChannel(cfg: VaultConfig, ch: Channel): Partial<VaultConfig> {
  return { eve: ch === "eve" ? (cfg.holders[1] ?? cfg.holders[0]).id : null, noise: ch === "noisy" ? "high" : "none" };
}
