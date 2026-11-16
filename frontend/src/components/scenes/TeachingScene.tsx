"use client";

import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { HOLDERS } from "@/content/steps";
import { cx } from "@/lib/cx";
import { bit, mulberry32 } from "@/lib/prng";
import { useTicker } from "@/lib/useTicker";
import s from "./scenes.module.css";

function shot(i: number, secret: number) {
  const rand = mulberry32(i * 7919 + 101);
  const a = bit(rand);
  const b = bit(rand);
  return [a, b, secret ^ a ^ b]; // after H on a phase-encoded GHZ, parity always equals s
}

export function TeachingScene() {
  const [secret, setSecret] = useState(1);
  const t = useTicker(1100);
  const shots = useMemo(() => Array.from({ length: Math.min(t + 1, 5) }, (_, k) => t - k), [t]);
  const total = t + 1;
  const mayaOnes = useMemo(() => {
    let n = 0;
    for (let i = 0; i <= t; i++) n += shot(i, secret)[0];
    return n;
  }, [t, secret]);
  const mayaPct = Math.round((mayaOnes / total) * 100);

  return (
    <div className={s.scene}>
      <div className={s.controlRow}>
        <span>Secret bit s</span>
        <div className={s.segmented} role="group" aria-label="Secret bit">
          {[0, 1].map((v) => (
            <button key={v} aria-pressed={secret === v} onClick={() => setSecret(v)}>
              {secret === v && <motion.span layoutId="seg-secret" className={s.segPill} />}
              <span>{v}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={s.pipeline}>
        <span className={s.gate}>GHZ</span>
        <span className={s.pipeArrow}>→</span>
        <motion.span className={cx(s.gate, secret ? s.gateOn : s.gateOff)} layout>
          Z {secret ? "(s = 1)" : "skipped"}
        </motion.span>
        <span className={s.pipeArrow}>→</span>
        <span className={s.gate}>H ⊗ H ⊗ H</span>
        <span className={s.pipeArrow}>→</span>
        <span className={s.gate}>measure</span>
        <span className={s.pipeArrow}>→</span>
        <span className={cx(s.gate, s.gateOn)}>XOR</span>
      </div>

      <div className={s.shots} aria-live="off">
        <div className={s.shot} style={{ background: "transparent", paddingTop: 0, paddingBottom: 0 }}>
          <span className={s.shotIdx}>shot</span>
          {HOLDERS.map((h) => (
            <span key={h.name} className={s.shotIdx}>
              {h.name}
            </span>
          ))}
          <span className={s.shotIdx} style={{ justifySelf: "end" }}>
            XOR
          </span>
        </div>
        <AnimatePresence initial={false}>
          {shots.map((i) => {
            const bits = shot(i, secret);
            return (
              <motion.div
                key={`${secret}-${i}`}
                className={s.shot}
                layout
                initial={{ opacity: 0, y: -14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <span className={s.shotIdx}>#{i + 1}</span>
                {bits.map((b, k) => (
                  <span key={k} className={s.bitCell}>
                    <span className={cx(s.bit, b === 1 && s.bitOne)}>{b}</span>
                  </span>
                ))}
                <span className={s.xor}>
                  {bits.join(" ⊕ ")} = <b style={{ color: "var(--accent-text)" }}>{secret}</b>
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className={s.stats}>
        <div className={s.stat}>
          <div className={s.statTop}>
            <span>Maya alone reads 1</span>
            <strong>{mayaPct}%</strong>
          </div>
          <div className={s.meter}>
            <motion.div className={s.meterFill} animate={{ width: `${mayaPct}%` }} style={{ background: "var(--ctl)" }} />
          </div>
        </div>
        <div className={s.stat}>
          <div className={s.statTop}>
            <span>All three XOR to s</span>
            <strong>100%</strong>
          </div>
          <div className={s.meter}>
            <div className={s.meterFill} style={{ width: "100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
