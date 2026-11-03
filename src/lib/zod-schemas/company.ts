import { z } from 'zod'

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required.'),
  website: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  notes: z.string().optional(),
})

export type CompanyFormValues = z.infer<typeof companySchema>

export const companyRowSchema = z.object({
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
  name: z.string(),
  name_normalized: z.string(),
  website: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type CompanyRow = z.infer<typeof companyRowSchema>
