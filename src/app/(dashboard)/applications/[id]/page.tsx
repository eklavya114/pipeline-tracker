import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getApplicationById } from '@/lib/db/applications'
import { getCandidateById } from '@/lib/db/candidates'
import { getOutcomeHistory } from '@/lib/db/outcome-history'
import { getCompanyById } from '@/lib/db/companies'
import { OutcomeHistoryTimeline } from '@/components/outcome-history-timeline'
import { Button } from '@/components/ui/button'
import { COPY } from '@/lib/copy'

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const application = await getApplicationById(params.id)
  if (!application) notFound()

  const [company, candidate, history] = await Promise.all([
    getCompanyById(application.company_id),
    application.candidate_id
      ? getCandidateById(application.candidate_id)
      : Promise.resolve(null),
    getOutcomeHistory(params.id),
  ])

  return (
    <div className="max-w-2xl space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{application.role_title}</h1>
        <Link href={`/applications/${params.id}/edit`}>
          <Button variant="secondary">{COPY.applications.edit}</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">{COPY.applications.company}</p>
            <p className="text-sm font-medium text-gray-900">{company?.name ?? '—'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">{COPY.applications.status}</p>
            <p className="text-sm font-medium text-gray-900">{application.current_status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">{COPY.applications.round}</p>
            <p className="text-sm font-medium text-gray-900">
              {application.current_round ?? '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">{COPY.applications.outcome}</p>
            <p className="text-sm font-medium text-gray-900">{application.outcome}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">{COPY.applications.appliedAt}</p>
            <p className="text-sm font-medium text-gray-900">
              {application.applied_at ?? '—'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">{COPY.applications.source}</p>
            <p className="text-sm font-medium text-gray-900">{application.source ?? '—'}</p>
          </div>
        </div>
        {application.notes && (
          <div>
            <p className="text-xs text-gray-500 uppercase">{COPY.applications.notes}</p>
            <p className="text-sm text-gray-900">{application.notes}</p>
          </div>
        )}
      </div>

      {candidate && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-3">
          <h2 className="text-base font-semibold text-gray-900">
            {COPY.applications.candidateSection}
          </h2>
          {candidate.full_name && (
            <p className="text-sm text-gray-900">{candidate.full_name}</p>
          )}
          {candidate.email && <p className="text-sm text-gray-600">{candidate.email}</p>}
          {candidate.phone && <p className="text-sm text-gray-600">{candidate.phone}</p>}
          {candidate.linkedin_url && (
            <a
              href={candidate.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              LinkedIn
            </a>
          )}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <OutcomeHistoryTimeline history={history} />
      </div>
    </div>
  )
}
