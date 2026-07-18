"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import PriceChart from "@/components/PriceChart";
import { DirectionBadge, ScoreBar } from "@/components/ScoreBadge";
import { getChart, getMaxPain, getOIAnalysis, getPCR, getScanSymbol, getSmartMoney } from "@/lib/api";
import type { Candle, MaxPain, OIAnalysis, PCR, ScanRow, SmartMoney } from "@/lib/types";

export default function SymbolDetailPage({ params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase();
  const [scan, setScan] = useState<ScanRow | null>(null);
  const [sm, setSm] = useState<SmartMoney | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [oi, setOi] = useState<OIAnalysis | null>(null);
  const [pcr, setPcr] = useState<PCR | null>(null);
  const [maxPain, setMaxPain] = useState<MaxPain | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      getScanSymbol(symbol),
      getSmartMoney(symbol),
      getChart(symbol),
      getOIAnalysis(symbol),
      getPCR(symbol),
      getMaxPain(symbol),
    ])
      .then(([s, m, c, o, p, mp]) => {
        if (!active) return;
        setScan(s);
        setSm(m);
        setCandles(c);
        setOi(o);
        setPcr(p);
        setMaxPain(mp);
      })
      .catch((e) => active && setError(e instanceof Error ? e.message : "Failed to load"));
    return () => {
      active = false;
    };
  }, [symbol]);

  if (error) {
    return <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-red-300">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/" className="text-sm text-slate-400 hover:text-emerald-400">
            ← Scanner
          </Link>
          <h1 className="text-2xl font-semibold mt-1">
            {symbol}{" "}
            {scan?.spot_price != null && (
              <span className="text-slate-400 text-lg">₹{scan.spot_price.toLocaleString()}</span>
            )}
          </h1>
        </div>
        {scan && <DirectionBadge direction={scan.direction} />}
      </div>

      {/* Scores */}
      {scan && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 space-y-3">
            <h2 className="text-sm font-medium text-slate-300">Option-Chain Bias</h2>
            <ScoreBar label="Bullish" value={scan.bullish_score} tone="bull" />
            <ScoreBar label="Bearish" value={scan.bearish_score} tone="bear" />
            <ScoreBar label="Confidence" value={scan.confidence_score} tone="neutral" />
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 space-y-3">
            <h2 className="text-sm font-medium text-slate-300">Smart-Money Scores</h2>
            <ScoreBar label="Structure" value={scan.structure_score} tone="bull" />
            <ScoreBar label="Liquidity" value={scan.liquidity_score} tone="bull" />
            <ScoreBar label="Smart Money" value={scan.smart_money_score} tone="bull" />
            <div className="pt-1 text-sm text-slate-300">{scan.structure_bias}</div>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 space-y-2">
            <h2 className="text-sm font-medium text-slate-300">Option Metrics</h2>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">PCR (OI)</span>
              <span>{pcr ? pcr.pcr_oi.toFixed(2) : "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Sentiment</span>
              <span className="capitalize">{pcr?.sentiment ?? "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Max Pain</span>
              <span>{maxPain ? maxPain.max_pain_level.toLocaleString() : "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">ATM OI Conc.</span>
              <span>{oi ? `${(oi.atm_oi_concentration * 100).toFixed(1)}%` : "—"}</span>
            </div>
          </div>
        </div>
      )}

      {/* Chart with overlays */}
      <div>
        <h2 className="text-sm font-medium text-slate-300 mb-2">Price Action & Smart-Money Overlays</h2>
        <PriceChart candles={candles} sm={sm} />
      </div>

      {/* Reasons */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
          <h2 className="text-sm font-medium text-slate-300 mb-2">Analysis Reasons</h2>
          <ul className="space-y-1.5 text-sm text-slate-300">
            {scan?.reasons.length ? (
              scan.reasons.map((r, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-400">•</span>
                  {r}
                </li>
              ))
            ) : (
              <li className="text-slate-500">No notable signals.</li>
            )}
          </ul>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 space-y-2 text-sm">
          <h2 className="text-sm font-medium text-slate-300 mb-2">Writing Activity</h2>
          <div>
            <span className="text-slate-400">Call writing strikes: </span>
            {oi?.call_writing_strikes.length ? oi.call_writing_strikes.join(", ") : "—"}
          </div>
          <div>
            <span className="text-slate-400">Put writing strikes: </span>
            {oi?.put_writing_strikes.length ? oi.put_writing_strikes.join(", ") : "—"}
          </div>
          <div>
            <span className="text-slate-400">Detected trend: </span>
            <span className="capitalize">{sm?.structure.trend ?? "—"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
