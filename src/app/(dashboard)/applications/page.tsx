import Link from 'next/link'
import { getApplications } from '@/lib/db/applications'
import { getCompanies } from '@/lib/db/companies'
import { Button } from '@/components/ui/button'

export default async function ApplicationsPage() {
  const [applications, companies] = await Promise.all([
    getApplications(),
    getCompanies(),
  ])

  const companyMap = Object.fromEntries(companies.map(c => [c.id, c.name]))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
        <Link href="/applications/new">
          <Button>Add Application</Button>
        </Link>
      </div>

      {applications.length === 0 ? (
        <p className="text-gray-500">No applications yet.</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map(app => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {companyMap[app.company_id] ?? '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <Link href={`/applications/${app.id}`} className="hover:text-blue-600">
                      {app.role_title}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.current_status}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.outcome}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{app.applied_at ?? '—'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm space-x-2">
                    <Link href={`/applications/${app.id}/edit`}>
                      <Button size="sm" variant="secondary">Edit</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
