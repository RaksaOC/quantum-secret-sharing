"use client";

import { motion } from "motion/react";
import { HOLDERS } from "@/content/steps";
import { cx } from "@/lib/cx";
import { toHex } from "@/lib/prng";
import { useTicker } from "@/lib/useTicker";
import { CIPHERTEXT, K, SHARES } from "./keys";
import s from "./scenes.module.css";

/* 0 shares · 1 XOR to K · 2 file into AES · 3 ciphertext out · 4–5 hold */
export function EncryptScene() {
  const phase = useTicker(1300, 7);
  const show = (p: number) => ({ opacity: phase >= p ? 1 : 0.18, y: phase >= p ? 0 : 6 });

  return (
    <div className={s.scene}>
      <div className={s.split}>
        <div>
          <div className={s.sideTitle}>QUANTUM PART · simulated</div>
          {HOLDERS.map((h, i) => (
            <motion.div key={h.name} className={s.hexRow} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
              <span>k{i + 1}</span>
              <span className={s.hex}>{toHex(SHARES[i])}…</span>
            </motion.div>
          ))}
          <motion.div className={s.caption} style={{ textAlign: "left", margin: "4px 0 6px 10px" }} animate={show(1)}>
            k₁ ⊕ k₂ ⊕ k₃ =
          </motion.div>
          <motion.div className={cx(s.hexRow, s.hexKey)} animate={{ ...show(1), scale: phase === 1 ? [1, 1.04, 1] : 1 }}>
            <span>K</span>
            <span className={s.hex}>{toHex(K)}…</span>
          </motion.div>
          <p className={s.caption} style={{ textAlign: "left", marginTop: 8 }}>
            256-bit key from the HBB rounds (first 64 bits shown)
          </p>
        </div>

        <div className={s.divider} />

        <div className={s.flowCol}>
          <div className={s.sideTitle} style={{ marginBottom: 0 }}>
            CLASSICAL PART · real crypto
          </div>
          <motion.div className={s.fileCard} animate={{ ...show(0), x: phase === 2 ? [0, 6, 0] : 0 }}>
            <span className={s.fileIcon}>SQL</span>
            <span>
              <b style={{ color: "var(--ink)" }}>payroll_backup.sql</b>
              <br />
              <span className={s.mono} style={{ fontSize: "0.7rem", color: "var(--muted)" }}>
                INSERT INTO payroll VALUES (1042, …
              </span>
            </span>
          </motion.div>
          <motion.div className={s.aes} animate={{ ...show(2), boxShadow: phase === 2 ? "0 0 0 6px var(--accent-soft)" : "0 0 0 0px var(--accent-soft)" }}>
            <strong>AES-256-GCM</strong>
            <span>key K · 96-bit nonce · 128-bit tag</span>
          </motion.div>
          <motion.div className={s.panel} style={{ padding: "10px 12px" }} animate={show(3)}>
            <div className={s.panelTitle} style={{ marginBottom: 6 }}>
              payroll_backup.sql.enc
            </div>
            <div className={s.hex} style={{ color: "var(--muted)" }}>
              {CIPHERTEXT.map((b, i) => (
                <motion.span key={i} initial={false} animate={{ opacity: phase >= 3 ? 1 : 0.15 }} transition={{ delay: phase >= 3 ? i * 0.025 : 0 }}>
                  {b.toString(16).padStart(2, "0")}
                </motion.span>
              ))}
              …
            </div>
          </motion.div>
          <motion.div className={s.chips} style={{ justifyContent: "flex-start" }} animate={show(3)}>
            <span className={`${s.chip} ${s.chipOk}`}>Store it anywhere</span>
            <span className={s.chip}>K can now be forgotten</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
