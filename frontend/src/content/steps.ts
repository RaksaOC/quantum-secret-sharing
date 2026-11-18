/* The onboarding tour: one entry per step. Copy lives here, visuals live in components/scenes. */

export type SceneId =
  | "intro"
  | "problem"
  | "today"
  | "ghz"
  | "teaching"
  | "hbb"
  | "spy"
  | "encrypt"
  | "unlock"
  | "compare"
  | "extensions"
  | "architecture";

export interface Step {
  id: SceneId;
  label: string; // short name in the progress rail
  eyebrow: string;
  title: string;
  lead: string;
  points: string[];
  note?: string;
  hint?: string; // shown when the scene is interactive
}

export const HOLDERS = [
  { name: "Alice", role: "Founder", initials: "A" },
  { name: "Bob", role: "Founder", initials: "B" },
  { name: "Charlie", role: "Founder", initials: "C" },
] as const;

export const STEPS: Step[] = [
  {
    id: "intro",
    label: "Welcome",
    eyebrow: "Team 6 · Quantum Computing capstone",
    title: "Quantum Secret Sharing",
    lead: "Encrypt a confidential PDF with AES-256-GCM, then share its key between the participants with GHZ-based quantum secret sharing. Nobody can open it alone, and anyone listening in during the hand-out gets caught.",
    points: [
      "Research part: GHZ-based quantum secret sharing (the HBB protocol), simulated with Qiskit Aer",
      "Practical part: a vault that locks and unlocks real PDF files",
      "Classical: upload, encrypt, reconstruct, unlock. Quantum: distributing the key",
    ],
  },
  {
    id: "problem",
    label: "Scenario",
    eyebrow: "The scenario",
    title: "A document nobody can open alone",
    lead: "The board minutes, an acquisition contract, the salary report: some PDFs should only open when all three founders agree. So the key is never held by one person.",
    points: [
      "One or two founders: the PDF stays locked",
      "All three together: the PDF opens",
      "The same rule extends to N participants, or any k of them (Shamir)",
    ],
  },
  {
    id: "today",
    label: "Today",
    eyebrow: "Who does this today",
    title: "A real need, already solved classically",
    lead: "Key splitting already protects real systems. Its weak spot is the moment the shares are handed out.",
    points: [
      "HashiCorp Vault unseals with Shamir's secret sharing (5 shares, any 3)",
      "ICANN's DNSSEC root-key ceremonies need several key holders in the room",
      "Banks use dual control; crypto custody uses multi-signature wallets",
    ],
    note: "A share copied off TLS, a USB drive or a courier leaves no trace.",
  },
  {
    id: "ghz",
    label: "GHZ",
    eyebrow: "The quantum building block",
    title: "Entangle N + 1 qubits",
    lead: "One H gate and a chain of CNOTs link the dealer's qubit with one qubit for each holder. When measured they all agree, but the shared value isn't fixed until someone measures.",
    points: [
      "|GHZ⟩ = (|00…0⟩ + |11…1⟩) / √2",
      "A bigger version of the Bell pair from the Chapter 3 lab",
      "Cost grows gently: N + 1 qubits, N CNOTs",
    ],
  },
  {
    id: "teaching",
    label: "One bit",
    eyebrow: "Teaching mode",
    title: "Hide one bit in the phase",
    lead: "If the secret bit s is 1, apply Z. Then apply H to every qubit and measure. Each result on its own is a coin flip, but the XOR of all of them is always s.",
    points: [
      "One holder alone learns nothing about s",
      "Every holder together always recovers it",
      "This is the one-bit version from our proposal",
    ],
    hint: "Flip the secret bit on the right.",
  },
  {
    id: "hbb",
    label: "Key rounds",
    eyebrow: "Full HBB protocol",
    title: "Build a real key, round by round",
    lead: "In each round, everyone measures in a random basis, X or Y. They announce their bases but not their results, and keep only rounds with an even number of Y's, because only those give correlated results.",
    points: [
      "In a kept round, the dealer's bit = XOR of the holders' bits (plus a known flip)",
      "About half the rounds survive this sifting",
      "Repeat until the dealer has 256 key bits",
    ],
  },
  {
    id: "spy",
    label: "Spy check",
    eyebrow: "Spy detection",
    title: "Copying a share leaves fingerprints",
    lead: "Some kept rounds are used as check rounds: everyone reveals those results and compares them. A spy who measures the qubits and resends them pushes the error rate to about 25%.",
    points: [
      "No spy: ~0% errors (ideal) or a few % (noise)",
      "With a spy: ~25% errors, above the threshold, so the key is thrown away",
      "Sharing over a classical channel can't produce this signal",
    ],
    hint: "Switch the eavesdropper on and off.",
  },
  {
    id: "encrypt",
    label: "Encrypt",
    eyebrow: "Leaving the quantum world",
    title: "The key encrypts the PDF",
    lead: "The PDF is locked with an ordinary 256-bit key K using AES-256-GCM, and the encrypted file can be stored anywhere. The quantum part is how K's shares reach the participants.",
    points: [
      "K = k₁ ⊕ k₂ ⊕ k₃",
      "Quantum protects how the key is split and handed out",
      "AES does the actual encryption",
    ],
  },
  {
    id: "unlock",
    label: "Unlock",
    eyebrow: "Unlock",
    title: "Everyone, or nothing",
    lead: "To open the PDF, the participants combine their shares. With everyone present the key is exact and the file decrypts. If anyone is missing, AES-GCM's integrity check rejects it.",
    points: [
      "A wrong key never decrypts to garbage: the tag check fails",
      "Nobody, including the dealer after setup, needs to keep K",
    ],
    hint: "Tick who is present.",
  },
  {
    id: "compare",
    label: "Compare",
    eyebrow: "Classical vs quantum",
    title: "What quantum actually adds",
    lead: "Quantum doesn't make the stored key any stronger. What it does is make copying during the hand-out detectable, without relying on maths that Shor's algorithm breaks.",
    points: [
      "Blocks harvest-now-decrypt-later attacks on the share hand-out",
      "Classical sharing is better at thresholds, so we combine the two (K-of-N)",
    ],
  },
  {
    id: "extensions",
    label: "Extensions",
    eyebrow: "Built, not promised",
    title: "Where the project grows",
    lead: "Spy detection is the core. Each extension below moves it closer to a system you would trust with a real key.",
    points: [
      "Every extension has its own API route and app page",
      "Charts come straight from the simulator runs",
    ],
    hint: "Pick an extension.",
  },
  {
    id: "architecture",
    label: "Architecture",
    eyebrow: "How it's built",
    title: "Next.js, FastAPI and Qiskit",
    lead: "The web app talks to a FastAPI service. The services run the protocol on Qiskit Aer and pass the resulting key to the crypto layer.",
    points: [
      "frontend/: this tour plus the seven app pages",
      "backend/app/quantum: GHZ circuits, bases, sifting, Eve, noise",
      "backend/app/crypto: AES-GCM, XOR split, Shamir",
    ],
  },
];
