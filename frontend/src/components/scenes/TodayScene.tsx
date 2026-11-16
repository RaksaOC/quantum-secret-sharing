"use client";

import { motion } from "motion/react";
import s from "./scenes.module.css";

const TODAY = [
  { name: "HashiCorp Vault", how: "Unseal key split with Shamir: 5 shares, any 3 open it" },
  { name: "DNSSEC root key", how: "ICANN ceremonies: several key holders, in person" },
  { name: "Banks & custody", how: "Dual control on vaults; multi-signature wallets" },
];

const LOOP = { duration: 3, repeat: Infinity, repeatDelay: 0.8, ease: "easeInOut" as const };

export function TodayScene() {
  return (
    <div className={s.scene} style={{ gap: 22 }}>
      <div className={s.today}>
        {TODAY.map((t, i) => (
          <motion.div key={t.name} className={s.todayCard} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.1 }}>
            <strong>{t.name}</strong>
            <span>{t.how}</span>
          </motion.div>
        ))}
      </div>

      <div className={s.panel}>
        <div className={s.panelTitle}>But when a share is handed out over a classical channel…</div>
        <svg viewBox="0 0 440 170" className={s.svg} role="img" aria-label="A share travels from dealer to holder while Eve silently copies it">
          <line x1={64} y1={56} x2={376} y2={56} stroke="var(--ctl)" strokeWidth={1.5} />
          <text x={220} y={40} textAnchor="middle" fontSize={11} fill="var(--muted)">
            TLS · USB drive · courier
          </text>
          {/* dealer + holder */}
          <circle cx={40} cy={56} r={24} fill="var(--card)" />
          <text x={40} y={60} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--ink)">
            Dealer
          </text>
          <circle cx={400} cy={56} r={24} fill="var(--card)" />
          <text x={400} y={60} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--ink)">
            Maya
          </text>
          {/* the share */}
          <motion.g initial={{ x: 0 }} animate={{ x: [0, 296] }} transition={LOOP}>
            <rect x={66} y={47} width={30} height={18} rx={5} fill="var(--accent)" />
            <text x={81} y={60} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--accent-ink)">
              k₁
            </text>
          </motion.g>
          {/* Eve taps the wire */}
          <line x1={220} y1={58} x2={220} y2={116} stroke="var(--bad)" strokeWidth={1.2} strokeDasharray="3 4" />
          <circle cx={220} cy={136} r={22} fill="var(--bad-soft)" stroke="var(--bad)" strokeWidth={1.2} />
          <text x={220} y={140} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--bad)">
            Eve
          </text>
          <motion.g initial={{ y: 0, opacity: 0 }} animate={{ y: [0, 0, 64, 64], opacity: [0, 0.9, 0.9, 0] }} transition={{ ...LOOP, times: [0, 0.48, 0.78, 1] }}>
            <rect x={205} y={47} width={30} height={18} rx={5} fill="none" stroke="var(--accent)" strokeDasharray="3 2" strokeWidth={1.5} />
            <text x={220} y={60} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--accent)">
              k₁
            </text>
          </motion.g>
          <motion.text
            x={258}
            y={140}
            fontSize={11.5}
            fill="var(--muted)"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1, 1, 0] }}
            transition={{ ...LOOP, times: [0, 0.6, 0.72, 0.95, 1] }}
          >
            perfect copy, no trace
          </motion.text>
        </svg>
        <div className={s.chips} style={{ marginTop: 6 }}>
          <span className={`${s.chip} ${s.chipOk}`}>Maya gets her share</span>
          <span className={`${s.chip} ${s.chipBad}`}>Eve keeps a copy</span>
          <span className={`${s.chip} ${s.chipMuted}`}>Alarm raised: none</span>
        </div>
      </div>
    </div>
  );
}
