'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createBrowserSupabaseClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { COPY } from '@/lib/copy'

interface CompanyWithCounts {
  id: string
  name: string
  open_count: number
  total_count: number
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyWithCounts[]>([])
  const [deleteTarget, setDeleteTarget] = useState<CompanyWithCounts | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadCompanies()
  }, [])

  const loadCompanies = async () => {
    setIsLoading(true)
    const supabase = createBrowserSupabaseClient()
    const { data: companiesData } = await supabase
      .from('companies')
      .select('id, name')
      .order('name')

    if (!companiesData) {
      setIsLoading(false)
      return
    }

    const withCounts = await Promise.all(
      companiesData.map(async company => {
        const [{ count: totalCount }, { count: openCount }] = await Promise.all([
          supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id),
          supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('company_id', company.id)
            .eq('outcome', 'pending'),
        ])
        return {
          ...company,
          open_count: openCount ?? 0,
          total_count: totalCount ?? 0,
        }
      })
    )

    setCompanies(withCounts)
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteError(null)

    if (deleteTarget.total_count > 0) {
      setDeleteError(COPY.companies.deleteBlocked)
      return
    }

    const supabase = createBrowserSupabaseClient()
    const { error } = await supabase.from('companies').delete().eq('id', deleteTarget.id)

    if (error) {
      setDeleteError(error.message)
      return
    }

    setDeleteTarget(null)
    await loadCompanies()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{COPY.companies.title}</h1>
        <Link href="/companies/new">
          <Button>{COPY.companies.addCompany}</Button>
        </Link>
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading...</p>
      ) : companies.length === 0 ? (
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
                  <td className="px-6 py-4 text-sm text-gray-600">{company.open_count}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{company.total_count}</td>
                  <td className="px-6 py-4 text-right text-sm space-x-2">
                    <Link href={`/companies/${company.id}/edit`}>
                      <Button size="sm" variant="secondary">
                        {COPY.companies.edit}
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => setDeleteTarget(company)}
                    >
                      {COPY.companies.delete}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        open={!!deleteTarget}
        title="Delete Company"
        description={
          deleteTarget
            ? `Delete "${deleteTarget.name}"?${deleteError ? ' ' + deleteError : ''}`
            : ''
        }
        onConfirm={handleDelete}
        onCancel={() => {
          setDeleteTarget(null)
          setDeleteError(null)
        }}
        confirmLabel="Delete"
        confirmVariant="danger"
      />
    </div>
  )
}
