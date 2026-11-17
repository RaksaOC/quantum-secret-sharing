"use client";

import { motion } from "motion/react";
import { fingerprint, hex } from "@/lib/demo/keys";
import type { Vault } from "@/lib/demo/useVault";
import { HolderAvatar, holderColor } from "../HolderAvatar";
import styles from "./SharesStep.module.css";

const sub = (n: number) => String(n).replace(/\d/g, (d) => "₀₁₂₃₄₅₆₇₈₉"[+d]);

/** Step 4: what each participant now holds, and how the shares fit together. */
export function SharesStep({ vault }: { vault: Vault }) {
  const { cfg, shares, vkey } = vault;
  if (!shares || !vkey) return null;
  const all = cfg.rule === "all";

  return (
    <div className={styles.wrap}>
      <div className={styles.eqRow}>
        <code className={styles.eq}>
          {all ? (
            <>
              K ={" "}
              {cfg.holders.map((h, i) => (
                <span key={h.id}>
                  {i > 0 && " ⊕ "}
                  <span style={{ color: holderColor(cfg.holders, h.id) }}>S{sub(i + 1)}</span>
                </span>
              ))}
            </>
          ) : (
            <>
              K = f(0) from any {cfg.k} of{" "}
              {cfg.holders.map((h, i) => (
                <span key={h.id}>
                  {i > 0 && ", "}
                  <span style={{ color: holderColor(cfg.holders, h.id) }}>
                    ({i + 1}, y{sub(i + 1)})
                  </span>
                </span>
              ))}
            </>
          )}
        </code>
        <p className={styles.explain}>
          {all
            ? `⊕ is XOR. Order doesn't matter, and all ${cfg.holders.length} shares are needed.`
            : `Shamir: K is f(0) on a secret curve. Any ${cfg.k} points rebuild it; fewer reveal nothing.`}
        </p>
      </div>

      <div className={styles.shares}>
        {cfg.holders.map((h, i) => {
          const share = shares.find((s) => s.holderId === h.id)!;
          return (
            <motion.article
              key={h.id}
              className={styles.share}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
            >
              <div className={styles.who}>
                <HolderAvatar holder={h} color={holderColor(cfg.holders, h.id)} size={30} />
                <b>{h.name}</b>
                <span className={styles.label} style={{ color: holderColor(cfg.holders, h.id) }}>
                  {all ? `S${sub(i + 1)}` : `(${share.x}, y${sub(i + 1)})`}
                </span>
              </div>
              <code className={styles.shareHex}>{hex(share.bytes, 12)}</code>
            </motion.article>
          );
        })}
      </div>

      <p className={styles.gone}>
        K (<b>{fingerprint(vkey.key)}</b>) is deleted. Only the shares can rebuild it.
      </p>
    </div>
  );
}
