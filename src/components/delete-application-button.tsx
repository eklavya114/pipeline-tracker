'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteApplicationButton({ id }: { id: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete() {
    if (!confirm('Delete this application? This cannot be undone.')) return
    setLoading(true)
    setError(null)
    const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' })
    if (res.ok) {
      router.push('/applications')
      router.refresh()
    } else {
      const json = await res.json().catch(() => ({}))
      setError(json.error ?? 'Delete failed.')
      setLoading(false)
    }
  }

  return (
    <div>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? 'Deleting…' : 'Delete Application'}
      </button>
    </div>
  )
}
