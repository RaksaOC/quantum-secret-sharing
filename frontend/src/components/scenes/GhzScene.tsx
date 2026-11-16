"use client";

import { AnimatePresence, motion } from "motion/react";
import { mulberry32 } from "@/lib/prng";
import { useTicker } from "@/lib/useTicker";
import s from "./scenes.module.css";

const WIRES = ["Dealer", "Maya", "Dara", "Lina"];
const Y = (i: number) => 34 + i * 48;
const X0 = 96;
const X1 = 430;
// step at which each gate fires
const H_AT = { x: 150, step: 1 };
const CNOTS = [
  { x: 210, c: 0, t: 1, step: 2 },
  { x: 265, c: 1, t: 2, step: 3 },
  { x: 320, c: 2, t: 3, step: 4 },
];
const MEASURE_X = 385;

const STATE = [
  "|0000⟩",
  "(|0⟩ + |1⟩) |000⟩ / √2",
  "(|00⟩ + |11⟩) |00⟩ / √2",
  "(|000⟩ + |111⟩) |0⟩ / √2",
  "(|0000⟩ + |1111⟩) / √2",
];
const CYCLE = 9;

export function GhzScene() {
  const t = useTicker(1150);
  const step = t % CYCLE;
  const measuring = step >= 6;
  const outcome = mulberry32(Math.floor(t / CYCLE) + 11)() < 0.5 ? 0 : 1;
  const entangledUpTo = step >= 1 ? Math.min(3, step - 1) : -1; // index of last wire joined

  const gateColor = (at: number) => (step >= at ? "var(--accent)" : "var(--ctl)");

  return (
    <div className={s.scene}>
      <svg viewBox="0 0 450 200" className={s.svg} role="img" aria-label="GHZ circuit: H on the dealer qubit, then a CNOT chain">
        {WIRES.map((w, i) => (
          <g key={w}>
            <text x={0} y={Y(i) + 4} fontSize={11.5} fontWeight={600} fill="var(--ink)">
              {w}
            </text>
            <text x={58} y={Y(i) + 4} fontSize={11} fill="var(--muted)" className={s.mono}>
              |0⟩
            </text>
            <motion.line
              x1={X0}
              x2={X1}
              y1={Y(i)}
              y2={Y(i)}
              strokeWidth={i <= entangledUpTo ? 2 : 1.4}
              animate={{ stroke: i <= entangledUpTo ? "var(--accent)" : "var(--ctl)" }}
            />
          </g>
        ))}

        {/* H gate */}
        <motion.g animate={{ scale: step === H_AT.step ? 1.12 : 1 }} style={{ originX: `${H_AT.x}px`, originY: `${Y(0)}px` }}>
          <rect x={H_AT.x - 15} y={Y(0) - 15} width={30} height={30} rx={6} fill={step >= 1 ? "var(--accent)" : "var(--bg)"} stroke={gateColor(1)} strokeWidth={1.5} />
          <text x={H_AT.x} y={Y(0) + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={step >= 1 ? "var(--accent-ink)" : "var(--ink)"}>
            H
          </text>
        </motion.g>

        {/* CNOT chain */}
        {CNOTS.map((g) => {
          const on = step >= g.step;
          const color = gateColor(g.step);
          return (
            <motion.g key={g.x} animate={{ opacity: on ? 1 : 0.55 }}>
              <line x1={g.x} x2={g.x} y1={Y(g.c)} y2={Y(g.t) + 11} stroke={color} strokeWidth={1.6} />
              <circle cx={g.x} cy={Y(g.c)} r={5} fill={color} />
              <circle cx={g.x} cy={Y(g.t)} r={11} fill="var(--bg)" stroke={color} strokeWidth={1.6} />
              <line x1={g.x - 11} x2={g.x + 11} y1={Y(g.t)} y2={Y(g.t)} stroke={color} strokeWidth={1.6} />
              {step === g.step && (
                <motion.circle cx={g.x} cy={Y(g.t)} fill="none" stroke="var(--accent)" initial={{ r: 11, opacity: 0.8 }} animate={{ r: 24, opacity: 0 }} transition={{ duration: 0.8 }} />
              )}
            </motion.g>
          );
        })}

        {/* measurement */}
        {WIRES.map((w, i) => (
          <g key={`m${w}`}>
            <rect x={MEASURE_X - 16} y={Y(i) - 15} width={32} height={30} rx={6} fill="var(--bg)" stroke={step >= 6 ? "var(--accent)" : "var(--ctl)"} strokeWidth={1.4} />
            <AnimatePresence mode="wait">
              {measuring ? (
                <motion.text
                  key={`v${t - step}`}
                  x={MEASURE_X}
                  y={Y(i) + 5}
                  textAnchor="middle"
                  fontSize={14}
                  fontWeight={700}
                  fill="var(--accent-text)"
                  className={s.mono}
                  initial={{ opacity: 0, translateY: 7 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  {outcome}
                </motion.text>
              ) : (
                <motion.path
                  key="dial"
                  d={`M${MEASURE_X - 9} ${Y(i) + 5} a9 9 0 0 1 18 0 M${MEASURE_X} ${Y(i) + 5} l6 -9`}
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth={1.3}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                />
              )}
            </AnimatePresence>
          </g>
        ))}
      </svg>

      <div className={s.panel} style={{ textAlign: "center" }}>
        <div className={s.panelTitle}>{measuring ? "Measured: everyone gets the same random value" : "State of the four qubits"}</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={measuring ? `m${outcome}` : `s${Math.min(step, 4)}`}
            className={s.mono}
            style={{ fontSize: "1.15rem", color: "var(--ink)", fontWeight: 600 }}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
          >
            {measuring ? `${outcome}${outcome}${outcome}${outcome}  (50% · 50%)` : STATE[Math.min(step, 4)]}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className={s.chips}>
        <span className={`${s.chip} ${step >= 1 ? s.chipAccent : ""}`}>1 · superposition (H)</span>
        <span className={`${s.chip} ${step >= 2 ? s.chipAccent : ""}`}>2 · entangle (CNOT chain)</span>
        <span className={`${s.chip} ${measuring ? s.chipAccent : ""}`}>3 · measure</span>
      </div>
    </div>
  );
}
