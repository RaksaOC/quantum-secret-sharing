"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ui from "@/components/ui/primitives/primitives.module.css";
import { cx } from "@/lib/cx";
import { THRESHOLD, TOTAL_ROUNDS, summarise } from "@/lib/demo/protocol";
import type { Vault } from "@/lib/demo/useVault";
import { ErrorGauge } from "../ErrorGauge";
import { NetworkDiagram } from "../NetworkDiagram";
import { RoundsTable } from "../RoundsTable";
import { StepNav } from "../StepNav";
import { VaultSetup } from "../VaultSetup";
import styles from "./DistributeStep.module.css";

const PLAY_MS = 4800;

/** Step 3 (quantum): run the (simulated) GHZ secret-sharing protocol and check the test rounds for a spy. */
export function DistributeStep({ vault }: { vault: Vault }) {
  const { cfg, dist } = vault;
  const [shown, setShown] = useState(dist ? TOTAL_ROUNDS : 0);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  useEffect(() => {
    if (!dist) setShown(0);
  }, [dist]);

  const start = () => {
    vault.distributeKey();
    setShown(0);
    setPlaying(true);
    const t0 = performance.now();
    const tick = () => {
      const t = Math.min(1, (performance.now() - t0) / PLAY_MS);
      // ease-out so the counters slow down at the end
      setShown(Math.round((1 - (1 - t) ** 2) * TOTAL_ROUNDS));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const seen = dist ? summarise(dist.rounds.slice(0, shown), cfg) : null;
  const done = !!dist && !playing && shown >= TOTAL_ROUNDS;
  const last = dist ? dist.rounds.slice(Math.max(0, shown - 7), shown).reverse() : [];

  return (
    <>
      <div className={styles.grid}>
        <section className={styles.stage}>
          <NetworkDiagram holders={cfg.holders} eve={cfg.eve} live={playing} failed={done && dist?.aborted} />
          <ul className={styles.facts}>
            <li>
              <b>Each round</b> the vault makes one GHZ state, (|0…0⟩ + |1…1⟩)/√2, over {cfg.holders.length + 1} qubits and sends one to each participant.
              Everyone measures in a random basis, X or Y.
            </li>
            <li>
              <b>Kept rounds</b> (an even number of Y bases) give correlated results that build the shares. 1 in 4 kept rounds is a <b>test round</b> whose
              results are compared in public.
            </li>
            <li>
              <b>Why quantum?</b> A qubit can&apos;t be copied. Anyone who measures it on the way breaks the GHZ correlation, so about 25% of test rounds
              disagree. Error rate e = mismatched tests ÷ tests; above {THRESHOLD * 100}% the key is not shared.
            </li>
          </ul>
        </section>

        <section className={styles.panel}>
          {!dist && !playing ? (
            <div className={styles.intro}>
              <VaultSetup vault={vault} />
              <button className={cx(ui.btn, ui.primary, styles.go)} onClick={start} disabled={cfg.holders.some((h) => !h.name.trim())}>
                Distribute the key
              </button>
            </div>
          ) : (
            seen && (
              <div className={styles.live}>
                <div className={styles.stats}>
                  <Stat label="Rounds" value={`${shown}`} sub={`of ${TOTAL_ROUNDS}`} />
                  <Stat label="Kept" value={`${seen.kept}`} sub="even Y count" />
                  <Stat label="Tests" value={`${seen.checks}`} sub={`${seen.errors} mismatched`} />
                </div>
                <ErrorGauge rate={seen.errorRate} checks={seen.checks} />
                <p className={styles.eq}>
                  <code>
                    e = mismatched tests ÷ tests = {seen.errors} ÷ {seen.checks || 0}
                  </code>
                </p>
                <RoundsTable rounds={last} holders={cfg.holders} />
              </div>
            )
          )}

          <AnimatePresence>
            {done && dist && (
              <motion.div
                className={cx(styles.verdict, dist.aborted ? styles.bad : styles.good)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {dist.reason === "ok" && (
                  <>
                    <b>Distribution accepted</b>
                    <p>
                      e = {(dist.errorRate * 100).toFixed(1)}%, under the {THRESHOLD * 100}% limit, so nobody was listening. Each participant now holds a share
                      of K.
                    </p>
                  </>
                )}
                {dist.reason === "spy" && (
                  <>
                    <b>Eavesdropper detected · aborted</b>
                    <p>
                      e = {(dist.errorRate * 100).toFixed(1)}%, close to the 25% a measuring spy causes. The distribution is aborted, so no shares are handed
                      out and Eve learns nothing.
                    </p>
                    <div className={styles.actions}>
                      <button className={cx(ui.btn, ui.primary)} onClick={() => vault.setChannel("normal")}>
                        Remove the spy
                      </button>
                      <button className={cx(ui.btn, ui.ghost)} onClick={start}>
                        Try again
                      </button>
                    </div>
                  </>
                )}
                {dist.reason === "noise" && (
                  <>
                    <b>Too noisy to trust · aborted</b>
                    <p>
                      e = {(dist.errorRate * 100).toFixed(1)}%, over {THRESHOLD * 100}%. Noise and a spy look the same, so the protocol plays safe and aborts.
                    </p>
                    <div className={styles.actions}>
                      <button className={cx(ui.btn, ui.primary)} onClick={() => vault.setChannel("normal")}>
                        Use a clean channel
                      </button>
                      <button className={cx(ui.btn, ui.ghost)} onClick={start}>
                        Try again
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
      <StepNav onBack={() => vault.go(1)} next={() => vault.go(3)} nextLabel="See the shares" disabled={!done || !vault.shares} />
    </>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className={styles.stat}>
      <span>{label}</span>
      <b>{value}</b>
      <i>{sub}</i>
    </div>
  );
}
