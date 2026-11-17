"use client";

import { motion } from "motion/react";
import { THRESHOLD } from "@/lib/demo/protocol";
import styles from "./ErrorGauge.module.css";

const MAX = 0.32;

/** Error rate so far against the 11% abort line. */
export function ErrorGauge({ rate, checks }: { rate: number; checks: number }) {
  const over = rate > THRESHOLD;
  return (
    <div className={styles.gauge}>
      <div className={styles.top}>
        <span className={styles.label}>Error rate e</span>
        <b className={over ? styles.bad : styles.ok}>{checks ? `${(rate * 100).toFixed(1)}%` : "–"}</b>
      </div>
      <div className={styles.track}>
        <motion.span
          className={over ? styles.fillBad : styles.fillOk}
          animate={{ width: `${Math.min(rate / MAX, 1) * 100}%` }}
          transition={{ duration: 0.25 }}
        />
        <span className={styles.line} style={{ left: `${(THRESHOLD / MAX) * 100}%` }} />
      </div>
      <div className={styles.scale}>
        <span>0%</span>
        <span style={{ left: `${(THRESHOLD / MAX) * 100}%` }} className={styles.mark}>
          abort above {THRESHOLD * 100}%
        </span>
        <span style={{ left: `${(0.25 / MAX) * 100}%` }} className={styles.mark}>
          spy ≈ 25%
        </span>
      </div>
    </div>
  );
}
