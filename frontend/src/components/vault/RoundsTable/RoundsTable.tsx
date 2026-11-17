import { cx } from "@/lib/cx";
import type { Round } from "@/lib/demo/protocol";
import type { Holder } from "@/lib/demo/types";
import styles from "./RoundsTable.module.css";

/** The last few rounds: everyone's measurement basis, and what happened to the round. */
export function RoundsTable({ rounds, holders }: { rounds: Round[]; holders: Holder[] }) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Round</th>
            <th title="Measurement basis chosen by the dealer (D) and each holder">
              Bases D · {holders.map((h) => (h.name.trim()[0] ?? "?").toUpperCase()).join(" ")}
            </th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {rounds.map((r) => (
            <tr key={r.index} className={cx(!r.kept && styles.dropped)}>
              <td className={styles.num}>{r.index + 1}</td>
              <td className={styles.bases}>
                {r.bases.map((b, i) => (
                  <span key={i} className={b === "Y" ? styles.y : styles.x}>
                    {b}
                  </span>
                ))}
              </td>
              <td>
                {!r.kept ? (
                  <span className={styles.tag}>odd Y count · dropped</span>
                ) : r.check ? (
                  <span className={cx(styles.tag, r.error ? styles.err : styles.ok)}>{r.error ? "test · mismatch" : "test · match"}</span>
                ) : (
                  <span className={cx(styles.tag, styles.key)}>key bit</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
