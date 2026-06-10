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

    return NextResponse.json({
      success: true,
      count: signals.length,
      signals: signals.map((signal) => ({
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
