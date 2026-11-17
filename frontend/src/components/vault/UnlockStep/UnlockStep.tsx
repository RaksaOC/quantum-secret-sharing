"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import ui from "@/components/ui/primitives/primitives.module.css";
import { cx } from "@/lib/cx";
import { fileSize } from "@/lib/demo/files";
import { fingerprint } from "@/lib/demo/keys";
import type { Vault } from "@/lib/demo/useVault";
import { FileIcon, FilePreview } from "../FilePreview";
import styles from "./UnlockStep.module.css";

/** Step 6 (classical): the rebuilt K decrypts the PDF (AES-256-GCM), which opens full screen. */
export function UnlockStep({ vault }: { vault: Vault }) {
  const { file, vkey, unlocked } = vault;
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  if (!file || !vkey) return null;

  const decrypt = () => {
    setBusy(true);
    setTimeout(() => {
      vault.unlock();
      setBusy(false);
      setOpen(true);
    }, 900);
  };

  const download = () => {
    const url = URL.createObjectURL(file.blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <section className={styles.card}>
      <span className={styles.icon}>
        <FileIcon kind="pdf" />
      </span>
      <div className={styles.meta}>
        <b>{unlocked ? file.name : `${file.name}.locked`}</b>
        <span>{unlocked ? `${fileSize(file.size)} · decrypted with key ${fingerprint(vkey.key)}` : `AES-256-GCM · rebuilt key ${fingerprint(vkey.key)}`}</span>
      </div>
      {!unlocked ? (
        <button className={cx(ui.btn, ui.primary, styles.go)} onClick={decrypt} disabled={busy}>
          {busy ? "Decrypting…" : "Decrypt and open"}
        </button>
      ) : (
        <div className={styles.actions}>
          <button className={cx(ui.btn, ui.primary, styles.go)} onClick={() => setOpen(true)}>
            Open preview
          </button>
          <button className={cx(ui.btn, ui.ghost, styles.go)} onClick={download}>
            Download
          </button>
        </div>
      )}
      <AnimatePresence>{open && <FilePreview file={file} onClose={() => setOpen(false)} />}</AnimatePresence>
    </section>
  );
}
