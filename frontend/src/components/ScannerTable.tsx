"use client";

import Link from "next/link";
import type { ScanRow } from "@/lib/types";
import { DirectionBadge, directionClasses } from "./ScoreBadge";

function rowTone(direction: string): string {
  switch (direction) {
    case "Bullish":
      return "border-l-emerald-500";
    case "Bearish":
      return "border-l-red-500";
    default:
      return "border-l-amber-500";
  }
}

export default function ScannerTable({ rows }: { rows: ScanRow[] }) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900 text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left">Symbol</th>
              <th className="px-4 py-3 text-right">Spot</th>
              <th className="px-4 py-3 text-right">Bull</th>
              <th className="px-4 py-3 text-right">Bear</th>
              <th className="px-4 py-3 text-center">Direction</th>
              <th className="px-4 py-3 text-right">Confidence</th>
              <th className="px-4 py-3 text-left">Structure</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {rows.map((r) => (
              <tr key={r.symbol} className={`border-l-4 ${rowTone(r.direction)} hover:bg-slate-900/50`}>
                <td className="px-4 py-3 font-medium">
                  <Link href={`/symbol/${r.symbol}`} className="hover:text-emerald-400">
                    {r.symbol}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right tabular-nums">
                  {r.spot_price != null ? r.spot_price.toLocaleString() : "—"}
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-emerald-400">{r.bullish_score.toFixed(0)}</td>
                <td className="px-4 py-3 text-right tabular-nums text-red-400">{r.bearish_score.toFixed(0)}</td>
                <td className="px-4 py-3 text-center">
                  <DirectionBadge direction={r.direction} />
                </td>
                <td className="px-4 py-3 text-right tabular-nums">{r.confidence_score.toFixed(0)}%</td>
                <td className="px-4 py-3 text-slate-300">{r.structure_bias}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="grid gap-3 md:hidden">
        {rows.map((r) => (
          <Link
            key={r.symbol}
            href={`/symbol/${r.symbol}`}
            className={`block rounded-lg border border-slate-800 border-l-4 ${rowTone(r.direction)} p-4 ${directionClasses(
              r.direction,
            )} bg-slate-900/40`}
          >
            <div className="flex items-center justify-between">
              <span className="text-base font-semibold text-slate-100">{r.symbol}</span>
              <DirectionBadge direction={r.direction} />
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs text-slate-300">
              <div>
                <div className="text-slate-500">Spot</div>
                <div className="tabular-nums">{r.spot_price != null ? r.spot_price.toLocaleString() : "—"}</div>
              </div>
              <div>
                <div className="text-slate-500">Bull / Bear</div>
                <div className="tabular-nums">
                  <span className="text-emerald-400">{r.bullish_score.toFixed(0)}</span> /{" "}
                  <span className="text-red-400">{r.bearish_score.toFixed(0)}</span>
                </div>
              </div>
              <div>
                <div className="text-slate-500">Confidence</div>
                <div className="tabular-nums">{r.confidence_score.toFixed(0)}%</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-slate-400">{r.structure_bias}</div>
          </Link>
        ))}
      </div>
    </>
  );
}
