"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { HOLDERS } from "@/content/steps";
import { cx } from "@/lib/cx";
import { toHex, xorBytes } from "@/lib/prng";
import { AlertIcon, CheckIcon } from "./icons";
import { K, SHARES } from "./keys";
import s from "./scenes.module.css";

const PLAINTEXT = ["emp_id | name          | net_pay", "1042   | Sok Dara      | 2,400.00", "1043   | Chan Sreyneang| 2,150.00", "1044   | Lim Visal     | 3,050.00"];

export function UnlockScene() {
  const [present, setPresent] = useState([true, true, false]);
  const chosen = SHARES.filter((_, i) => present[i]);
  const combined = chosen.length ? xorBytes(...chosen) : K.map(() => 0);
  const ok = present.every(Boolean);
  const count = present.filter(Boolean).length;

  return (
    <div className={s.scene}>
      <div className={s.toggles}>
        {HOLDERS.map((h, i) => (
          <button key={h.name} className={s.toggle} aria-pressed={present[i]} onClick={() => setPresent((p) => p.map((v, k) => (k === i ? !v : v)))}>
            <span className={s.avatar}>{h.name[0]}</span>
            <span className={s.holderName}>
              {h.name}
              <span>{h.role}</span>
            </span>
            <span className={s.check}>{present[i] ? `✓ brings k${i + 1}` : "absent"}</span>
          </button>
        ))}
      </div>

      <div className={s.panel}>
        <div className={s.panelTitle}>
          Combined key = XOR of {count} share{count === 1 ? "" : "s"}
        </div>
        <div className={s.hexRow} style={{ background: "var(--card)", marginBottom: 0 }}>
          <span>{ok ? "= K" : "≠ K"}</span>
          <span className={s.hex}>
            {combined.map((b, i) => (
              <motion.span key={`${i}-${b}`} initial={{ opacity: 0.2 }} animate={{ opacity: 1, color: b === K[i] ? "var(--ink)" : "var(--bad)" }} transition={{ delay: i * 0.03 }}>
                {b.toString(16).padStart(2, "0")}
              </motion.span>
            ))}
            …
          </span>
        </div>
        <div className={s.caption} style={{ textAlign: "left", marginTop: 6 }}>
          Real K starts with <span className={s.mono}>{toHex(K).slice(0, 8)}</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {ok ? (
          <motion.div key="ok" className={cx(s.result, s.resultOk)} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className={s.resultHead} style={{ color: "var(--ok)" }}>
              <CheckIcon /> Tag verified · PDF decrypted
            </div>
            <div className={s.rows}>
              {PLAINTEXT.map((row, i) => (
                <motion.div key={row} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                  {row}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`bad-${count}`}
            className={cx(s.result, s.resultBad)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, x: [0, -7, 7, -4, 4, 0] }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ x: { delay: 0.2, duration: 0.4 } }}
          >
            <div className={s.resultHead} style={{ color: "var(--bad)" }}>
              <AlertIcon /> InvalidTag: authentication failed
            </div>
            <p style={{ fontSize: "0.84rem", color: "var(--ink)" }}>
              {3 - count} share{3 - count === 1 ? " is" : "s are"} missing, so the key is wrong. AES-GCM refuses to decrypt instead of returning garbage. The PDF stays locked.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
