import { NextRequest, NextResponse } from 'next/server'

// Mock signals endpoint
export async function GET(request: NextRequest) {
  try {
    // TODO: Integrate with AI signal generation system
    // This is mock data
    const mockSignals = [
      {
        id: '1',
        symbol: 'NIFTY',
        type: 'BUY',
        confidence: 0.85,
        entryPrice: 19550,
        targetPrice: 19750,
        stopLoss: 19400,
        timeframe: '1h',
        reason: 'Bullish breakout with increasing volume',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        symbol: 'BANKNIFTY',
        type: 'SELL',
        confidence: 0.72,
        entryPrice: 42500,
        targetPrice: 42000,
        stopLoss: 42800,
        timeframe: '4h',
        reason: 'Bearish rejection at resistance',
        timestamp: new Date().toISOString(),
      },
      {
        id: '3',
        symbol: 'INFY',
        type: 'BUY',
        confidence: 0.68,
        entryPrice: 3450,
        targetPrice: 3600,
        stopLoss: 3350,
        timeframe: '1d',
        reason: 'Support bounce with bullish divergence',
        timestamp: new Date().toISOString(),
      },
    ]

    return NextResponse.json(
      {
        signals: mockSignals,
        total: mockSignals.length,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch signals' },
      { status: 500 }
    )
  }
}
