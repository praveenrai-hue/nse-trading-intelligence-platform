import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
    console.error('[Auth Callback] Failed to exchange code for session:', error.message)
    const errorUrl = new URL(`${origin}/auth/error`)
    errorUrl.searchParams.set('reason', 'exchange_failed')
    return NextResponse.redirect(errorUrl.toString())
  }

  console.warn('[Auth Callback] No authorization code provided in callback')
  const errorUrl = new URL(`${origin}/auth/error`)
  errorUrl.searchParams.set('reason', 'missing_code')
  return NextResponse.redirect(errorUrl.toString())
}
