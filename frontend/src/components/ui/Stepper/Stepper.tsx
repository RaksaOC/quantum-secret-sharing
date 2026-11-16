"use client";

import { motion } from "motion/react";
import { cx } from "@/lib/cx";
import styles from "./Stepper.module.css";

/** Numbered steps; finished and reachable steps are clickable. */
export function Stepper({ steps, current, reachable, onGo }: { steps: readonly string[]; current: number; reachable: number; onGo: (i: number) => void }) {
  return (
    <ol className={styles.steps} aria-label="Progress">
      {steps.map((s, i) => (
        <li key={s} className={cx(i < current && styles.done, i === current && styles.now)}>
          <button type="button" onClick={() => onGo(i)} disabled={i > reachable} aria-current={i === current ? "step" : undefined}>
            <span className={styles.num}>
              {i === current && <motion.span layoutId="stepper-dot" className={styles.ring} />}
              {i < current ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              ) : (
                i + 1
              )}
            </span>
            <span className={styles.label}>{s}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}
