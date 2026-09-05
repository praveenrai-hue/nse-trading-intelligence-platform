import { NextRequest, NextResponse } from 'next/server'

// Mock sentiment analysis endpoint
export async function GET(request: NextRequest) {
  try {
    // TODO: Integrate with real sentiment analysis
    // This is mock data
    const mockSentiment = {
      vix: 18.5,
      vixTrend: 'up',
      marketBreadth: {
        advances: 1850,
        declines: 950,
        unchanged: 200,
      },
      fiiDii: {
        fiiInflow: 450000000,
        diiInflow: -120000000,
        netInflow: 330000000,
      },
      sectorRotation: [
        { sector: 'IT', strength: 0.65, trend: 'up' },
        { sector: 'Finance', strength: 0.72, trend: 'up' },
        { sector: 'Energy', strength: 0.48, trend: 'down' },
        { sector: 'FMCG', strength: 0.55, trend: 'neutral' },
      ],
      sentiment: 'bullish',
      confidence: 0.78,
    }

    return NextResponse.json(mockSentiment, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sentiment data' },
      { status: 500 }
    )
  }
}
