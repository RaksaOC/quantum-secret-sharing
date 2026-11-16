import Link from "next/link";
import { ThemeToggle } from "../ThemeToggle";
import styles from "./SiteHeader.module.css";

export function SiteHeader({ onBrand }: { onBrand?: () => void }) {
  return (
    <header className={styles.header}>
      <Link href="/" className={styles.brand} onClick={onBrand}>
        <BrandMark />
        <span>Quantum Secret Sharing</span>
      </Link>
      <ThemeToggle />
    </header>
  );
}

export function BrandMark() {
  return (
    <svg viewBox="0 0 28 28" width="26" height="26" aria-hidden="true">
      <circle cx="14" cy="14" r="12.5" fill="none" stroke="var(--accent)" strokeWidth="1.5" />
      <circle cx="14" cy="5.5" r="2.4" fill="var(--accent)" />
      <circle cx="6.6" cy="18.3" r="2.4" fill="var(--accent)" />
      <circle cx="21.4" cy="18.3" r="2.4" fill="var(--accent)" />
      <path d="M14 5.5 6.6 18.3h14.8Z" fill="none" stroke="var(--accent)" strokeWidth="1.2" strokeDasharray="2 2" />
    </svg>
  );
}
