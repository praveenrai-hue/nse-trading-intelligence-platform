import { NextRequest, NextResponse } from 'next/server'

// Mock options chain endpoint
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol') || 'NIFTY'
    const expiry = searchParams.get('expiry') || '2026-09-12'

    // TODO: Integrate with real NSE options data
    // This is mock data
    const mockData = {
      symbol,
      expiry,
      spot: 19600,
      chains: [
        {
          strike: 19500,
          call: { bid: 120, ask: 125, iv: 0.15, delta: 0.65, gamma: 0.002, theta: -0.05, vega: 0.02 },
          put: { bid: 15, ask: 20, iv: 0.15, delta: -0.35, gamma: 0.002, theta: 0.02, vega: 0.01 },
        },
        {
          strike: 19550,
          call: { bid: 95, ask: 100, iv: 0.16, delta: 0.55, gamma: 0.0025, theta: -0.06, vega: 0.022 },
          put: { bid: 35, ask: 40, iv: 0.16, delta: -0.45, gamma: 0.0025, theta: 0.025, vega: 0.011 },
        },
        {
          strike: 19600,
          call: { bid: 75, ask: 80, iv: 0.17, delta: 0.50, gamma: 0.003, theta: -0.07, vega: 0.025 },
          put: { bid: 60, ask: 65, iv: 0.17, delta: -0.50, gamma: 0.003, theta: 0.03, vega: 0.012 },
        },
      ],
      pcr: 0.95,
      maxPain: 19550,
    }

    return NextResponse.json(mockData, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch options chain' },
      { status: 500 }
    )
  }
}
