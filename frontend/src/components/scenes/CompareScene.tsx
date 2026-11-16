"use client";

import { motion } from "motion/react";
import s from "./scenes.module.css";

type Cell = string | { text: string; tone: "yes" | "no" };
const ROWS: [string, Cell, Cell, Cell][] = [
  ["How shares are made", "random bits, XOR", "points on a polynomial", "measuring entangled qubits"],
  ["How shares travel", "TLS, USB, courier", "TLS, USB, courier", "quantum channel (simulated)"],
  ["Share copied in transit", { text: "not noticed", tone: "no" }, { text: "not noticed", tone: "no" }, { text: "noticed · ~25% errors", tone: "yes" }],
  ["Rests on", "TLS → RSA/ECC (Shor breaks it)", "TLS → RSA/ECC (Shor breaks it)", "physics, not hard maths"],
  ["Any K of N", { text: "no", tone: "no" }, { text: "yes", tone: "yes" }, "hybrid (extension b)"],
  ["Special hardware", "none", "none", "yes in reality · we simulate"],
];

const render = (c: Cell) => (typeof c === "string" ? c : <span className={c.tone === "yes" ? s.yes : s.no}>{c.text}</span>);

export function CompareScene() {
  return (
    <div className={s.scene}>
      <div className={s.tableWrap}>
        <table className={s.cmp}>
          <thead>
            <tr>
              <th />
              <th>XOR split (N of N)</th>
              <th>Shamir (K of N)</th>
              <th className={s.qCol}>Quantum secret sharing</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, i) => (
              <motion.tr key={row[0]} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.12 }}>
                <td>{row[0]}</td>
                <td>{render(row[1])}</td>
                <td>{render(row[2])}</td>
                <td className={s.qCol}>{render(row[3])}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      <motion.div className={s.honest} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.95 }}>
        <span aria-hidden="true" style={{ fontSize: "1.1rem" }}>
          ⚖
        </span>
        <span>
          <b>To be fair:</b> AES is still AES, and the stored key is no stronger. Quantum protects the <b>hand-out</b> of the shares and makes copying them <b>detectable</b>.
        </span>
      </motion.div>
    </div>
  );
}
