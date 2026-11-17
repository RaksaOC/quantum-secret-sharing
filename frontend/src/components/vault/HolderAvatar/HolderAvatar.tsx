import { HOLDER_COLORS } from "@/lib/demo/participants";
import type { Holder } from "@/lib/demo/types";
import styles from "./HolderAvatar.module.css";

export const holderColor = (holders: Holder[], id: string) =>
  HOLDER_COLORS[
    Math.max(
      0,
      holders.findIndex((h) => h.id === id),
    ) % HOLDER_COLORS.length
  ];

export function HolderAvatar({ holder, color, size = 34 }: { holder: Holder; color: string; size?: number }) {
  return (
    <span className={styles.avatar} style={{ background: color, width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">
      {(holder.name.trim()[0] ?? "?").toUpperCase()}
    </span>
  );
}
