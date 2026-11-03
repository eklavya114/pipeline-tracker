import { createServerSupabaseClient } from '@/lib/supabase/server'
import { companyRowSchema, type CompanyRow } from '@/lib/zod-schemas/company'
import { normaliseCompanyName } from '@/lib/company-normaliser'
import { z } from 'zod'

export async function getCompanies(): Promise<CompanyRow[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .order('name')

  if (error) throw new Error(error.message)
  return z.array(companyRowSchema).parse(data)
}

export async function getCompanyById(id: string): Promise<CompanyRow | null> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return companyRowSchema.parse(data)
}

export async function createCompany(params: {
  name: string
  website?: string
  notes?: string
}): Promise<{ data: CompanyRow | null; error: string | null }> {
  const supabase = createServerSupabaseClient()
  const name_normalized = normaliseCompanyName(params.name)

  const { data, error } = await supabase
    .from('companies')
    .insert({
      name: params.name.trim(),
      name_normalized,
      website: params.website || null,
      notes: params.notes || null,
    })
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: companyRowSchema.parse(data), error: null }
}

export async function updateCompany(
  id: string,
  params: { name: string; website?: string; notes?: string }
): Promise<{ data: CompanyRow | null; error: string | null }> {
  const supabase = createServerSupabaseClient()
  const name_normalized = normaliseCompanyName(params.name)

  const { data, error } = await supabase
    .from('companies')
    .update({
      name: params.name.trim(),
      name_normalized,
      website: params.website || null,
      notes: params.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) return { data: null, error: error.message }
  return { data: companyRowSchema.parse(data), error: null }
}

export async function deleteCompany(id: string): Promise<{ error: string | null }> {
  const supabase = createServerSupabaseClient()

  const { count } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('company_id', id)

  if (count && count > 0) {
    return { error: 'Cannot delete a company with existing applications.' }
  }

  const { error } = await supabase.from('companies').delete().eq('id', id)
  if (error) return { error: error.message }
  return { error: null }
}
