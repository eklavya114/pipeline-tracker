import { redirect } from 'next/navigation'
import { CompanyForm } from '@/components/company-form'
import { createCompany } from '@/lib/db/companies'
import { type CompanyFormValues } from '@/lib/zod-schemas/company'

export default function NewCompanyPage() {
  async function handleSubmit(values: CompanyFormValues) {
    'use server'
    const result = await createCompany(values)
    if (result.error) return { error: result.error }
    redirect('/companies')
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Company</h1>
      <CompanyForm onSubmit={handleSubmit} />
    </div>
  )
}
