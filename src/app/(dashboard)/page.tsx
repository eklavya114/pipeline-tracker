import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { CountCard } from '@/components/ui/count-card'
import { Button } from '@/components/ui/button'
import { getRecentApplications } from '@/lib/db/applications'
import { COPY } from '@/lib/copy'

const OWNER_ID = '00000000-0000-0000-0000-000000000000'

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()

  const [
    { count: totalCompanies },
    { count: pendingOutcomes },
    recentApplications,
  ] = await Promise.all([
    supabase.from('companies').select('*', { count: 'exact', head: true }).eq('owner_id', OWNER_ID),
    supabase
      .from('applications')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', OWNER_ID)
      .eq('outcome', 'pending'),
    getRecentApplications(10),
  ])

  const activeApplications = recentApplications.length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{COPY.dashboard.title}</h1>
        <div className="flex gap-3">
          <Link href="/companies/new">
            <Button variant="secondary">{COPY.dashboard.addCompany}</Button>
          </Link>
          <Link href="/applications/new">
            <Button>{COPY.dashboard.addApplication}</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <CountCard title={COPY.dashboard.totalCompanies} count={totalCompanies ?? 0} />
        <CountCard title={COPY.dashboard.activeApplications} count={activeApplications} />
        <CountCard title={COPY.dashboard.pendingOutcomes} count={pendingOutcomes ?? 0} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">
            {COPY.dashboard.recentApplications}
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Outcome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentApplications.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No applications yet.
                  </td>
                </tr>
              ) : (
                recentApplications.map(app => (
                  <tr key={app.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {app.company_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <Link href={`/applications/${app.id}`} className="hover:text-blue-600">
                        {app.role_title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {app.current_status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {app.outcome}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {app.applied_at ?? '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
