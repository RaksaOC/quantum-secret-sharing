"use client";

import { useMemo, useRef, useState } from "react";
import ui from "@/components/ui/primitives/primitives.module.css";
import { cx } from "@/lib/cx";
import { SAMPLE_FILES, fileKind, fileSize, fromFile } from "@/lib/demo/files";
import type { VaultFile } from "@/lib/demo/types";
import { FileIcon } from "../FilePreview";
import styles from "./FileStep.module.css";

/** Step 1: the PDF to put in the vault. */
export function FileStep({ file, onFile }: { file: VaultFile | null; onFile: (f: VaultFile | null) => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const take = (f: File | undefined) => {
    if (!f) return;
    try {
      onFile(fromFile(f));
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "That file couldn't be opened.");
    }
  };
  const samples = useMemo(() => SAMPLE_FILES.map((s) => ({ id: s.id, label: s.label, file: s.make() })), []);

  return (
    <div className={styles.wrap}>
      {file ? (
        <div className={styles.picked}>
          <FileIcon kind={fileKind(file)} />
          <div className={styles.meta}>
            <b>{file.name}</b>
            <span>{fileSize(file.size)} · ready to encrypt</span>
          </div>
          <button className={ui.textBtn} onClick={() => onFile(null)}>
            Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={cx(styles.drop, drag && styles.drag, error && styles.bad)}
          onClick={() => input.current?.click()}
          onDragOver={(e) => (e.preventDefault(), setDrag(true))}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            take(e.dataTransfer.files[0]);
          }}
        >
          <span className={styles.icon} aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="10.5" width="14" height="10" rx="2.2" />
              <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" />
            </svg>
          </span>
          <strong>{drag ? "Drop it here" : "Upload a confidential PDF"}</strong>
          <span className={styles.hint}>A contract, a report, board minutes. It stays in this browser.</span>
          {error && <span className={styles.error}>{error}</span>}
        </button>
      )}
      <input
        ref={input}
        type="file"
        accept="application/pdf,.pdf"
        hidden
        onChange={(e) => {
          take(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {!file && (
        <div className={styles.samples}>
          <span className={styles.label}>Or use a sample PDF</span>
          <div className={styles.row}>
            {samples.map(({ id, label, file: f }) => {
              return (
                <button key={id} type="button" className={styles.sample} onClick={() => onFile(f)}>
                  <FileIcon kind={fileKind(f)} small />
                  <span>
                    <b>{label}</b>
                    <i>{f.name}</i>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
