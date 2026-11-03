import { notFound, redirect } from 'next/navigation'
import { getApplicationById, updateApplication } from '@/lib/db/applications'
import { getCandidateById, upsertCandidate } from '@/lib/db/candidates'
import { getCompanies } from '@/lib/db/companies'
import { getDropdownOptions } from '@/lib/db/dropdown-options'
import { ApplicationForm } from '@/components/application-form'
import { type ApplicationFormValues } from '@/lib/zod-schemas/application'
import { type CandidateFormValues } from '@/lib/zod-schemas/candidate'

export default async function EditApplicationPage({ params }: { params: { id: string } }) {
  const application = await getApplicationById(params.id)
  if (!application) notFound()

  const resolvedApplication = application

  const [companies, statusOptions, roundOptions, existingCandidate] = await Promise.all([
    getCompanies(),
    getDropdownOptions('application_status'),
    getDropdownOptions('interview_round'),
    resolvedApplication.candidate_id
      ? getCandidateById(resolvedApplication.candidate_id)
      : Promise.resolve(null),
  ])

  async function handleSubmit(
    appValues: ApplicationFormValues,
    candidateValues: CandidateFormValues | null
  ) {
    'use server'

    let candidateId = resolvedApplication.candidate_id ?? undefined

    if (candidateValues) {
      const { data: candidate, error: candidateError } = await upsertCandidate(
        candidateValues,
        candidateId
      )
      if (candidateError) return { error: candidateError }
      candidateId = candidate?.id
    }

    const { error } = await updateApplication(params.id, {
      ...appValues,
      candidate_id: candidateId,
    })
    if (error) return { error }

    redirect(`/applications/${params.id}`)
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Application</h1>
      <ApplicationForm
        companies={companies.map(c => ({ id: c.id, name: c.name }))}
        statusOptions={statusOptions}
        roundOptions={roundOptions}
        initialValues={{
          company_id: application.company_id,
          role_title: application.role_title,
          current_status: application.current_status,
          current_round: application.current_round ?? '',
          outcome: application.outcome,
          applied_at: application.applied_at ?? '',
          source: application.source ?? '',
          notes: application.notes ?? '',
        }}
        initialCandidate={
          existingCandidate
            ? {
                full_name: existingCandidate.full_name ?? '',
                email: existingCandidate.email ?? '',
                phone: existingCandidate.phone ?? '',
                linkedin_url: existingCandidate.linkedin_url ?? '',
                notes: existingCandidate.notes ?? '',
              }
            : undefined
        }
        onSubmit={handleSubmit}
      />
    </div>
  )
}
