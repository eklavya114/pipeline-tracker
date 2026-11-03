import { createServerSupabaseClient } from '@/lib/supabase/server'
import { normaliseCompanyName } from '@/lib/company-normaliser'
import { z } from 'zod'

const OWNER_ID = '00000000-0000-0000-0000-000000000000'

const companyRowSchema = z.object({
  id: z.string().uuid(),
  owner_id: z.string(),
  name: z.string(),
  name_normalized: z.string(),
  industry: z.string().nullable(),
  website: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type CompanyRow = z.infer<typeof companyRowSchema>

export async function getCompanies(): Promise<CompanyRow[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', OWNER_ID)
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
    .eq('owner_id', OWNER_ID)
    .single()
  if (error) return null
  return companyRowSchema.parse(data)
}

export async function createCompany(params: {
  name: string
  industry?: string
  website?: string
  notes?: string
}): Promise<{ data: CompanyRow | null; error: string | null }> {
  const supabase = createServerSupabaseClient()
  const name_normalized = normaliseCompanyName(params.name)
  const { data, error } = await supabase
    .from('companies')
    .insert({
      owner_id: OWNER_ID,
      name: params.name.trim(),
      name_normalized,
      industry: params.industry || null,
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
  params: { name: string; industry?: string; website?: string; notes?: string }
): Promise<{ data: CompanyRow | null; error: string | null }> {
  const supabase = createServerSupabaseClient()
  const name_normalized = normaliseCompanyName(params.name)
  const { data, error } = await supabase
    .from('companies')
    .update({
      name: params.name.trim(),
      name_normalized,
      industry: params.industry || null,
      website: params.website || null,
      notes: params.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('owner_id', OWNER_ID)
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
  if (count && count > 0) return { error: 'Cannot delete a company with existing applications.' }
  const { error } = await supabase.from('companies').delete().eq('id', id).eq('owner_id', OWNER_ID)
  if (error) return { error: error.message }
  return { error: null }
}

export async function getCompaniesWithApplicationCounts(): Promise<
  Array<CompanyRow & { open_count: number; total_count: number }>
> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('owner_id', OWNER_ID)
    .order('name')
  if (error) throw new Error(error.message)
  const companies = z.array(companyRowSchema).parse(data)
  return Promise.all(
    companies.map(async (company) => {
      const [{ count: totalCount }, { count: openCount }] = await Promise.all([
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('company_id', company.id),
        supabase.from('applications').select('*', { count: 'exact', head: true }).eq('company_id', company.id).eq('outcome', 'pending'),
      ])
      return { ...company, open_count: openCount ?? 0, total_count: totalCount ?? 0 }
    })
  )
}
