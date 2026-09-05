import { NextRequest, NextResponse } from 'next/server'

// Mock signup endpoint
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password } = body

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Name, email, and password are required' },
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
          name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Signup failed' },
      { status: 500 }
    )
  }
}
