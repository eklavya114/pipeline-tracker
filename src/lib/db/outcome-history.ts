import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { applicationOutcomeSchema } from '@/lib/zod-schemas/application'

const outcomeHistoryRowSchema = z.object({
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
  application_id: z.string().uuid(),
  previous_outcome: applicationOutcomeSchema.nullable(),
  new_outcome: applicationOutcomeSchema,
  changed_at: z.string(),
  note: z.string().nullable(),
})

export type OutcomeHistoryRow = z.infer<typeof outcomeHistoryRowSchema>

export async function getOutcomeHistory(applicationId: string): Promise<OutcomeHistoryRow[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('outcome_history')
    .select('*')
    .eq('application_id', applicationId)
    .order('changed_at', { ascending: false })

  if (error) throw new Error(error.message)
  return z.array(outcomeHistoryRowSchema).parse(data)
}
