import { NextRequest, NextResponse } from 'next/server'

// Health check endpoint
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Health check failed' },
      { status: 500 }
    )
  }
}
