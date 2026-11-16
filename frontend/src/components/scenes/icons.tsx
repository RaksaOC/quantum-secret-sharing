export function LockIcon({ open = false, size = 16 }: { open?: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
      <rect x={4} y={9} width={12} height={9} rx={2.2} fill="currentColor" stroke="none" />
      <path d={open ? "M6.5 9V6a3.5 3.5 0 0 1 6.8-1.2" : "M6.5 9V6a3.5 3.5 0 0 1 7 0v3"} />
    </svg>
  );
}

export function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      <path d="m4.5 10.5 3.5 3.5 7.5-8" />
    </svg>
  );
}

export function AlertIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
      <circle cx={10} cy={10} r={7.5} />
      <path d="M10 6v4.6M10 13.6v.1" />
    </svg>
  );
}
