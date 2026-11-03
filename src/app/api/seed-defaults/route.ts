import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const DEFAULT_OPTIONS = [
  {
    category: 'application_status',
    labels: ['Applied', 'In Review', 'Assessment Sent', 'Interview Scheduled', 'Offer', 'Closed'],
  },
  { category: 'assessment_status', labels: ['Sent', 'Received', 'Evaluated'] },
  {
    category: 'interview_round',
    labels: [
      'HR Screen',
      'Technical Round 1',
      'Technical Round 2',
      'System Design',
      'Cultural Fit',
      'Final',
    ],
  },
]

export async function POST() {
  try {
    const supabase = createServerSupabaseClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { count } = await supabase
      .from('dropdown_options')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)

    if (count && count > 0) {
      return NextResponse.json({ message: 'Already seeded' })
    }

    const rows = DEFAULT_OPTIONS.flatMap(({ category, labels }) =>
      labels.map((label, sort_order) => ({
        owner_id: user.id,
        category,
        label,
        sort_order,
      }))
    )

    const { error } = await supabase.from('dropdown_options').insert(rows)

    if (error) throw error

    return NextResponse.json({ message: 'Seeded successfully' })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
