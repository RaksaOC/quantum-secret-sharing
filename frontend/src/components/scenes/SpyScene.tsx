"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { cx } from "@/lib/cx";
import { mulberry32 } from "@/lib/prng";
import { AlertIcon, CheckIcon } from "./icons";
import s from "./scenes.module.css";

const CHECKS = 48;
const THRESHOLD = 0.11;
const GAUGE_MAX = 0.4;

function checkRounds(eve: boolean) {
  const rand = mulberry32(eve ? 77 : 5);
  // Eve's intercept-and-resend: wrong guess half the time, then a 50% chance of flipping parity → ~25%.
  // Without Eve, light simulator noise only.
  return Array.from({ length: CHECKS }, () => rand() < (eve ? 0.25 : 0.015));
}

export function SpyScene() {
  const [eve, setEve] = useState(false);
  const [userDriven, setUserDriven] = useState(false);

  useEffect(() => {
    if (userDriven) return;
    const id = window.setInterval(() => setEve((v) => !v), 4200);
    return () => window.clearInterval(id);
  }, [userDriven]);

  const errors = useMemo(() => checkRounds(eve), [eve]);
  const rate = errors.filter(Boolean).length / CHECKS;
  const aborted = rate > THRESHOLD;

  return (
    <div className={s.scene}>
      <div className={s.controlRow}>
        <button
          className={s.switch}
          role="switch"
          aria-checked={eve}
          onClick={() => {
            setUserDriven(true);
            setEve((v) => !v);
          }}
        >
          <span className={s.switchTrack} data-on={eve}>
            <motion.span layout className={s.switchKnob} />
          </span>
          Eavesdropper {eve ? "on" : "off"}
        </button>
      </div>

      <Channel eve={eve} />

      <div className={s.spyGrid}>
        <div className={s.panel}>
          <div className={s.panelTitle}>48 check rounds (red = results disagree)</div>
          <div className={s.dots}>
            {errors.map((err, i) => (
              <motion.span
                key={i}
                className={s.dotCell}
                animate={{ backgroundColor: err ? "var(--bad)" : "var(--ok-soft)", scale: err ? [1, 1.25, 1] : 1 }}
                transition={{ delay: i * 0.012, duration: 0.35 }}
              />
            ))}
          </div>
        </div>
        <Gauge rate={rate} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={aborted ? "abort" : "ok"}
          className={cx(s.verdict, aborted ? s.chipBad : s.chipOk)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {aborted ? <AlertIcon /> : <CheckIcon />}
          {aborted ? `Abort: ${(rate * 100).toFixed(1)}% > ${THRESHOLD * 100}% · key thrown away` : `Accept: ${(rate * 100).toFixed(1)}% < ${THRESHOLD * 100}% · key is safe`}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Channel({ eve }: { eve: boolean }) {
  return (
    <svg viewBox="0 0 440 74" className={s.svg} aria-hidden="true">
      <line x1={50} y1={30} x2={390} y2={30} stroke="var(--accent)" strokeWidth={1.6} strokeDasharray="5 5" />
      <motion.line
        x1={50}
        y1={30}
        x2={390}
        y2={30}
        stroke="var(--accent)"
        strokeWidth={1.6}
        strokeDasharray="5 5"
        animate={{ strokeDashoffset: [0, -20] }}
        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      />
      <circle cx={30} cy={30} r={22} fill="var(--bg)" />
      <text x={30} y={34} textAnchor="middle" fontSize={10.5} fontWeight={600} fill="var(--ink)">
        Dealer
      </text>
      <circle cx={410} cy={30} r={22} fill="var(--bg)" />
      <text x={410} y={34} textAnchor="middle" fontSize={10.5} fontWeight={600} fill="var(--ink)">
        Holders
      </text>
      <text x={220} y={66} textAnchor="middle" fontSize={11} fill="var(--muted)">
        GHZ qubits in transit (quantum channel)
      </text>
      <AnimatePresence>
        {eve && (
          <motion.g key="eve" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <circle cx={220} cy={30} r={19} fill="var(--bad)" />
            <text x={220} y={34} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--bg)">
              Eve
            </text>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  );
}

function Gauge({ rate }: { rate: number }) {
  const f = Math.min(rate / GAUGE_MAX, 1);
  const tf = THRESHOLD / GAUGE_MAX;
  const ang = Math.PI - tf * Math.PI;
  const tx = 100 + 80 * Math.cos(ang);
  const ty = 100 - 80 * Math.sin(ang);
  const bad = rate > THRESHOLD;
  return (
    <div className={s.panel} style={{ textAlign: "center" }}>
      <div className={s.panelTitle}>Error rate on check rounds</div>
      <svg viewBox="0 0 200 118" className={s.svg} style={{ maxWidth: 240, margin: "0 auto" }} role="img" aria-label={`Error rate ${(rate * 100).toFixed(1)} percent`}>
        <path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--faint)" strokeWidth={14} strokeLinecap="round" />
        <motion.path
          d="M20 100 A80 80 0 0 1 180 100"
          fill="none"
          strokeWidth={14}
          strokeLinecap="round"
          initial={false}
          animate={{ pathLength: Math.max(f, 0.001), stroke: bad ? "var(--bad)" : "var(--ok)" }}
          transition={{ type: "spring", stiffness: 70, damping: 14 }}
        />
        <line x1={tx} y1={ty} x2={100 + 64 * Math.cos(ang)} y2={100 - 64 * Math.sin(ang)} stroke="var(--ink)" strokeWidth={2} />
        <text x={100 + 54 * Math.cos(ang)} y={100 - 54 * Math.sin(ang) + 4} textAnchor="middle" fontSize={9} fill="var(--muted)">
          11%
        </text>
        <text x={100} y={96} textAnchor="middle" fontSize={26} fontWeight={700} fill="var(--ink)">
          {(rate * 100).toFixed(1)}%
        </text>
      </svg>
      <div className={s.caption}>~25% with a spy · ~0% without</div>
    </div>
  );
}
