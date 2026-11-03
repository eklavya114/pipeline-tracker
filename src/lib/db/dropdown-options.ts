import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'

const dropdownOptionRowSchema = z.object({
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
  category: z.string(),
  label: z.string(),
  sort_order: z.number(),
  created_at: z.string(),
})

export type DropdownOptionRow = z.infer<typeof dropdownOptionRowSchema>

export async function getDropdownOptions(category: string): Promise<string[]> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('dropdown_options')
    .select('*')
    .eq('category', category)
    .order('sort_order')

  if (error) throw new Error(error.message)
  return z.array(dropdownOptionRowSchema).parse(data).map(row => row.label)
}
