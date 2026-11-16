"use client";

import { motion } from "motion/react";
import s from "./scenes.module.css";

const CX = 220;
const CY = 165;
const R = 122;
const LABELS = ["P1", "P2", "P3", "P4", "P5", "PN"];
const NODES = LABELS.map((label, i) => {
  const a = -Math.PI / 2 + (i * 2 * Math.PI) / LABELS.length;
  return { label, x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
});

export function IntroScene() {
  return (
    <div className={s.scene}>
      <svg viewBox="0 0 440 330" className={s.svg} role="img" aria-label="A vault at the centre, linked to N participants by entangled qubits">
        {/* entanglement ring */}
        <motion.polygon
          points={NODES.map((n) => `${n.x},${n.y}`).join(" ")}
          fill="none"
          stroke="var(--accent)"
          strokeOpacity={0.45}
          strokeWidth={1.5}
          strokeDasharray="3 7"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, strokeDashoffset: [0, -40] }}
          transition={{ opacity: { delay: 0.9, duration: 0.6 }, strokeDashoffset: { repeat: Infinity, duration: 2.4, ease: "linear" } }}
        />
        {/* spokes */}
        {NODES.map((n, i) => (
          <motion.line
            key={`l${i}`}
            x1={CX}
            y1={CY}
            x2={n.x}
            y2={n.y}
            stroke="var(--ctl)"
            strokeWidth={1.2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.25 + i * 0.07, duration: 0.6 }}
          />
        ))}
        {/* shares travelling out */}
        {NODES.map((n, i) => (
          <motion.circle
            key={`p${i}`}
            r={4}
            fill="var(--accent)"
            initial={{ cx: CX, cy: CY, opacity: 0 }}
            animate={{ cx: [CX, n.x], cy: [CY, n.y], opacity: [0, 1, 1, 0] }}
            transition={{ duration: 1.6, delay: 1 + i * 0.22, repeat: Infinity, repeatDelay: 1.6, ease: "easeInOut" }}
          />
        ))}
        {/* vault pulse */}
        {[0, 1].map((k) => (
          <motion.circle
            key={`pulse${k}`}
            cx={CX}
            cy={CY}
            fill="none"
            stroke="var(--accent)"
            initial={{ r: 44, opacity: 0.5 }}
            animate={{ r: [44, 84], opacity: [0.45, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, delay: k * 1.3, ease: "easeOut" }}
          />
        ))}
        <motion.g initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ originX: `${CX}px`, originY: `${CY}px` }}>
          <circle cx={CX} cy={CY} r={44} fill="var(--bg)" stroke="var(--accent)" strokeWidth={2} />
          <g transform={`translate(${CX} ${CY + 2})`} stroke="var(--accent)" strokeWidth={2.4} fill="none" strokeLinecap="round">
            <rect x={-13} y={-4} width={26} height={19} rx={4} fill="var(--accent)" />
            <path d="M-8 -4 v-6 a8 8 0 0 1 16 0 v6" />
          </g>
        </motion.g>
        {/* participants */}
        {NODES.map((n, i) => (
          <motion.g
            key={n.label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.07, type: "spring", stiffness: 260, damping: 18 }}
          >
            <circle cx={n.x} cy={n.y} r={21} fill="var(--bg)" stroke="var(--ink)" strokeWidth={1.4} />
            <text x={n.x} y={n.y + 4.5} textAnchor="middle" fontSize={12.5} fontWeight={600} fill="var(--ink)">
              {n.label}
            </text>
          </motion.g>
        ))}
      </svg>
      <div className={s.chips}>
        <span className={s.chip}>N = 3, 5, 10 … holders</span>
        <span className={s.chip}>N + 1 entangled qubits</span>
        <span className={`${s.chip} ${s.chipAccent}`}>1 key nobody holds alone</span>
      </div>
    </div>
  );
}
