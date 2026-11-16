"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo } from "react";
import { HOLDERS } from "@/content/steps";
import { cx } from "@/lib/cx";
import { demoRounds } from "@/lib/hbbDemo";
import { useTicker } from "@/lib/useTicker";
import s from "./scenes.module.css";

const ROWS = 8;
const CYCLE = ROWS + 5;

export function HbbScene() {
  const t = useTicker(850);
  const cycle = Math.floor(t / CYCLE);
  const visible = Math.min((t % CYCLE) + 1, ROWS);
  const rounds = useMemo(() => demoRounds(3, ROWS, 1234 + cycle * 17), [cycle]);
  const shown = rounds.slice(0, visible);
  const kept = shown.filter((r) => r.kept);

  return (
    <div className={s.scene} style={{ gap: 14 }}>
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Dealer</th>
              {HOLDERS.map((h) => (
                <th key={h.name}>{h.name}</th>
              ))}
              <th>Y's</th>
              <th style={{ textAlign: "right", paddingRight: 12 }}>After sifting</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {shown.map((r) => (
                <motion.tr
                  key={`${cycle}-${r.index}`}
                  className={cx(!r.kept && s.dropped)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35 }}
                >
                  <td>{r.index + 1}</td>
                  {r.bases.map((b, k) => (
                    <td key={k}>
                      <span className={cx(s.basis, b === "Y" && s.basisY)}>{b}</span>
                    </td>
                  ))}
                  <td className={s.mono}>{r.yCount}</td>
                  <td>
                    {r.kept ? (
                      <span style={{ color: "var(--ok)", fontWeight: 600 }}>
                        kept · K bit <span className={s.mono}>{r.dealerBit}</span>
                      </span>
                    ) : (
                      <span style={{ color: "var(--muted)" }}>odd → dropped</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <div className={s.panel}>
        <div className={s.panelTitle}>
          Kept {kept.length} of {shown.length} rounds · dealer bit = XOR of shares ⊕ (Y's / 2 mod 2)
        </div>
        <div className={s.keyStrip}>
          <span>Dealer K</span>
          <Bits bits={kept.map((r) => r.dealerBit!)} accent />
          {HOLDERS.map((h, i) => (
            <FragmentRow key={h.name} label={`${h.name} k${i + 1}`} bits={kept.map((r) => r.shareBits![i])} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FragmentRow({ label, bits }: { label: string; bits: number[] }) {
  return (
    <>
      <span>{label}</span>
      <Bits bits={bits} />
    </>
  );
}

function Bits({ bits, accent = false }: { bits: number[]; accent?: boolean }) {
  return (
    <span className={s.bits}>
      <AnimatePresence initial={false}>
        {bits.map((b, i) => (
          <motion.span
            key={i}
            className={cx(s.bit, accent && s.bitOne)}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            {b}
          </motion.span>
        ))}
      </AnimatePresence>
    </span>
  );
}
