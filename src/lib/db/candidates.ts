import { createServerSupabaseClient } from '@/lib/supabase/server'
import { candidateRowSchema, type CandidateRow, type CandidateFormValues } from '@/lib/zod-schemas/candidate'

export async function getCandidateById(id: string): Promise<CandidateRow | null> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('candidates')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return candidateRowSchema.parse(data)
}

export async function upsertCandidate(
  params: CandidateFormValues,
  existingId?: string
): Promise<{ data: CandidateRow | null; error: string | null }> {
  const supabase = createServerSupabaseClient()

  if (existingId) {
    const { data, error } = await supabase
      .from('candidates')
      .update({
        full_name: params.full_name || null,
        email: params.email || null,
        phone: params.phone || null,
        linkedin_url: params.linkedin_url || null,
        notes: params.notes || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingId)
      .select()
      .single()

    if (error) return { data: null, error: error.message }
    return { data: candidateRowSchema.parse(data), error: null }
  }

  const { data, error } = await supabase
    .from('candidates')
    .insert({
      full_name: params.full_name || null,
      email: params.email || null,
      phone: params.phone || null,
      linkedin_url: params.linkedin_url || null,
      notes: params.notes || null,
    })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: candidateRowSchema.parse(data), error: null }
}
