import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStockQuote, generateSignal, NSE_STOCKS } from '@/lib/finnhub'

/**
 * Sync market data from Finnhub to Supabase
 * Called periodically to update live signals and market data
 */
export async function POST() {
  try {
    const supabase = await createClient()

    console.log('[Market Sync] Starting sync for', NSE_STOCKS.length, 'stocks')

    const results = []

    for (const stock of NSE_STOCKS) {
      try {
        // Fetch quote from Finnhub
        const quote = await getStockQuote(stock.symbol)

        if (!quote) {
          console.warn(`[Market Sync] Failed to fetch quote for ${stock.symbol}`)
          continue
        }

        // Generate signal
        const signal = generateSignal(quote)

        // Update market_data table
        const { error: marketDataError } = await supabase
          .from('market_data')
          .upsert(
            {
              symbol: stock.symbol,
              current_price: quote.currentPrice,
              high_price: quote.highPrice,
              low_price: quote.lowPrice,
              open_price: quote.openPrice,
              volume: quote.volume,
              change_percent: quote.changePercent,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'symbol' }
          )

        if (marketDataError) {
          console.error(`[Market Sync] Error updating market_data for ${stock.symbol}:`, marketDataError)
        }

        // Calculate target and stop loss
        const currentPrice = quote.currentPrice
        const entryPrice = currentPrice
        const changePercent = quote.changePercent

        let targetPrice, stopLoss

        if (signal.type === 'BUY') {
          // Buy signal: target 5% up, stop loss 2% down
          targetPrice = currentPrice * 1.05
          stopLoss = currentPrice * 0.98
        } else if (signal.type === 'SELL') {
          // Sell signal: target 5% down, stop loss 2% up
          targetPrice = currentPrice * 0.95
          stopLoss = currentPrice * 1.02
        } else {
          // Hold: target 3% up, stop loss 1% down
          targetPrice = currentPrice * 1.03
          stopLoss = currentPrice * 0.99
        }

        const riskReward = Math.abs(targetPrice - entryPrice) / Math.abs(entryPrice - stopLoss)

        // Update live_signals table
        const { error: signalError } = await supabase
          .from('live_signals')
          .upsert(
            {
              symbol: stock.symbol,
              name: stock.name,
              signal_type: signal.type,
              confidence: signal.confidence,
              entry_price: entryPrice,
              target_price: targetPrice,
              stop_loss: stopLoss,
              risk_reward: Math.round(riskReward * 100) / 100,
              timeframe: '1D',
              change_percent: changePercent,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'symbol' }
          )

        if (signalError) {
          console.error(`[Market Sync] Error updating live_signals for ${stock.symbol}:`, signalError)
        }

        results.push({
          symbol: stock.symbol,
          name: stock.name,
          signal: signal.type,
          confidence: signal.confidence,
          price: currentPrice,
          change: quote.changePercent,
        })
      } catch (error) {
        console.error(`[Market Sync] Error processing ${stock.symbol}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${results.length} stocks`,
      results,
    })
  } catch (error) {
    console.error('[Market Sync] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync market data',
      },
      { status: 500 }
    )
  }
}

/**
 * Get current market data
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const { data: marketData, error } = await supabase
      .from('live_signals')
      .select('*')
      .order('confidence', { ascending: false })
      .limit(10)

    if (error) {
      console.error('[Market Data] Error fetching signals:', error)
      return NextResponse.json(
        { error: 'Failed to fetch market data' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      count: marketData.length,
      data: marketData,
    })
  } catch (error) {
    console.error('[Market Data] Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch market data' },
      { status: 500 }
    )
  }
}
