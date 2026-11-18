"use client";

import { useState } from "react";
import { Onboarding } from "@/components/onboarding/Onboarding";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const [tour, setTour] = useState(false);
  return (
    <footer className={styles.footer}>
      <button type="button" className={styles.link} onClick={() => setTour(true)}>
        How it works
      </button>
      <span aria-hidden="true">·</span>
      <span className={styles.demo} title="Nothing quantum or cryptographic runs in this preview. Every number is simulated in the browser.">
        Demo · simulated
      </span>
      {tour && <Onboarding onClose={() => setTour(false)} />}
    </footer>
  );
}
