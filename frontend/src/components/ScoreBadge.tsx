export function directionClasses(direction: string): string {
  switch (direction) {
    case "Bullish":
      return "bg-emerald-500/15 text-emerald-400 border-emerald-500/40";
    case "Bearish":
      return "bg-red-500/15 text-red-400 border-red-500/40";
    default:
      return "bg-amber-500/15 text-amber-400 border-amber-500/40";
  }
}

export function DirectionBadge({ direction }: { direction: string }) {
  return (
    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${directionClasses(direction)}`}>
      {direction}
    </span>
  );
}

export function ScoreBar({ label, value, tone }: { label: string; value: number; tone: "bull" | "bear" | "neutral" }) {
  const color = tone === "bull" ? "bg-emerald-500" : tone === "bear" ? "bg-red-500" : "bg-amber-500";
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>{label}</span>
        <span>{value.toFixed(0)}</span>
      </div>
      <div className="h-2 rounded bg-slate-800 overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}
