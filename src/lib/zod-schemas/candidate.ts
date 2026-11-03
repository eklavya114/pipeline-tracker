import { z } from 'zod'

export const candidateSchema = z.object({
  full_name: z.string().optional(),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  linkedin_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  notes: z.string().optional(),
})

export type CandidateFormValues = z.infer<typeof candidateSchema>

export const candidateRowSchema = z.object({
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
  full_name: z.string().nullable(),
  email: z.string().nullable(),
  phone: z.string().nullable(),
  linkedin_url: z.string().nullable(),
  resume_url: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type CandidateRow = z.infer<typeof candidateRowSchema>
