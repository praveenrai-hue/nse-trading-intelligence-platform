import { NextRequest, NextResponse } from 'next/server'

// Mock authentication endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // TODO: Implement Firebase authentication
    // This is a mock response
    const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

    return NextResponse.json(
      {
        success: true,
        token,
        user: {
          id: '1',
          email,
          name: email.split('@')[0],
        },
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
}
