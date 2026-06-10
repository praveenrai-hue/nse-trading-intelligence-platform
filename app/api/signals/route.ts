import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // In production, this would fetch from database and AI system
    const signals = [
      {
        id: '1',
        symbol: 'RELIANCE',
        signal: 'BUY',
        confidence: 88,
        target: 3250,
        stopLoss: 3100,
        entry: 3175,
        timeframe: '1H',
        change: 2.5,
        agents: 5,
        riskReward: 3.0,
        timestamp: new Date(),
      },
      {
        id: '2',
        symbol: 'TCS',
        signal: 'SELL',
        confidence: 75,
        target: 3800,
        stopLoss: 3950,
        entry: 3875,
        timeframe: '4H',
        change: -1.2,
        agents: 4,
        riskReward: 2.5,
        timestamp: new Date(),
      },
    ]

    return NextResponse.json(
      {
        success: true,
        data: signals,
        count: signals.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching signals:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch signals' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate signal data
    if (!body.symbol || !body.signal) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // In production, this would save to database
    const newSignal = {
      id: String(Date.now()),
      ...body,
      timestamp: new Date(),
    }

    return NextResponse.json(
      { success: true, data: newSignal },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating signal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create signal' },
      { status: 500 }
    )
  }
}
