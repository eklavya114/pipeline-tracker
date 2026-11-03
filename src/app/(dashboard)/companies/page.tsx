import Link from 'next/link'
import { getCompaniesWithApplicationCounts } from '@/lib/db/companies'
import { Button } from '@/components/ui/button'
import { COPY } from '@/lib/copy'

export default async function CompaniesPage() {
  const companies = await getCompaniesWithApplicationCounts()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{COPY.companies.title}</h1>
        <Link href="/companies/new">
          <Button>{COPY.companies.addCompany}</Button>
        </Link>
      </div>

      {companies.length === 0 ? (
        <p className="text-gray-500">{COPY.companies.noCompanies}</p>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {COPY.companies.name}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Industry
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {COPY.companies.openApplications}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {COPY.companies.totalApplications}
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map(company => (
                <tr key={company.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    <Link href={`/companies/${company.id}`} className="hover:text-blue-600">
                      {company.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {company.industry ?? '—'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{company.open_count}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{company.total_count}</td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <Link href={`/companies/${company.id}/edit`}>
                      <Button size="sm" variant="secondary">
                        {COPY.companies.edit}
                      </Button>
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
