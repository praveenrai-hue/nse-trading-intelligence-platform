import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const marketCap = searchParams.get('marketCap')
    const priceRange = searchParams.get('priceRange')
    const momentum = searchParams.get('momentum')

    // Mock screened results
    const stocks = [
      {
        id: '1',
        symbol: 'RELIANCE',
        price: 3175,
        change: 2.5,
        volume: 12500000,
        pe: 18.5,
        momentum: 'Bullish',
        rs: 92,
        breakout: '52W High',
      },
      {
        id: '2',
        symbol: 'INFY',
        price: 2100,
        change: 3.1,
        volume: 8200000,
        pe: 22.3,
        momentum: 'Bullish',
        rs: 88,
        breakout: 'Resistance',
      },
      {
        id: '3',
        symbol: 'TCS',
        price: 3875,
        change: -1.2,
        volume: 5600000,
        pe: 20.1,
        momentum: 'Neutral',
        rs: 72,
        breakout: 'Moving Avg',
      },
    ]

    return NextResponse.json(
      {
        success: true,
        data: stocks,
        count: stocks.length,
        filters: { marketCap, priceRange, momentum },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching screener results:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch screener results' },
      { status: 500 }
    )
  }
}
