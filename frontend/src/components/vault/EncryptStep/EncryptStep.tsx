"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import ui from "@/components/ui/primitives/primitives.module.css";
import { cx } from "@/lib/cx";
import { fileSize } from "@/lib/demo/files";
import { fingerprint, hex } from "@/lib/demo/keys";
import type { Vault } from "@/lib/demo/useVault";
import { FileIcon } from "../FilePreview";
import styles from "./EncryptStep.module.css";

/** Step 2 (classical): make a random 256-bit key K and lock the PDF with AES-256-GCM. */
export function EncryptStep({ vault }: { vault: Vault }) {
  const { file, vkey } = vault;
  const [busy, setBusy] = useState(false);
  if (!file) return null;

  const run = () => {
    setBusy(true);
    setTimeout(() => {
      vault.encrypt();
      setBusy(false);
    }, 1100);
  };

  return (
    <div className={styles.grid}>
      <section className={styles.card}>
        <div className={styles.file}>
          <span className={styles.icon}>
            <FileIcon kind="pdf" />
            <AnimatePresence>
              {vkey && (
                <motion.svg className={styles.lock} initial={{ scale: 0 }} animate={{ scale: 1 }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7 10V7.5a5 5 0 0 1 10 0V10h1a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 18 21H6a1.5 1.5 0 0 1-1.5-1.5v-8A1.5 1.5 0 0 1 6 10Zm2 0h6V7.5a3 3 0 0 0-6 0Z" />
                </motion.svg>
              )}
            </AnimatePresence>
          </span>
          <div className={styles.meta}>
            <b>{vkey ? `${file.name}.locked` : file.name}</b>
            <span>{vkey ? `${fileSize(file.size + 28)} · AES-256-GCM` : `${fileSize(file.size)} · not encrypted yet`}</span>
          </div>
        </div>
        {!vkey ? (
          <button className={cx(ui.btn, ui.primary, styles.go)} onClick={run} disabled={busy}>
            {busy ? "Encrypting…" : "Generate a key and encrypt"}
          </button>
        ) : (
          <dl className={styles.dl}>
            <dt>nonce</dt>
            <dd>{hex(vkey.nonce)}</dd>
            <dt>data</dt>
            <dd>{hex(vkey.cipherHead, 12)}</dd>
            <dt>tag</dt>
            <dd>{hex(vkey.tag, 8)}</dd>
          </dl>
        )}
        {busy && <div className={styles.bar} aria-hidden="true" />}
      </section>

      <section className={styles.card}>
        <span className={styles.label}>Encryption key K · 256 bits</span>
        {vkey ? (
          <>
            <motion.code className={styles.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {hex(vkey.key)}
            </motion.code>
            <p className={styles.note}>
              Fingerprint <b>{fingerprint(vkey.key)}</b>. The PDF is now unreadable without K. Next, K has to reach the participants without anyone being able
              to copy it on the way.
            </p>
          </>
        ) : (
          <p className={styles.note}>
            A random 256-bit key K is generated and used with AES-256-GCM. GCM also adds a tag: if the key is wrong or a byte of the file changed, decryption
            refuses instead of returning garbage.
          </p>
        )}
      </section>
    </div>
  );
}
