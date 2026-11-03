import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = createServerSupabaseClient()
    await supabase.auth.exchangeCodeForSession(code)

    await fetch(`${origin}/api/seed-defaults`, {
      method: 'POST',
      headers: { Cookie: request.headers.get('cookie') ?? '' },
    }).catch(() => {})
  }

  return NextResponse.redirect(`${origin}/`)
}
