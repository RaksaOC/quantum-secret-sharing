"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { SiteFooter } from "@/components/ui/SiteFooter";
import { SiteHeader } from "@/components/ui/SiteHeader";
import { Stepper } from "@/components/ui/Stepper";
import ui from "@/components/ui/primitives/primitives.module.css";
import { cx } from "@/lib/cx";
import { STEPS, useVault } from "@/lib/demo/useVault";
import { DistributeStep } from "../DistributeStep";
import { EncryptStep } from "../EncryptStep";
import { FileStep } from "../FileStep";
import { ReconstructStep } from "../ReconstructStep";
import { SharesStep } from "../SharesStep";
import { StepNav } from "../StepNav";
import { UnlockStep } from "../UnlockStep";
import styles from "./VaultApp.module.css";

const EASE = [0.22, 1, 0.36, 1] as const;

const INTRO: { title: string; lead: string }[] = [
  { title: "Upload a PDF", lead: "The confidential document to put in the vault." },
  { title: "Encrypt the PDF", lead: "A random 256-bit key K locks the file with AES-256-GCM." },
  { title: "Distribute the key", lead: "GHZ-based quantum secret sharing gives each participant a share of K, and test rounds catch eavesdroppers." },
  { title: "Each participant's share", lead: "One classical share each. No single share is enough to rebuild K." },
  { title: "Reconstruct the key", lead: "The participants combine their shares to recover K." },
  { title: "Unlock the PDF", lead: "The rebuilt key decrypts the document, ready to preview or download." },
];

export function VaultApp() {
  const vault = useVault();
  const { step, go } = vault;
  const kind = STEPS[step].kind;

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.4, ease: EASE }}>
      <div className={styles.shell}>
        <SiteHeader onBrand={vault.restart} />
        <main className={styles.main}>
          <header className={styles.top}>
            <h1>Quantum Secret Sharing</h1>
          </header>
          <div id="vault-steps" className={styles.steps}>
            <Stepper steps={STEPS.map((s) => s.label)} current={step} reachable={vault.reachable} onGo={go} />
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              key={step}
              className={styles.step}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.stepHead}>
                <span className={cx(styles.kind, kind === "quantum" && styles.quantum)}>{kind === "quantum" ? "Quantum" : "Classical"}</span>
                <h2>{INTRO[step].title}</h2>
                <p>{INTRO[step].lead}</p>
              </div>

              {step === 0 && (
                <>
                  <FileStep file={vault.file} onFile={vault.setFile} />
                  <StepNav next={() => go(1)} disabled={!vault.file} />
                </>
              )}
              {step === 1 && (
                <>
                  <EncryptStep vault={vault} />
                  <StepNav onBack={() => go(0)} next={() => go(2)} nextLabel="Distribute the key" disabled={!vault.vkey} />
                </>
              )}
              {step === 2 && (
                <>
                  <DistributeStep vault={vault} />
                </>
              )}
              {step === 3 && (
                <>
                  <SharesStep vault={vault} />
                  <StepNav onBack={() => go(2)} next={() => go(4)} nextLabel="Reconstruct the key" />
                </>
              )}
              {step === 4 && (
                <>
                  <ReconstructStep vault={vault} />
                  <StepNav onBack={() => go(3)} next={() => go(5)} nextLabel="Unlock the PDF" disabled={!vault.result?.ok} />
                </>
              )}
              {step === 5 && (
                <>
                  <UnlockStep vault={vault} />
                  <StepNav
                    onBack={() => go(4)}
                    extra={
                      <button className={ui.textBtn} onClick={vault.restart}>
                        Start over
                      </button>
                    }
                  />
                </>
              )}
            </motion.section>
          </AnimatePresence>
        </main>
        <SiteFooter />
      </div>
    </MotionConfig>
  );
}
