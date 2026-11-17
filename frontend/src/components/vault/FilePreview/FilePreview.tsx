"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ui from "@/components/ui/primitives/primitives.module.css";
import { cx } from "@/lib/cx";
import { fileSize, type FileKind } from "@/lib/demo/files";
import type { VaultFile } from "@/lib/demo/types";
import styles from "./FilePreview.module.css";

const KIND_LABEL: Record<FileKind, string> = { pdf: "PDF", csv: "CSV", text: "TXT", image: "IMG", other: "FILE" };

export function FileIcon({ kind, small }: { kind: FileKind; small?: boolean }) {
  return (
    <span className={cx(styles.icon, small && styles.small)} data-kind={kind} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="M6 2.8h8.2L19 7.6v13.6H6z" />
        <path d="M14 2.8v5h5" />
      </svg>
      <b>{KIND_LABEL[kind]}</b>
    </span>
  );
}

/** Full-screen viewer for the unlocked PDF. Escape or × closes it. */
export function FilePreview({ file, onClose }: { file: VaultFile; onClose: () => void }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const u = URL.createObjectURL(file.blob);
    setUrl(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = before;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return createPortal(
    <motion.div
      className={styles.viewer}
      role="dialog"
      aria-modal="true"
      aria-label={file.name}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className={styles.bar}>
        <FileIcon kind="pdf" small />
        <div className={styles.meta}>
          <b>{file.name}</b>
          <span>{fileSize(file.size)} · decrypted in this browser</span>
        </div>
        {url && (
          <a className={cx(ui.btn, ui.ghost)} href={url} download={file.name}>
            Download
          </a>
        )}
        <button className={styles.close} onClick={onClose} aria-label="Close preview">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
      {url && <iframe className={styles.pdf} src={url} title={file.name} />}
    </motion.div>,
    document.body,
  );
}
