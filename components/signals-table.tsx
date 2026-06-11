'use client'

import { ArrowDown, Loader } from 'lucide-react'
import { useSignals } from '@/lib/hooks/useMarketData'

export function SignalsTable() {
  const { signals, isLoading, error } = useSignals()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4 text-red-400">
        Error loading signals. Please refresh the page.
      </div>
    )
  }

  if (signals.length === 0) {
    return (
      <div className="rounded-lg border bg-secondary/5 p-12 text-center">
        <p className="text-muted-foreground">No trading signals available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-lg border bg-background">
      <table className="w-full">
        <thead className="border-b bg-secondary/5">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Symbol</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Signal</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Confidence</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Entry</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Target</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Stop Loss</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Timeframe</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Risk:Reward</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">Change</th>
          </tr>
        </thead>
        <tbody>
          {signals.map((signal) => (
            <tr key={signal.id} className="border-b hover:bg-secondary/5 transition-colors">
              <td className="px-6 py-4 text-sm font-semibold text-foreground">{signal.symbol}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                    signal.signal_type === 'BUY'
                      ? 'bg-green-500/20 text-green-400'
                      : signal.signal_type === 'SELL'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                  }`}
                >
                  {signal.signal_type}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-secondary/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        signal.confidence >= 80
                          ? 'bg-green-500'
                          : signal.confidence >= 70
                            ? 'bg-blue-500'
                            : 'bg-yellow-500'
                      }`}
                      style={{ width: `${signal.confidence}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-12">{signal.confidence}%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-foreground">₹{signal.entry_price}</td>
              <td className="px-6 py-4 text-sm text-foreground font-medium text-green-400">₹{signal.target_price}</td>
              <td className="px-6 py-4 text-sm text-foreground font-medium text-red-400">₹{signal.stop_loss}</td>
              <td className="px-6 py-4 text-sm text-muted-foreground">{signal.timeframe}</td>
              <td className="px-6 py-4 text-sm text-foreground font-medium">{signal.risk_reward}:1</td>
              <td className="px-6 py-4 text-sm">
                <div className="flex items-center gap-1">
                  {signal.change_percent > 0 ? (
                    <span className="text-green-400">+{signal.change_percent}%</span>
                  ) : (
                    <div className="flex items-center gap-1">
                      <ArrowDown className="h-4 w-4 text-red-400" />
                      <span className="text-red-400">{signal.change_percent}%</span>
                    </div>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
