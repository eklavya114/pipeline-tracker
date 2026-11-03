import { notFound, redirect } from 'next/navigation'
import { getCompanyById, updateCompany } from '@/lib/db/companies'
import { CompanyForm } from '@/components/company-form'
import { DeleteCompanyButton } from '@/components/delete-company-button'
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
    <div className="max-w-lg space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Company</h1>
        <CompanyForm
          initialValues={{
            name: company.name,
            industry: company.industry ?? '',
            website: company.website ?? '',
            notes: company.notes ?? '',
          }}
          onSubmit={handleSubmit}
        />
      </div>
      <div className="border-t pt-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Danger Zone</h2>
        <DeleteCompanyButton id={company.id} />
      </div>
    </div>
  )
}
