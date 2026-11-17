"use client";

import type { Holder } from "@/lib/demo/types";
import { holderColor } from "../HolderAvatar";
import styles from "./NetworkDiagram.module.css";

const W = 640,
  H = 330,
  DEALER = { x: W / 2, y: 58 };

/**
 * Dealer at the top, holders below. While `live`, qubits travel down every link (one GHZ state
 * per round sends one qubit to each holder). A tapped link shows Eve sitting on it.
 */
export function NetworkDiagram({ holders, eve, live, failed }: { holders: Holder[]; eve: string | null; live: boolean; failed?: boolean }) {
  const n = holders.length;
  const pos = holders.map((_, i) => ({ x: n === 1 ? W / 2 : 70 + (i * (W - 140)) / (n - 1), y: 252 }));

  return (
    <svg className={styles.svg} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="The dealer sends one qubit of each GHZ state to every holder">
      {holders.map((h, i) => {
        const p = pos[i];
        const tapped = eve === h.id;
        const path = `M${DEALER.x},${DEALER.y} L${p.x},${p.y}`;
        return (
          <g key={h.id}>
            <path d={path} className={tapped ? styles.linkTapped : styles.link} />
            {live &&
              [0, 0.36, 0.72].map((d) => (
                <circle key={d} r="5" className={styles.qubit} style={{ fill: holderColor(holders, h.id) }}>
                  <animateMotion dur="1.1s" begin={`${d + i * 0.05}s`} repeatCount="indefinite" path={path} />
                </circle>
              ))}
          </g>
        );
      })}

      {/* Eve on the tapped link */}
      {eve &&
        (() => {
          const i = holders.findIndex((h) => h.id === eve);
          if (i < 0) return null;
          const x = (DEALER.x + pos[i].x) / 2,
            y = (DEALER.y + pos[i].y) / 2;
          return (
            <g className={styles.eve} transform={`translate(${x},${y})`}>
              <circle r="17" />
              <path d="M-8 0q8-8 16 0q-8 8-16 0Z" className={styles.eye} />
              <circle r="2.8" className={styles.pupil} />
              <text y="34" textAnchor="middle">
                Eve
              </text>
            </g>
          );
        })()}

      {/* dealer */}
      <g transform={`translate(${DEALER.x},${DEALER.y})`} className={styles.dealer}>
        <circle r="26" className={failed ? styles.dealerBad : undefined} />
        <g className={styles.key}>
          <circle cx="-6" cy="0" r="5.5" />
          <path d="M-0.5 0h12m-3.5 0v4.5m-4-4.5v3.5" />
        </g>
        <text y="-36" textAnchor="middle">
          Vault · makes GHZ states
        </text>
      </g>

      {holders.map((h, i) => (
        <g key={h.id} transform={`translate(${pos[i].x},${pos[i].y})`} className={styles.holder}>
          <circle r="22" style={{ fill: holderColor(holders, h.id) }} />
          <text className={styles.initial} y="6" textAnchor="middle">
            {(h.name.trim()[0] ?? "?").toUpperCase()}
          </text>
          <text y="44" textAnchor="middle" className={styles.name}>
            {h.name || "Holder"}
          </text>
          <text y="62" textAnchor="middle" className={styles.role}>
            {h.role}
          </text>
        </g>
      ))}
    </svg>
  );
}
