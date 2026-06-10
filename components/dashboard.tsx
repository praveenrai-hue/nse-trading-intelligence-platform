'use client'

import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { ArrowUp, ArrowDown } from 'lucide-react'

const chartData = [
  { time: '9:30', nifty: 24000, banknifty: 49500, sentiment: 65 },
  { time: '10:00', nifty: 24050, banknifty: 49600, sentiment: 68 },
  { time: '10:30', nifty: 24100, banknifty: 49700, sentiment: 72 },
  { time: '11:00', nifty: 24150, banknifty: 49800, sentiment: 75 },
  { time: '11:30', nifty: 24200, banknifty: 49900, sentiment: 78 },
  { time: '12:00', nifty: 24250, banknifty: 50000, sentiment: 80 },
  { time: '12:30', nifty: 24300, banknifty: 50100, sentiment: 82 },
]

const signals = [
  {
    symbol: 'RELIANCE',
    signal: 'BUY',
    confidence: 88,
    target: '₹3250',
    stopLoss: '₹3100',
    change: '+2.5%',
  },
  {
    symbol: 'TCS',
    signal: 'SELL',
    confidence: 75,
    target: '₹3800',
    stopLoss: '₹3950',
    change: '-1.2%',
  },
  {
    symbol: 'INFY',
    signal: 'BUY',
    confidence: 82,
    target: '₹2150',
    stopLoss: '₹2050',
    change: '+3.1%',
  },
  {
    symbol: 'HDFC BANK',
    signal: 'HOLD',
    confidence: 65,
    target: '₹1750',
    stopLoss: '₹1650',
    change: '+0.8%',
  },
]

export function Dashboard() {
  return (
    <section className="relative bg-secondary/5 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12">
          <h2 className="mb-2 text-3xl font-bold tracking-tighter text-foreground">
            Live Market Dashboard
          </h2>
          <p className="text-muted-foreground">
            Real-time market data and AI-generated trading signals
          </p>
        </div>

        {/* Market Overview */}
        <div className="mb-12 grid gap-4 md:grid-cols-4">
          {[
            { label: 'NIFTY 50', value: '24,300', change: '+2.1%', positive: true },
            { label: 'BANK NIFTY', value: '50,100', change: '+1.8%', positive: true },
            { label: 'VIX', value: '18.5', change: '-0.5%', positive: true },
            { label: 'Active Signals', value: '24', change: '+5', positive: true },
          ].map((stat, i) => (
            <div key={i} className="rounded-lg border bg-background p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
              <p className={`mt-1 text-sm font-medium ${stat.positive ? 'text-green-400' : 'text-red-400'}`}>
                {stat.change}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="mb-12 grid gap-8 lg:grid-cols-2">
          {/* NIFTY Chart */}
          <div className="rounded-lg border bg-background p-6">
            <h3 className="mb-4 font-semibold text-foreground">NIFTY 50 - 1H</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} domain={[23900, 24400]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#00d4ff' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="nifty" 
                  stroke="#00d4ff" 
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sentiment Chart */}
          <div className="rounded-lg border bg-background p-6">
            <h3 className="mb-4 font-semibold text-foreground">Market Sentiment - 1H</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} domain={[0, 100]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151' }}
                  labelStyle={{ color: '#00d4ff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="sentiment" 
                  fill="#00d4ff" 
                  stroke="#00d4ff"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Signals Table */}
        <div className="rounded-lg border bg-background overflow-hidden">
          <div className="border-b px-6 py-4">
            <h3 className="font-semibold text-foreground">Live Trading Signals</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-secondary/5">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Symbol</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Signal</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Confidence</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Target</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Stop Loss</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Change</th>
                </tr>
              </thead>
              <tbody>
                {signals.map((signal, i) => (
                  <tr key={i} className="border-b hover:bg-secondary/5 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{signal.symbol}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        signal.signal === 'BUY' ? 'bg-green-500/20 text-green-400' :
                        signal.signal === 'SELL' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {signal.signal}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{signal.confidence}%</td>
                    <td className="px-6 py-4 text-sm text-foreground">{signal.target}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{signal.stopLoss}</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
