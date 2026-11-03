import { z } from 'zod'

export const applicationOutcomeSchema = z.enum(['pending', 'offered', 'rejected', 'withdrawn', 'ghosted'])

export const applicationSchema = z.object({
  company_id: z.string().uuid('Please select a company.'),
  role_title: z.string().min(1, 'Role title is required.'),
  current_status: z.string().min(1, 'Status is required.'),
  current_round: z.string().optional(),
  outcome: applicationOutcomeSchema,
  applied_at: z.string().optional(),
  source: z.string().optional(),
  notes: z.string().optional(),
})

export type ApplicationFormValues = z.infer<typeof applicationSchema>

export const applicationRowSchema = z.object({
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
  company_id: z.string().uuid(),
  candidate_id: z.string().uuid().nullable(),
  role_title: z.string(),
  current_status: z.string(),
  current_round: z.string().nullable(),
  outcome: applicationOutcomeSchema,
  applied_at: z.string().nullable(),
  source: z.string().nullable(),
  notes: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
})

export type ApplicationRow = z.infer<typeof applicationRowSchema>
