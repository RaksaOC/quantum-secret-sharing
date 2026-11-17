"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import ui from "@/components/ui/primitives/primitives.module.css";
import { cx } from "@/lib/cx";
import { fingerprint } from "@/lib/demo/keys";
import type { Vault } from "@/lib/demo/useVault";
import { HolderAvatar, holderColor } from "../HolderAvatar";
import styles from "./ReconstructStep.module.css";

/** Step 5 (classical): the participants who turn up combine their shares to rebuild K. */
export function ReconstructStep({ vault }: { vault: Vault }) {
  const { cfg, vkey, present, result } = vault;
  const [busy, setBusy] = useState(false);
  if (!vkey) return null;
  const need = cfg.rule === "all" ? cfg.holders.length : cfg.k;

  const go = () => {
    setBusy(true);
    setTimeout(() => {
      vault.combine();
      setBusy(false);
    }, 1300);
  };

  return (
    <div className={styles.wrap}>
      <section className={styles.card}>
        <div className={styles.head}>
          <h3>Who turns up?</h3>
          <span className={styles.need}>
            {present.length} of {cfg.holders.length} here · {need} needed · click someone to make them absent
          </span>
        </div>
        <div className={styles.people}>
          {cfg.holders.map((h) => {
            const on = present.includes(h.id);
            return (
              <button key={h.id} type="button" className={cx(styles.person, on && styles.on)} onClick={() => vault.togglePresent(h.id)} aria-pressed={on}>
                <HolderAvatar holder={h} color={holderColor(cfg.holders, h.id)} size={30} />
                <span>
                  <b>{h.name}</b>
                  <i>{on ? "brings their share" : "not here"}</i>
                </span>
              </button>
            );
          })}
        </div>
        <button className={cx(ui.btn, ui.primary, styles.go)} onClick={go} disabled={busy || present.length === 0}>
          {busy ? "Combining…" : "Combine the shares"}
        </button>
      </section>

      <AnimatePresence mode="wait">
        {busy && (
          <motion.section key="busy" className={styles.combine} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className={styles.flow}>
              {cfg.holders
                .filter((h) => present.includes(h.id))
                .map((h, i) => (
                  <motion.span
                    key={h.id}
                    className={styles.chip}
                    style={{ background: holderColor(cfg.holders, h.id) }}
                    initial={{ x: (i - 1) * 60, y: -10, opacity: 0 }}
                    animate={{ x: 0, y: 0, opacity: [0, 1, 1, 0.2], scale: [1, 1, 0.8, 0.5] }}
                    transition={{ duration: 1.1, times: [0, 0.2, 0.7, 1] }}
                  >
                    {(h.name[0] ?? "?").toUpperCase()}
                  </motion.span>
                ))}
            </div>
            <p>{cfg.rule === "all" ? "XOR-ing the shares together…" : "Fitting the curve through the points…"}</p>
          </motion.section>
        )}

        {!busy && result && (
          <motion.section
            key="result"
            className={cx(styles.verdict, result.ok ? styles.good : styles.bad)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <b>{result.ok ? "Key reconstructed" : "Cannot reconstruct the key"}</b>
            <div className={styles.fps}>
              <span>
                Rebuilt key <code>{fingerprint(result.combined)}</code>
              </span>
              <span>
                Original K <code>{fingerprint(vkey.key)}</code>
              </span>
              <span className={result.ok ? styles.match : styles.miss}>{result.ok ? "match" : "no match"}</span>
            </div>
            <p>
              {result.ok
                ? `${result.have} shares rebuilt exactly K. It can now decrypt the PDF.`
                : cfg.rule === "all"
                  ? `Only ${result.have} of ${result.need} shares. With one share missing, the XOR is just another random-looking key, not K, so the PDF stays locked.`
                  : `Only ${result.have} of the ${result.need} points needed. Fewer than k points fit every possible curve, so they say nothing about K.`}
            </p>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
