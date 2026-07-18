"use client";

import { useCallback, useEffect, useState } from "react";
import ScannerTable from "@/components/ScannerTable";
import { getScan } from "@/lib/api";
import type { ScanRow } from "@/lib/types";

const REFRESH_MS = Number(process.env.NEXT_PUBLIC_REFRESH_MS || 30000);

export default function DashboardPage() {
  const [rows, setRows] = useState<ScanRow[]>([]);
  const [updatedAt, setUpdatedAt] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await getScan();
      setRows(data.results);
      setUpdatedAt(new Date(data.generated_at).toLocaleTimeString());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load scan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const id = setInterval(load, REFRESH_MS);
    return () => clearInterval(id);
  }, [load]);

  const bull = rows.filter((r) => r.direction === "Bullish").length;
  const bear = rows.filter((r) => r.direction === "Bearish").length;
  const neutral = rows.filter((r) => r.direction === "Neutral").length;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Scanner</h1>
          <p className="text-sm text-slate-400">
            {updatedAt ? `Updated ${updatedAt} · auto-refresh ${REFRESH_MS / 1000}s` : "Loading…"}
          </p>
        </div>
        <div className="flex gap-2 text-xs">
          <span className="rounded-full bg-emerald-500/15 text-emerald-400 px-3 py-1">Bullish {bull}</span>
          <span className="rounded-full bg-red-500/15 text-red-400 px-3 py-1">Bearish {bear}</span>
          <span className="rounded-full bg-amber-500/15 text-amber-400 px-3 py-1">Neutral {neutral}</span>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error} — is the backend running at {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}?
        </div>
      )}

      {loading && !rows.length ? (
        <div className="text-slate-400">Loading scanner…</div>
      ) : (
        <ScannerTable rows={rows} />
      )}
    </div>
  );
}
