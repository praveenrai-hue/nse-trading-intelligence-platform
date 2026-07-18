"use client";

import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  ComposedChart,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Candle, SmartMoney } from "@/lib/types";

type OverlayKey =
  | "structure"
  | "shifts"
  | "liquidity"
  | "fvg"
  | "orderBlocks"
  | "volumeImbalance"
  | "breakouts";

const OVERLAY_LABELS: Record<OverlayKey, string> = {
  structure: "Structure (HH/HL/LH/LL)",
  shifts: "BOS / CHoCH",
  liquidity: "Liquidity Sweeps",
  fvg: "Fair Value Gaps",
  orderBlocks: "Order Blocks",
  volumeImbalance: "Volume Imbalance",
  breakouts: "Range Breakouts",
};

function dirColor(direction: string | null | undefined): string {
  if (direction === "bullish") return "#10b981";
  if (direction === "bearish") return "#ef4444";
  return "#eab308";
}

export default function PriceChart({ candles, sm }: { candles: Candle[]; sm: SmartMoney | null }) {
  const [enabled, setEnabled] = useState<Record<OverlayKey, boolean>>({
    structure: true,
    shifts: true,
    liquidity: true,
    fvg: true,
    orderBlocks: true,
    volumeImbalance: false,
    breakouts: true,
  });

  const data = useMemo(() => candles.map((c, i) => ({ idx: i, ...c })), [candles]);
  const lastIdx = data.length - 1;

  const domain = useMemo(() => {
    if (!candles.length) return [0, 1] as [number, number];
    const lows = candles.map((c) => c.low);
    const highs = candles.map((c) => c.high);
    const min = Math.min(...lows);
    const max = Math.max(...highs);
    const pad = (max - min) * 0.05 || 1;
    return [min - pad, max + pad] as [number, number];
  }, [candles]);

  const toggle = (k: OverlayKey) => setEnabled((e) => ({ ...e, [k]: !e[k] }));

  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <div className="mb-3 flex flex-wrap gap-3 text-xs">
        {(Object.keys(OVERLAY_LABELS) as OverlayKey[]).map((k) => (
          <label key={k} className="flex items-center gap-1.5 cursor-pointer select-none text-slate-300">
            <input type="checkbox" checked={enabled[k]} onChange={() => toggle(k)} className="accent-emerald-500" />
            {OVERLAY_LABELS[k]}
          </label>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={420}>
        <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="idx" type="number" domain={[0, lastIdx]} tick={{ fill: "#64748b", fontSize: 11 }} />
          <YAxis domain={domain} tick={{ fill: "#64748b", fontSize: 11 }} width={60} allowDecimals />
          <Tooltip
            contentStyle={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 8 }}
            labelFormatter={(v) => `Candle #${v}`}
          />

          {/* Fair Value Gaps */}
          {enabled.fvg &&
            sm?.fair_value_gaps.map((z, i) => (
              <ReferenceArea
                key={`fvg-${i}`}
                x1={z.index}
                x2={lastIdx}
                y1={z.bottom}
                y2={z.top}
                fill={dirColor(z.direction)}
                fillOpacity={z.filled ? 0.05 : 0.14}
                stroke="none"
              />
            ))}

          {/* Order Blocks */}
          {enabled.orderBlocks &&
            sm?.order_blocks.map((z, i) => (
              <ReferenceArea
                key={`ob-${i}`}
                x1={Math.max(0, z.index - 1)}
                x2={Math.min(lastIdx, z.index + 3)}
                y1={z.bottom}
                y2={z.top}
                fill={dirColor(z.direction)}
                fillOpacity={0.22}
                stroke={dirColor(z.direction)}
                strokeOpacity={0.5}
              />
            ))}

          {/* Volume Imbalance */}
          {enabled.volumeImbalance &&
            sm?.volume_imbalances.map((z, i) => (
              <ReferenceArea
                key={`vi-${i}`}
                x1={Math.max(0, z.index - 0.4)}
                x2={z.index + 0.4}
                y1={z.bottom}
                y2={z.top}
                fill="#a855f7"
                fillOpacity={0.3}
                stroke="none"
              />
            ))}

          {/* Compression ranges + breakouts */}
          {enabled.breakouts &&
            sm?.breakouts.map((z, i) =>
              z.type === "compression" ? (
                <ReferenceArea
                  key={`cmp-${i}`}
                  x1={Math.max(0, z.index - 10)}
                  x2={z.index}
                  y1={z.range_low ?? domain[0]}
                  y2={z.range_high ?? domain[1]}
                  fill="#38bdf8"
                  fillOpacity={0.08}
                  stroke="#38bdf8"
                  strokeOpacity={0.3}
                  strokeDasharray="4 4"
                />
              ) : (
                <ReferenceLine
                  key={`brk-${i}`}
                  x={z.index}
                  stroke={dirColor(z.direction)}
                  strokeWidth={2}
                  label={{ value: "Breakout", fill: dirColor(z.direction), fontSize: 10, position: "top" }}
                />
              ),
            )}

          {/* Close price line */}
          <Line type="monotone" dataKey="close" stroke="#e2e8f0" dot={false} strokeWidth={1.5} isAnimationActive={false} />

          {/* Market structure swing points */}
          {enabled.structure &&
            sm?.structure.swing_points.map((p, i) => {
              const bullish = p.type === "HH" || p.type === "HL";
              return (
                <ReferenceDot
                  key={`sw-${i}`}
                  x={p.index}
                  y={p.price}
                  r={3}
                  fill={bullish ? "#10b981" : "#ef4444"}
                  stroke="none"
                  label={{ value: p.type, fontSize: 9, fill: "#94a3b8", position: bullish ? "top" : "bottom" }}
                />
              );
            })}

          {/* BOS / CHoCH */}
          {enabled.shifts &&
            sm?.structure.shifts.map((s, i) => (
              <ReferenceLine
                key={`shift-${i}`}
                y={s.price}
                stroke={dirColor(s.direction)}
                strokeDasharray="6 3"
                label={{ value: s.type, fill: dirColor(s.direction), fontSize: 10, position: "right" }}
              />
            ))}

          {/* Liquidity sweeps */}
          {enabled.liquidity &&
            sm?.liquidity.zones.map((z, i) => (
              <ReferenceDot
                key={`liq-${i}`}
                x={z.index}
                y={z.price}
                r={4}
                fill="none"
                stroke={dirColor(z.direction)}
                strokeWidth={2}
                label={{
                  value: z.type === "stop_hunt" ? "SH" : z.type === "equal_highs" ? "EQH" : "EQL",
                  fontSize: 9,
                  fill: "#cbd5e1",
                  position: "insideTopRight",
                }}
              />
            ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
