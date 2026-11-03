'use client'

import { useState } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { COPY } from '@/lib/copy'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email.trim()) {
      setError(COPY.auth.emailRequired)
      return
    }

    setIsLoading(true)
    const supabase = createBrowserSupabaseClient()
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    setIsLoading(false)

    if (authError) {
      setError(authError.message)
      return
    }

    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{COPY.auth.loginTitle}</h1>

        {sent ? (
          <p className="text-green-600">{COPY.auth.magicLinkSent}</p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              type="email"
              label={COPY.auth.emailLabel}
              placeholder={COPY.auth.emailPlaceholder}
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={error}
              required
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {COPY.auth.sendMagicLink}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
