import { NextResponse } from 'next/server'
import { getCompanyById, updateCompany, deleteCompany } from '@/lib/db/companies'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(1),
  industry: z.string().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const company = await getCompanyById(params.id)
  if (!company) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(company)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    }
    const { data, error } = await updateCompany(params.id, parsed.data)
    if (error) return NextResponse.json({ error }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { error } = await deleteCompany(params.id)
  if (error) return NextResponse.json({ error }, { status: 400 })
  return new NextResponse(null, { status: 204 })
}
