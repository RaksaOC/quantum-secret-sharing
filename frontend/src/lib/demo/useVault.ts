"use client";

import { useState } from "react";
import { makeShares, makeVaultKey, reconstruct, type ReconstructResult, type Share, type VaultKey } from "./keys";
import { DEFAULT_CONFIG, withChannel, type Channel } from "./participants";
import { distribute, type Distribution } from "./protocol";
import type { VaultConfig, VaultFile } from "./types";

/** The six steps of the vault. Only "Distribute key" is quantum; the rest is classical. */
export const STEPS = [
  { label: "Upload PDF", kind: "classical" },
  { label: "Encrypt", kind: "classical" },
  { label: "Distribute key", kind: "quantum" },
  { label: "Shares", kind: "classical" },
  { label: "Reconstruct", kind: "classical" },
  { label: "Unlock", kind: "classical" },
] as const;

/** Everything one run of the vault needs: PDF → key → distribution → shares → reconstruct → unlock. */
export function useVault() {
  const [step, setStep] = useState(0);
  const [file, setFileState] = useState<VaultFile | null>(null);
  const [vkey, setVkey] = useState<VaultKey | null>(null);
  const [cfg, setCfgState] = useState<VaultConfig>(DEFAULT_CONFIG);
  const [dist, setDist] = useState<Distribution | null>(null);
  const [shares, setShares] = useState<Share[] | null>(null);
  const [present, setPresent] = useState<string[]>(DEFAULT_CONFIG.holders.map((h) => h.id));
  const [result, setResult] = useState<ReconstructResult | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [seed, setSeed] = useState(7);

  /** Changing an earlier step throws away everything after it. */
  const clearDistribution = () => {
    setDist(null);
    setShares(null);
    setResult(null);
    setUnlocked(false);
  };

  const setFile = (f: VaultFile | null) => {
    setFileState(f);
    setVkey(null);
    clearDistribution();
  };

  const encrypt = () => {
    const next = seed + 1;
    setSeed(next);
    setVkey(makeVaultKey(next));
    clearDistribution();
  };

  const setCfg = (patch: Partial<VaultConfig>) => {
    const next = { ...cfg, ...patch };
    next.k = Math.min(Math.max(2, next.k), next.holders.length);
    if (next.eve && !next.holders.some((h) => h.id === next.eve)) next.eve = (next.holders[1] ?? next.holders[0]).id;
    setCfgState(next);
    setPresent(next.holders.map((h) => h.id));
    clearDistribution();
  };

  const setChannel = (ch: Channel) => setCfg(withChannel(cfg, ch));

  /** Run the (simulated) GHZ protocol. Shares only exist if the error rate passed. */
  const distributeKey = () => {
    if (!vkey) return;
    const next = seed + 1;
    setSeed(next);
    const d = distribute(cfg, next);
    setDist(d);
    setShares(d.aborted ? null : makeShares(cfg, vkey.key, next));
    setResult(null);
    setUnlocked(false);
  };

  const togglePresent = (id: string) => {
    setPresent((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    setResult(null);
    setUnlocked(false);
  };

  const combine = () => vkey && shares && setResult(reconstruct(cfg, vkey.key, shares, present));

  /** Furthest step the user may open. */
  const reachable = !file ? 0 : !vkey ? 1 : !shares ? 2 : !result?.ok ? 4 : 5;

  const go = (s: number) => {
    setStep(Math.max(0, Math.min(s, reachable)));
    const el = document.getElementById("vault-steps");
    if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const restart = () => {
    setStep(0);
    setFileState(null);
    setVkey(null);
    setCfgState(DEFAULT_CONFIG);
    setPresent(DEFAULT_CONFIG.holders.map((h) => h.id));
    clearDistribution();
  };

  return {
    step,
    go,
    reachable,
    file,
    setFile,
    vkey,
    encrypt,
    cfg,
    setCfg,
    setChannel,
    dist,
    shares,
    distributeKey,
    present,
    togglePresent,
    result,
    combine,
    unlocked,
    unlock: () => setUnlocked(true),
    restart,
  };
}

export type Vault = ReturnType<typeof useVault>;
