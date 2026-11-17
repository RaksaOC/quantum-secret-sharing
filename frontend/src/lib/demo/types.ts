export type Basis = "X" | "Y";
export type Rule = "all" | "threshold";
export type Noise = "none" | "low" | "high";

export interface Holder {
  id: string;
  name: string;
  role: string;
}

export interface VaultConfig {
  holders: Holder[];
  rule: Rule;
  /** shares needed when rule is "threshold" */
  k: number;
  /** id of the holder whose quantum link is tapped, or null */
  eve: string | null;
  noise: Noise;
}

export interface VaultFile {
  name: string;
  size: number;
  type: string;
  blob: Blob;
}
