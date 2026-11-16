"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { cx } from "@/lib/cx";
import { useTicker } from "@/lib/useTicker";
import s from "./scenes.module.css";

const EXT = [
  { id: "a", name: "Spy detection", size: "Core", body: "Random X/Y bases, check rounds and an abort threshold. Eve intercepts and resends inside the simulation." },
  { id: "b", name: "K-of-N threshold", size: "Medium", body: "Hybrid: Shamir lets any K of N recover, and each Shamir share travels over a GHZ-protected link, so copying it during hand-out is still detectable." },
  { id: "c", name: "Scaling N", size: "Small", body: "Run N = 3, 5, 8, 10 and plot qubits, circuit depth, error rate under noise and time per round." },
  { id: "d", name: "Noise", size: "Small", body: "Aer depolarising and readout noise. Plot error rate against noise level and find where the protocol has to abort." },
  { id: "e", name: "Dishonest holder", size: "Stretch", body: "One holder lies about their basis or result. The check rounds catch that too." },
] as const;

type ExtId = (typeof EXT)[number]["id"];

export function ExtensionsScene() {
  const [active, setActive] = useState<ExtId>("a");
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    if (pinned) return;
    const id = window.setInterval(() => setActive((a) => EXT[(EXT.findIndex((e) => e.id === a) + 1) % EXT.length].id), 4000);
    return () => window.clearInterval(id);
  }, [pinned]);

  const ext = EXT.find((e) => e.id === active)!;

  return (
    <div className={s.scene}>
      <div className={s.ext}>
        <div className={s.extList} role="tablist" aria-label="Extensions">
          {EXT.map((e) => (
            <button
              key={e.id}
              role="tab"
              aria-selected={e.id === active}
              className={cx(s.extItem, e.id === active && s.extActive)}
              onClick={() => {
                setPinned(true);
                setActive(e.id);
              }}
            >
              {e.id === active && <motion.span layoutId="ext-bg" className={s.extBg} />}
              <span className={s.extLetter}>{e.id}</span>
              <span>{e.name}</span>
              <span className={s.size}>{e.size}</span>
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={active} className={cx(s.panel, s.extDetail)} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.3 }}>
            <h3>{ext.name}</h3>
            <p>{ext.body}</p>
            <Visual id={active} />
          </motion.div>
        </AnimatePresence>
      </div>
      <p className={s.caption}>Charts are sketches of the expected shape. The real numbers will come from the backend's experiment endpoints.</p>
    </div>
  );
}

function Visual({ id }: { id: ExtId }) {
  if (id === "a") return <Bars data={[{ l: "no spy", v: 1 }, { l: "noise 5%", v: 7 }, { l: "spy", v: 25 }]} max={30} threshold={11} unit="%" />;
  if (id === "b") return <Threshold />;
  if (id === "c") return <Bars data={[{ l: "N=3", v: 4 }, { l: "N=5", v: 6 }, { l: "N=8", v: 9 }, { l: "N=10", v: 11 }]} max={12} unit=" qubits" />;
  if (id === "d") return <NoiseLine />;
  return <Liar />;
}

