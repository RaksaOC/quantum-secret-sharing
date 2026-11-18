"use client";

import { AnimatePresence, motion } from "motion/react";
import { HOLDERS } from "@/content/steps";
import { cx } from "@/lib/cx";
import { useTicker } from "@/lib/useTicker";
import { LockIcon } from "./icons";
import s from "./scenes.module.css";

/* Timeline: 0 whole key · 1 split and delivered · 2 one present · 3 two · 4–5 all three, open */
export function ProblemScene() {
  const phase = useTicker(1700, 7);
  const delivered = phase >= 1;
  const present = Math.max(0, Math.min(3, phase - 1));
  const open = present === 3;

  return (
    <div className={s.scene} style={{ gap: 26 }}>
      <div className={s.keyRow}>
        <span className={s.keyLabel}>{delivered ? "Key split into three shares" : "Backup key K"}</span>
        <div className={s.keyBar}>
          <motion.span className={s.keyBow} animate={{ opacity: delivered ? 0.25 : 1 }} />
          {[0, 1, 2].map((i) =>
            delivered ? (
              <span key={i} className={s.keySegGhost} />
            ) : (
              <motion.span key={i} layoutId={`problem-share-${i}`} className={s.keySeg} transition={{ type: "spring", stiffness: 160, damping: 20 }}>
                k{i + 1}
              </motion.span>
            ),
          )}
        </div>
      </div>

      <div className={s.holders}>
        {HOLDERS.map((h, i) => (
          <motion.div key={h.name} className={cx(s.holder, i < present && s.holderOn)} animate={{ y: i < present ? -6 : 0 }}>
            <div className={s.avatar}>{h.name[0]}</div>
            <div className={s.holderName}>
              {h.name}
              <span>{h.role}</span>
            </div>
            <div className={s.slot}>
              {delivered && (
                <motion.span layoutId={`problem-share-${i}`} className={s.keySeg} transition={{ type: "spring", stiffness: 160, damping: 20, delay: i * 0.08 }}>
                  k{i + 1}
                </motion.span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={open ? "open" : `locked-${present}`}
          className={cx(s.vault, open ? s.vaultOpen : s.vaultLocked)}
          initial={{ opacity: 0, y: 8, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <LockIcon open={open} />
          {open ? "All 3 present · PDF unlocked" : delivered ? `Locked · ${present} of 3 present` : "One key, one person: too risky"}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
