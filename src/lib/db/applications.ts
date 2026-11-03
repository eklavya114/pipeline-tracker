import { createServerSupabaseClient } from '@/lib/supabase/server'
import { applicationRowSchema, type ApplicationRow, type ApplicationFormValues } from '@/lib/zod-schemas/application'
import { z } from 'zod'

const OWNER_ID = '00000000-0000-0000-0000-000000000000'

export async function getApplications(): Promise<ApplicationRow[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('owner_id', OWNER_ID)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return z.array(applicationRowSchema).parse(data)
}

export async function getRecentApplications(limit = 10): Promise<
  Array<ApplicationRow & { company_name: string }>
> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('applications')
    .select('*, companies(name)')
    .eq('owner_id', OWNER_ID)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw new Error(error.message)
  const parsed = z.array(
    applicationRowSchema.extend({ companies: z.object({ name: z.string() }) })
  ).parse(data)
  return parsed.map(row => ({ ...row, company_name: row.companies.name }))
}

export async function getApplicationsByCompany(companyId: string): Promise<ApplicationRow[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('company_id', companyId)
    .eq('owner_id', OWNER_ID)
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return z.array(applicationRowSchema).parse(data)
}

export async function getApplicationById(id: string): Promise<ApplicationRow | null> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('id', id)
    .eq('owner_id', OWNER_ID)
    .single()
  if (error) return null
  return applicationRowSchema.parse(data)
}

export async function createApplication(
  params: ApplicationFormValues & { candidate_id?: string }
): Promise<{ data: ApplicationRow | null; error: string | null }> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('applications')
    .insert({
      owner_id: OWNER_ID,
      company_id: params.company_id,
      candidate_id: params.candidate_id || null,
      role_title: params.role_title,
      current_status: params.current_status,
      current_round: params.current_round || null,
      outcome: params.outcome,
      applied_at: params.applied_at || null,
      source: params.source || null,
      notes: params.notes || null,
    })
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  return { data: applicationRowSchema.parse(data), error: null }
}

export async function updateApplication(
  id: string,
  params: ApplicationFormValues & { candidate_id?: string }
): Promise<{ data: ApplicationRow | null; error: string | null }> {
  const supabase = createServerSupabaseClient()
  const existing = await getApplicationById(id)
  if (!existing) return { data: null, error: 'Application not found.' }
  const { data, error } = await supabase
    .from('applications')
    .update({
      company_id: params.company_id,
      candidate_id: params.candidate_id || null,
      role_title: params.role_title,
      current_status: params.current_status,
      current_round: params.current_round || null,
      outcome: params.outcome,
      applied_at: params.applied_at || null,
      source: params.source || null,
      notes: params.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('owner_id', OWNER_ID)
    .select()
    .single()
  if (error) return { data: null, error: error.message }
  if (existing.outcome !== params.outcome) {
    await supabase.from('outcome_history').insert({
      application_id: id,
      previous_outcome: existing.outcome,
      new_outcome: params.outcome,
    })
  }
  return { data: applicationRowSchema.parse(data), error: null }
}

export async function deleteApplication(id: string): Promise<{ error: string | null }> {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('id', id)
    .eq('owner_id', OWNER_ID)
  if (error) return { error: error.message }
  return { error: null }
}
