'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { companySchema, type CompanyFormValues } from '@/lib/zod-schemas/company'
import { COPY } from '@/lib/copy'

interface CompanyFormProps {
  initialValues?: Partial<CompanyFormValues>
  onSubmit: (values: CompanyFormValues) => Promise<{ error: string | null }>
  onCancel?: () => void
}

export function CompanyForm({ initialValues, onSubmit, onCancel }: CompanyFormProps) {
  const router = useRouter()
  const [values, setValues] = useState<CompanyFormValues>({
    name: initialValues?.name ?? '',
    website: initialValues?.website ?? '',
    notes: initialValues?.notes ?? '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof CompanyFormValues, string>>>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    const result = companySchema.safeParse(values)
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CompanyFormValues, string>> = {}
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as keyof CompanyFormValues
        fieldErrors[field] = issue.message
      })
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setIsSubmitting(true)

    const { error } = await onSubmit(result.data)
    setIsSubmitting(false)

    if (error) {
      setSubmitError(error)
      return
    }

    router.push('/companies')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="name"
        label={COPY.companyForm.nameLabel}
        placeholder={COPY.companyForm.namePlaceholder}
        value={values.name}
        onChange={e => setValues(v => ({ ...v, name: e.target.value }))}
        error={errors.name}
        required
      />
      <Input
        id="website"
        label={COPY.companyForm.websiteLabel}
        placeholder={COPY.companyForm.websitePlaceholder}
        value={values.website ?? ''}
        onChange={e => setValues(v => ({ ...v, website: e.target.value }))}
        error={errors.website}
      />
      <Textarea
        id="notes"
        label={COPY.companyForm.notesLabel}
        placeholder={COPY.companyForm.notesPlaceholder}
        value={values.notes ?? ''}
        onChange={e => setValues(v => ({ ...v, notes: e.target.value }))}
        error={errors.notes}
      />
      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      <div className="flex gap-3 justify-end">
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            {COPY.companyForm.cancel}
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {COPY.companyForm.save}
        </Button>
      </div>
    </form>
  )
}
