import { NextRequest, NextResponse } from 'next/server'

// Mock market data endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') || 'NIFTY50'
    const timeframe = searchParams.get('timeframe') || '1d'

    // TODO: Integrate with real NSE data API
    // This is mock data
    const mockData = {
      symbol,
      timeframe,
      data: [
        { timestamp: Date.now() - 86400000, open: 19500, high: 19650, low: 19450, close: 19600, volume: 50000 },
        { timestamp: Date.now() - 172800000, open: 19400, high: 19550, low: 19350, close: 19500, volume: 48000 },
        { timestamp: Date.now() - 259200000, open: 19300, high: 19450, low: 19250, close: 19400, volume: 45000 },
      ],
    }

    return NextResponse.json(mockData, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    )
  }
}
