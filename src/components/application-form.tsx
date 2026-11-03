'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { DetailsBlockPaste } from '@/components/details-block-paste'
import { applicationSchema, type ApplicationFormValues } from '@/lib/zod-schemas/application'
import { type CandidateFormValues } from '@/lib/zod-schemas/candidate'
import { type DetailsBlockParseResult } from '@/lib/details-block-parser'
import { COPY } from '@/lib/copy'

interface Company {
  id: string
  name: string
}

interface ApplicationFormProps {
  companies: Company[]
  statusOptions: string[]
  roundOptions: string[]
  initialValues?: Partial<ApplicationFormValues>
  initialCandidate?: Partial<CandidateFormValues>
  onSubmit: (
    appValues: ApplicationFormValues,
    candidateValues: CandidateFormValues | null
  ) => Promise<{ error: string | null }>
  onCancel?: () => void
}

const OUTCOME_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'offered', label: 'Offered' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
  { value: 'ghosted', label: 'Ghosted' },
]

export function ApplicationForm({
  companies,
  statusOptions,
  roundOptions,
  initialValues,
  initialCandidate,
  onSubmit,
  onCancel,
}: ApplicationFormProps) {
  const router = useRouter()

  const [appValues, setAppValues] = useState<ApplicationFormValues>({
    company_id: initialValues?.company_id ?? '',
    role_title: initialValues?.role_title ?? '',
    current_status: initialValues?.current_status ?? '',
    current_round: initialValues?.current_round ?? '',
    outcome: initialValues?.outcome ?? 'pending',
    applied_at: initialValues?.applied_at ?? '',
    source: initialValues?.source ?? '',
    notes: initialValues?.notes ?? '',
  })

  const [candidateValues, setCandidateValues] = useState<CandidateFormValues>({
    full_name: initialCandidate?.full_name ?? '',
    email: initialCandidate?.email ?? '',
    phone: initialCandidate?.phone ?? '',
    linkedin_url: initialCandidate?.linkedin_url ?? '',
    notes: initialCandidate?.notes ?? '',
  })

  const [showCandidate, setShowCandidate] = useState(
    Object.values(initialCandidate ?? {}).some(Boolean)
  )
  const [appErrors, setAppErrors] = useState<Partial<Record<keyof ApplicationFormValues, string>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const hasCandidateData = Object.values(candidateValues).some(v => v && String(v).trim())

  const handleDetailsBlock = (parsed: DetailsBlockParseResult) => {
    setCandidateValues(prev => ({
      ...prev,
      full_name: parsed.candidateName ?? prev.full_name,
      email: parsed.email ?? prev.email,
      phone: parsed.phone ?? prev.phone,
      linkedin_url: parsed.linkedinUrl ?? prev.linkedin_url,
    }))
    if (parsed.companyName) {
      const match = companies.find(c =>
        c.name.toLowerCase().includes(parsed.companyName!.toLowerCase())
      )
      if (match) setAppValues(prev => ({ ...prev, company_id: match.id }))
    }
    if (parsed.roleTitle) setAppValues(prev => ({ ...prev, role_title: parsed.roleTitle! }))
    if (parsed.status) setAppValues(prev => ({ ...prev, current_status: parsed.status! }))
    if (parsed.round) setAppValues(prev => ({ ...prev, current_round: parsed.round! }))
    if (parsed.appliedAt) setAppValues(prev => ({ ...prev, applied_at: parsed.appliedAt! }))
    if (parsed.source) setAppValues(prev => ({ ...prev, source: parsed.source! }))
    if (parsed.notes) setAppValues(prev => ({ ...prev, notes: parsed.notes! }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    const appResult = applicationSchema.safeParse(appValues)
    if (!appResult.success) {
      const fieldErrors: Partial<Record<keyof ApplicationFormValues, string>> = {}
      appResult.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof ApplicationFormValues
        fieldErrors[field] = issue.message
      })
      setAppErrors(fieldErrors)
      return
    }

    setAppErrors({})
    setIsSubmitting(true)

    const candidateData = hasCandidateData ? candidateValues : null
    const { error } = await onSubmit(appResult.data, candidateData)
    setIsSubmitting(false)

    if (error) {
      setSubmitError(error)
      return
    }

    router.push('/')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Select
          id="company_id"
          label={COPY.applications.company}
          value={appValues.company_id}
          onChange={e => setAppValues(v => ({ ...v, company_id: e.target.value }))}
          options={companies.map(c => ({ value: c.id, label: c.name }))}
          placeholder="Select a company"
          error={appErrors.company_id}
        />
        <Input
          id="role_title"
          label={COPY.applications.role}
          value={appValues.role_title}
          onChange={e => setAppValues(v => ({ ...v, role_title: e.target.value }))}
          error={appErrors.role_title}
          required
        />
        <Select
          id="current_status"
          label={COPY.applications.status}
          value={appValues.current_status}
          onChange={e => setAppValues(v => ({ ...v, current_status: e.target.value }))}
          options={statusOptions.map(s => ({ value: s, label: s }))}
          placeholder="Select status"
          error={appErrors.current_status}
        />
        <Select
          id="current_round"
          label={COPY.applications.round}
          value={appValues.current_round ?? ''}
          onChange={e => setAppValues(v => ({ ...v, current_round: e.target.value }))}
          options={roundOptions.map(r => ({ value: r, label: r }))}
          placeholder="Select round (optional)"
        />
        <Select
          id="outcome"
          label={COPY.applications.outcome}
          value={appValues.outcome}
          onChange={e =>
            setAppValues(v => ({
              ...v,
              outcome: e.target.value as ApplicationFormValues['outcome'],
            }))
          }
          options={OUTCOME_OPTIONS}
          error={appErrors.outcome}
        />
        <Input
          id="applied_at"
          type="date"
          label={COPY.applications.appliedAt}
          value={appValues.applied_at ?? ''}
          onChange={e => setAppValues(v => ({ ...v, applied_at: e.target.value }))}
        />
        <Input
          id="source"
          label={COPY.applications.source}
          value={appValues.source ?? ''}
          onChange={e => setAppValues(v => ({ ...v, source: e.target.value }))}
        />
        <Textarea
          id="notes"
          label={COPY.applications.notes}
          value={appValues.notes ?? ''}
          onChange={e => setAppValues(v => ({ ...v, notes: e.target.value }))}
        />
      </div>

      <div className="border-t pt-4">
        <button
          type="button"
          onClick={() => setShowCandidate(s => !s)}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          {showCandidate ? '▲' : '▶'} {COPY.applications.candidateSection}
        </button>

        {showCandidate && (
          <div className="mt-4 space-y-4">
            <DetailsBlockPaste onParsed={handleDetailsBlock} />
            <Input
              id="full_name"
              label={COPY.applications.candidateName}
              value={candidateValues.full_name ?? ''}
              onChange={e => setCandidateValues(v => ({ ...v, full_name: e.target.value }))}
            />
            <Input
              id="email"
              type="email"
              label={COPY.applications.email}
              value={candidateValues.email ?? ''}
              onChange={e => setCandidateValues(v => ({ ...v, email: e.target.value }))}
            />
            <Input
              id="phone"
              label={COPY.applications.phone}
              value={candidateValues.phone ?? ''}
              onChange={e => setCandidateValues(v => ({ ...v, phone: e.target.value }))}
            />
            <Input
              id="linkedin_url"
              label={COPY.applications.linkedinUrl}
              value={candidateValues.linkedin_url ?? ''}
              onChange={e => setCandidateValues(v => ({ ...v, linkedin_url: e.target.value }))}
            />
          </div>
        )}
      </div>

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {COPY.applications.cancel}
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {COPY.applications.save}
        </Button>
      </div>
    </form>
  )
}
