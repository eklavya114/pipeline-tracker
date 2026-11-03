import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getApplicationById } from '@/lib/db/applications'
import { getCompanyById } from '@/lib/db/companies'
import { Button } from '@/components/ui/button'
import { DeleteApplicationButton } from '@/components/delete-application-button'

export default async function ApplicationDetailPage({ params }: { params: { id: string } }) {
  const application = await getApplicationById(params.id)
  if (!application) notFound()

  const company = await getCompanyById(application.company_id)

  const fields = [
    { label: 'Company', value: company?.name ?? '—' },
    { label: 'Role', value: application.role_title },
    { label: 'Status', value: application.current_status },
    { label: 'Round', value: application.current_round ?? '—' },
    { label: 'Outcome', value: application.outcome },
    { label: 'Applied', value: application.applied_at ?? '—' },
    { label: 'Source', value: application.source ?? '—' },
  ]

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{application.role_title}</h1>
        <Link href={`/applications/${application.id}/edit`}>
          <Button variant="secondary">Edit</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-100">
        {fields.map(({ label, value }) => (
          <div key={label} className="flex px-6 py-3 gap-4">
            <span className="w-32 text-sm font-medium text-gray-500 shrink-0">{label}</span>
            <span className="text-sm text-gray-900">{value}</span>
          </div>
        ))}
        {application.notes && (
          <div className="flex px-6 py-3 gap-4">
            <span className="w-32 text-sm font-medium text-gray-500 shrink-0">Notes</span>
            <span className="text-sm text-gray-900 whitespace-pre-wrap">{application.notes}</span>
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <DeleteApplicationButton id={application.id} />
      </div>
    </div>
  )
}
