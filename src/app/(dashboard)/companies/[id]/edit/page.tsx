import { notFound, redirect } from 'next/navigation'
import { getCompanyById, updateCompany } from '@/lib/db/companies'
import { CompanyForm } from '@/components/company-form'
import { type CompanyFormValues } from '@/lib/zod-schemas/company'

export default async function EditCompanyPage({ params }: { params: { id: string } }) {
  const company = await getCompanyById(params.id)
  if (!company) notFound()

  async function handleSubmit(values: CompanyFormValues) {
    'use server'
    const result = await updateCompany(params.id, values)
    if (result.error) return { error: result.error }
    redirect(`/companies/${params.id}`)
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Company</h1>
      <CompanyForm
        initialValues={{
          name: company.name,
          website: company.website ?? '',
          notes: company.notes ?? '',
        }}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
