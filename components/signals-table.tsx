'use client'

import { ArrowUp, ArrowDown, TrendingUp } from 'lucide-react'

const signals = [
  {
    symbol: 'RELIANCE',
    signal: 'BUY',
    confidence: 88,
    target: '₹3250',
    stopLoss: '₹3100',
    entry: '₹3175',
    timeframe: '1H',
    change: '+2.5%',
    agents: 5,
    riskReward: '3.0:1',
  },
  {
    symbol: 'TCS',
    signal: 'SELL',
    confidence: 75,
    target: '₹3800',
    stopLoss: '₹3950',
    entry: '₹3875',
    timeframe: '4H',
    change: '-1.2%',
    agents: 4,
    riskReward: '2.5:1',
  },
  {
    symbol: 'INFY',
    signal: 'BUY',
    confidence: 82,
    target: '₹2150',
    stopLoss: '₹2050',
    entry: '₹2100',
    timeframe: '1H',
    change: '+3.1%',
    agents: 5,
    riskReward: '2.8:1',
  },
  {
    symbol: 'WIPRO',
    signal: 'BUY',
    confidence: 72,
    target: '₹490',
    stopLoss: '₹460',
    entry: '₹475',
    timeframe: 'Daily',
    change: '+1.8%',
    agents: 4,
    riskReward: '2.0:1',
  },
  {
    symbol: 'HDFC BANK',
    signal: 'HOLD',
    confidence: 65,
    target: '₹1750',
    stopLoss: '₹1650',
    entry: '₹1700',
    timeframe: '4H',
    change: '+0.8%',
    agents: 3,
    riskReward: '1.5:1',
  },
  {
    symbol: 'ICICI BANK',
    signal: 'BUY',
    confidence: 79,
    target: '₹1050',
    stopLoss: '₹980',
    entry: '₹1015',
    timeframe: '1H',
    change: '+2.2%',
    agents: 5,
    riskReward: '2.3:1',
  },
]

export function SignalsTable() {
  return (
    <div className="rounded-lg border bg-background overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-secondary/5">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Symbol</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Signal</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Confidence</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Entry</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Target</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Stop Loss</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">R:R</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Timeframe</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Change</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Agents</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {signals.map((signal, i) => (
              <tr key={i} className="border-b hover:bg-secondary/5 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    {signal.symbol}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    signal.signal === 'BUY' ? 'bg-green-500/20 text-green-400' :
                    signal.signal === 'SELL' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {signal.signal}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-24 bg-secondary/20 rounded-full h-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${signal.confidence}%` }}
                    />
                  </div>
                  <span className="mt-1 text-xs font-medium text-foreground">{signal.confidence}%</span>
                </td>
                <td className="px-6 py-4 text-sm text-foreground font-medium">{signal.entry}</td>
                <td className="px-6 py-4 text-sm text-green-400 font-medium">{signal.target}</td>
                <td className="px-6 py-4 text-sm text-red-400 font-medium">{signal.stopLoss}</td>
                <td className="px-6 py-4 text-sm text-primary font-medium">{signal.riskReward}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{signal.timeframe}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {signal.change.startsWith('+') ? (
                      <ArrowUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-400" />
                    )}
                    <span className={signal.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                      {signal.change}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{signal.agents}</td>
                <td className="px-6 py-4">
                  <button className="text-primary hover:text-blue-400 text-sm font-medium transition-colors">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