function Bars({ data, max, threshold, unit }: { data: { l: string; v: number }[]; max: number; threshold?: number; unit: string }) {
  const W = 260;
  const H = 120;
  const bw = W / data.length - 18;
  return (
    <svg viewBox={`0 0 ${W} ${H + 22}`} className={s.svg}>
      {threshold !== undefined && (
        <>
          <line x1={0} x2={W} y1={H - (threshold / max) * H} y2={H - (threshold / max) * H} stroke="var(--bad)" strokeDasharray="4 4" strokeWidth={1.2} />
          <text x={0} y={H - (threshold / max) * H - 4} fontSize={9} fill="var(--bad)">
            abort {threshold}%
          </text>
        </>
      )}
      {data.map((d, i) => {
        const h = (d.v / max) * H;
        const x = i * (W / data.length) + 9;
        return (
          <g key={d.l}>
            <motion.rect x={x} width={bw} rx={5} fill={threshold !== undefined && d.v > threshold ? "var(--bad)" : "var(--accent)"} initial={{ height: 0, y: H }} animate={{ height: h, y: H - h }} transition={{ delay: i * 0.1, type: "spring", stiffness: 120, damping: 16 }} />
            <text x={x + bw / 2} y={H - h - 5} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--ink)">
              {d.v}
              {unit === "%" ? "%" : ""}
            </text>
            <text x={x + bw / 2} y={H + 15} textAnchor="middle" fontSize={10} fill="var(--muted)">
              {d.l}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Threshold() {
  const t = useTicker(1100, 5);
  const sets = [[0, 3], [1, 2, 4], [0, 1, 3, 4], [2], [0, 2, 3]];
  const on = sets[t];
  const open = on.length >= 3;
  return (
    <div style={{ display: "grid", gap: 10, justifyItems: "center" }}>
      <div style={{ display: "flex", gap: 10 }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.span
            key={i}
            className={s.avatar}
            animate={{ backgroundColor: on.includes(i) ? "var(--accent)" : "var(--card)", color: on.includes(i) ? "var(--accent-ink)" : "var(--muted)", scale: on.includes(i) ? 1.05 : 1 }}
            style={{ width: 38, height: 38, fontSize: "0.8rem" }}
          >
            P{i + 1}
          </motion.span>
        ))}
      </div>
      <motion.span key={t} className={cx(s.chip, open ? s.chipOk : s.chipBad)} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
        {on.length} of 5 present · {open ? "unlocked (K = 3)" : "locked"}
      </motion.span>
    </div>
  );
}

function NoiseLine() {
  const pts = [0, 1, 2, 4, 6, 8, 10].map((n) => ({ x: n, y: Math.min(28, n * 1.55 + n * n * 0.05) }));
  const W = 260;
  const H = 120;
  const sx = (x: number) => (x / 10) * (W - 20) + 10;
  const sy = (y: number) => H - (y / 30) * H;
  const d = pts.map((p, i) => `${i ? "L" : "M"}${sx(p.x)} ${sy(p.y)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H + 22}`} className={s.svg}>
      <line x1={0} x2={W} y1={sy(11)} y2={sy(11)} stroke="var(--bad)" strokeDasharray="4 4" strokeWidth={1.2} />
      <text x={W} y={sy(11) - 4} textAnchor="end" fontSize={9} fill="var(--bad)">
        abort 11%
      </text>
      <motion.path d={d} fill="none" stroke="var(--accent)" strokeWidth={2.2} strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2 }} />
      {pts.map((p, i) => (
        <motion.circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={3.2} fill={p.y > 11 ? "var(--bad)" : "var(--accent)"} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.15 * i }} />
      ))}
      <text x={10} y={H + 16} fontSize={10} fill="var(--muted)">
        noise 0%
      </text>
      <text x={W - 10} y={H + 16} textAnchor="end" fontSize={10} fill="var(--muted)">
        10% depolarising
      </text>
    </svg>
  );
}

function Liar() {
  const t = useTicker(1300, 4);
  return (
    <div style={{ display: "grid", gap: 10, justifyItems: "center" }}>
      <div style={{ display: "flex", gap: 14 }}>
        {["Maya", "Dara", "Lina"].map((n, i) => (
          <div key={n} style={{ display: "grid", justifyItems: "center", gap: 4 }}>
            <motion.span className={s.avatar} animate={{ backgroundColor: i === 1 && t >= 1 ? "var(--bad)" : "var(--card)", color: i === 1 && t >= 1 ? "#fff" : "var(--ink)" }}>
              {n[0]}
            </motion.span>
            <span style={{ fontSize: "0.72rem", color: i === 1 && t >= 1 ? "var(--bad)" : "var(--muted)" }}>{i === 1 && t >= 1 ? "says Y, used X" : n}</span>
          </div>
        ))}
      </div>
      <motion.span className={cx(s.chip, t >= 2 ? s.chipBad : s.chipMuted)} animate={{ opacity: 1 }}>
        {t >= 2 ? "check rounds: parity broken → caught" : "check rounds running…"}
      </motion.span>
    </div>
  );
}
