import { redirect } from 'next/navigation'
import { getCompanies } from '@/lib/db/companies'
import { getDropdownOptions } from '@/lib/db/dropdown-options'
import { createApplication } from '@/lib/db/applications'
import { upsertCandidate } from '@/lib/db/candidates'
import { ApplicationForm } from '@/components/application-form'
import { type ApplicationFormValues } from '@/lib/zod-schemas/application'
import { type CandidateFormValues } from '@/lib/zod-schemas/candidate'

export default async function NewApplicationPage() {
  const [companies, statusOptions, roundOptions] = await Promise.all([
    getCompanies(),
    getDropdownOptions('application_status'),
    getDropdownOptions('interview_round'),
  ])

  async function handleSubmit(
    appValues: ApplicationFormValues,
    candidateValues: CandidateFormValues | null
  ) {
    'use server'

    let candidateId: string | undefined

    if (candidateValues) {
      const { data: candidate, error: candidateError } = await upsertCandidate(candidateValues)
      if (candidateError) return { error: candidateError }
      candidateId = candidate?.id
    }

    const { data, error } = await createApplication({ ...appValues, candidate_id: candidateId })
    if (error) return { error }

    redirect(`/applications/${data!.id}`)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Application</h1>
      <ApplicationForm
        companies={companies.map(c => ({ id: c.id, name: c.name }))}
        statusOptions={statusOptions}
        roundOptions={roundOptions}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
