"use client";

import { motion } from "motion/react";
import { useHealth } from "@/lib/useHealth";
import { cx } from "@/lib/cx";
import s from "./scenes.module.css";

const PAGES = ["Tour", "1 Setup", "2 Distribute", "3 Encrypt", "4 Unlock", "5 Compare", "6 Experiments", "7 K-of-N"];

export function ArchitectureScene() {
  const health = useHealth(6000);
  return (
    <div className={s.scene} style={{ gap: 0 }}>
      <div className={s.arch}>
        <Layer title="Browser · Next.js" path="frontend/src" chips={PAGES} delay={0} />
        <Connector label="/api/* proxy (next.config.ts)" />
        <Layer title="FastAPI" path="backend/app/api → services" chips={["distribution", "vault", "comparison", "experiments", "threshold", "health ✓"]} delay={0.15} />
        <Connector label="services orchestrate" reverse />
        <div className={s.twoCol}>
          <Layer title="Quantum · Qiskit Aer" path="app/quantum" chips={["ghz", "bases", "hbb", "sifting", "eve", "noise"]} delay={0.3} />
          <Layer title="Crypto · cryptography" path="app/crypto" chips={["aes (GCM)", "xor_split", "shamir", "keys"]} delay={0.4} />
        </div>
      </div>
      <motion.div className={s.chips} style={{ marginTop: 16 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        {health.state === "online" ? (
          <>
            <span className={cx(s.chip, s.chipOk)}>Backend online</span>
            <span className={s.chip}>Qiskit {health.data.qiskit}</span>
            <span className={s.chip}>Aer {health.data.qiskit_aer}</span>
            <span className={s.chip}>cryptography {health.data.cryptography}</span>
          </>
        ) : (
          <span className={cx(s.chip, health.state === "offline" ? s.chipBad : s.chipMuted)}>
            {health.state === "offline" ? "Backend offline · run make backend" : "Checking backend…"}
          </span>
        )}
      </motion.div>
    </div>
  );
}

function Layer({ title, path, chips, delay }: { title: string; path: string; chips: string[]; delay: number }) {
  return (
    <motion.div className={s.layer} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
      <div className={s.layerHead}>
        <strong>{title}</strong>
        <span>{path}</span>
      </div>
      <div className={s.layerChips}>
        {chips.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
    </motion.div>
  );
}

function Connector({ label, reverse = false }: { label: string; reverse?: boolean }) {
  return (
    <div className={s.connector}>
      <motion.span className={s.packet} animate={{ top: reverse ? ["100%", "0%"] : ["0%", "100%"], opacity: [0, 1, 1, 0] }} transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.3 }} style={{ marginTop: -4 }} />
      <span className={s.connLabel}>{label}</span>
    </div>
  );
}
