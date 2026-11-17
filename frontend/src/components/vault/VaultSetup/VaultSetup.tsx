"use client";

import { Segmented } from "@/components/ui/Segmented";
import ui from "@/components/ui/primitives/primitives.module.css";
import { cx } from "@/lib/cx";
import { CHANNELS, EXTRA_HOLDERS, channelOf, type Channel } from "@/lib/demo/participants";
import type { Rule } from "@/lib/demo/types";
import type { Vault } from "@/lib/demo/useVault";
import { HolderAvatar, holderColor } from "../HolderAvatar";
import styles from "./VaultSetup.module.css";

/** Before distributing: who the participants are, how many must cooperate, and what the channel is like. */
export function VaultSetup({ vault }: { vault: Vault }) {
  const { cfg, setCfg } = vault;
  const n = cfg.holders.length;
  const channel = channelOf(cfg);

  const add = () => {
    const used = new Set(cfg.holders.map((h) => h.name));
    const extra = EXTRA_HOLDERS.find((x) => !used.has(x.name)) ?? { name: `Participant ${n + 1}`, role: "Founder" };
    setCfg({ holders: [...cfg.holders, { ...extra, id: `h${Date.now()}` }] });
  };

  return (
    <div className={styles.setup}>
      <div className={styles.block}>
        <div className={styles.head}>
          <span className={ui.label}>Participants</span>
          <span className={styles.count}>{n}</span>
        </div>
        <ul className={styles.people}>
          {cfg.holders.map((h) => (
            <li key={h.id}>
              <HolderAvatar holder={h} color={holderColor(cfg.holders, h.id)} size={30} />
              <input
                className={cx(ui.input, styles.name)}
                value={h.name}
                onChange={(e) => setCfg({ holders: cfg.holders.map((x) => (x.id === h.id ? { ...x, name: e.target.value } : x)) })}
                aria-label="Participant name"
              />
              <button
                className={styles.remove}
                onClick={() => setCfg({ holders: cfg.holders.filter((x) => x.id !== h.id) })}
                disabled={n <= 2}
                aria-label={`Remove ${h.name}`}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
        <button className={ui.textBtn} onClick={add} disabled={n >= 6}>
          + Add a participant
        </button>
      </div>

      <div className={styles.block}>
        <span className={ui.label}>Who must cooperate</span>
        <Segmented<Rule>
          value={cfg.rule}
          options={[
            { value: "all", label: `All ${n}` },
            { value: "threshold", label: "Any k (Shamir)" },
          ]}
          onChange={(rule) => setCfg({ rule })}
          label="Access policy"
        />
        {cfg.rule === "threshold" && (
          <div className={styles.k}>
            <span>Shares needed</span>
            <div className={styles.stepper}>
              <button onClick={() => setCfg({ k: cfg.k - 1 })} disabled={cfg.k <= 2} aria-label="Fewer">
                −
              </button>
              <b>
                {cfg.k} of {n}
              </b>
              <button onClick={() => setCfg({ k: cfg.k + 1 })} disabled={cfg.k >= n} aria-label="More">
                +
              </button>
            </div>
          </div>
        )}
      </div>

      <div className={styles.block}>
        <span className={ui.label}>Channel</span>
        <Segmented<Channel> value={channel} options={CHANNELS} onChange={vault.setChannel} label="Channel" />
        <span className={styles.note}>
          {channel === "eve"
            ? `Eve measures the qubits going to ${cfg.holders.find((h) => h.id === cfg.eve)?.name ?? "a participant"}.`
            : CHANNELS.find((c) => c.value === channel)?.note}
        </span>
      </div>
    </div>
  );
}
