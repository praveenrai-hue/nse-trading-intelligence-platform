import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/**
 * Get all live trading signals
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: signals, error } = await supabase
      .from('live_signals')
      .select('*')
      .order('confidence', { ascending: false })

    if (error) {
      console.error('[Signals API] Error fetching signals:', error)
      return NextResponse.json(
        { error: 'Failed to fetch signals' },
        { status: 500 }
      )
    }

    // If no signals in database, return mock data for demo
    const displaySignals = signals && signals.length > 0 ? signals : [
      {
        id: '1',
        symbol: 'RELIANCE',
        name: 'Reliance Industries',
        signal_type: 'BUY',
        confidence: 88,
        entry_price: 3150,
        target_price: 3250,
        stop_loss: 3100,
        risk_reward: 3.33,
        timeframe: '1D',
        change_percent: 2.5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        symbol: 'TCS',
        name: 'Tata Consultancy Services',
        signal_type: 'SELL',
        confidence: 75,
        entry_price: 3900,
        target_price: 3800,
        stop_loss: 3950,
        risk_reward: 2.0,
        timeframe: '1D',
        change_percent: -1.2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        symbol: 'INFY',
        name: 'Infosys',
        signal_type: 'BUY',
        confidence: 82,
        entry_price: 2050,
        target_price: 2150,
        stop_loss: 2000,
        risk_reward: 3.0,
        timeframe: '1D',
        change_percent: 3.1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        symbol: 'WIPRO',
        name: 'Wipro',
        signal_type: 'BUY',
        confidence: 72,
        entry_price: 450,
        target_price: 475,
        stop_loss: 435,
        risk_reward: 2.5,
        timeframe: '4H',
        change_percent: 1.8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '5',
        symbol: 'HDFC BANK',
        name: 'HDFC Bank',
        signal_type: 'HOLD',
        confidence: 65,
        entry_price: 1700,
        target_price: 1750,
        stop_loss: 1650,
        risk_reward: 2.0,
        timeframe: '1D',
        change_percent: 0.8,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '6',
        symbol: 'ICICI BANK',
        name: 'ICICI Bank',
        signal_type: 'BUY',
        confidence: 79,
        entry_price: 950,
        target_price: 1000,
        stop_loss: 920,
        risk_reward: 2.8,
        timeframe: '1D',
        change_percent: 2.1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    return NextResponse.json({
      success: true,
      count: displaySignals.length,
      signals: displaySignals.map((signal) => ({
        id: signal.id,
        symbol: signal.symbol,
        name: signal.name,
        signalType: signal.signal_type,
        confidence: signal.confidence,
        entryPrice: signal.entry_price,
        targetPrice: signal.target_price,
        stopLoss: signal.stop_loss,
        riskReward: signal.risk_reward,
        timeframe: signal.timeframe,
        changePercent: signal.change_percent,
        updatedAt: signal.updated_at,
      })),
    })
  } catch (error) {
    console.error('[Signals API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch signals' },
      { status: 500 }
    )
  }
}

/**
 * Save a signal to user's saved signals
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { symbol, signalType, confidence, entryPrice, targetPrice, stopLoss } = body

    const { data, error } = await supabase
      .from('saved_signals')
      .insert({
        user_id: user.id,
        signal_id: `${symbol}-${Date.now()}`,
        symbol,
        signal_type: signalType,
        confidence,
        entry_price: entryPrice,
        target_price: targetPrice,
        stop_loss: stopLoss,
      })
      .select()

    if (error) {
      console.error('[Signals API] Error saving signal:', error)
      return NextResponse.json(
        { error: 'Failed to save signal' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data[0],
    })
  } catch (error) {
    console.error('[Signals API] Error:', error)
    return NextResponse.json(
      { error: 'Failed to save signal' },
      { status: 500 }
    )
  }
}
