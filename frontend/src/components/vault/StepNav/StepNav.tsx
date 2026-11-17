import type { ReactNode } from "react";
import ui from "@/components/ui/primitives/primitives.module.css";
import { cx } from "@/lib/cx";
import styles from "./StepNav.module.css";

/** Back / next row under each step. */
export function StepNav({
  onBack,
  next,
  nextLabel,
  disabled,
  extra,
}: {
  onBack?: () => void;
  next?: () => void;
  nextLabel?: string;
  disabled?: boolean;
  extra?: ReactNode;
}) {
  return (
    <div className={styles.nav}>
      {onBack ? (
        <button className={cx(ui.btn, ui.ghost)} onClick={onBack}>
          Back
        </button>
      ) : (
        <span />
      )}
      <div className={styles.right}>
        {extra}
        {next && (
          <button className={cx(ui.btn, ui.primary)} onClick={next} disabled={disabled}>
            {nextLabel ?? "Continue"}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 12h14m-5-5 5 5-5 5" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
