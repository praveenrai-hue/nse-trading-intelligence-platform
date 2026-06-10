'use client'

import { ArrowUp, ArrowDown, Star } from 'lucide-react'
import { useState } from 'react'

const stocks = [
  {
    symbol: 'RELIANCE',
    price: '₹3,175',
    change: '+2.5%',
    volume: '12.5M',
    pe: '18.5',
    momentum: 'Bullish',
    rs: 92,
    breakout: '52W High',
  },
  {
    symbol: 'INFY',
    price: '₹2,100',
    change: '+3.1%',
    volume: '8.2M',
    pe: '22.3',
    momentum: 'Bullish',
    rs: 88,
    breakout: 'Resistance',
  },
  {
    symbol: 'TCS',
    price: '₹3,875',
    change: '-1.2%',
    volume: '5.6M',
    pe: '20.1',
    momentum: 'Neutral',
    rs: 72,
    breakout: 'Moving Avg',
  },
  {
    symbol: 'WIPRO',
    price: '₹475',
    change: '+1.8%',
    volume: '6.8M',
    pe: '16.9',
    momentum: 'Bullish',
    rs: 81,
    breakout: '52W High',
  },
  {
    symbol: 'HDFC BANK',
    price: '₹1,700',
    change: '+0.8%',
    volume: '9.3M',
    pe: '14.2',
    momentum: 'Neutral',
    rs: 68,
    breakout: 'Resistance',
  },
]

export function ScreenerTable() {
  const [starred, setStarred] = useState<Set<string>>(new Set())

  const toggleStar = (symbol: string) => {
    const newStarred = new Set(starred)
    if (newStarred.has(symbol)) {
      newStarred.delete(symbol)
    } else {
      newStarred.add(symbol)
    }
    setStarred(newStarred)
  }

  return (
    <div className="rounded-lg border bg-background overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b bg-secondary/5">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground w-8"></th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Symbol</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Price</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Change</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Volume</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">P/E</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Momentum</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">RS Rating</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-muted-foreground">Breakout</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock, i) => (
              <tr key={i} className="border-b hover:bg-secondary/5 transition-colors">
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStar(stock.symbol)}
                    className="text-muted-foreground hover:text-yellow-400 transition-colors"
                  >
                    <Star
                      className="h-4 w-4"
                      fill={starred.has(stock.symbol) ? 'currentColor' : 'none'}
                    />
                  </button>
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-foreground">{stock.symbol}</td>
                <td className="px-6 py-4 text-sm font-medium text-foreground">{stock.price}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1">
                    {stock.change.startsWith('+') ? (
                      <ArrowUp className="h-4 w-4 text-green-400" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-red-400" />
                    )}
                    <span className={stock.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
                      {stock.change}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{stock.volume}</td>
                <td className="px-6 py-4 text-sm text-foreground">{stock.pe}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                    stock.momentum === 'Bullish' ? 'bg-green-500/20 text-green-400' :
                    stock.momentum === 'Bearish' ? 'bg-red-500/20 text-red-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {stock.momentum}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-secondary/20 rounded-full h-1.5">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${stock.rs}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground">{stock.rs}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-primary font-medium">{stock.breakout}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
