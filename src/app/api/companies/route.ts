import { NextResponse } from 'next/server'
import { getCompanies, createCompany } from '@/lib/db/companies'
import { z } from 'zod'

const createSchema = z.object({
  name: z.string().min(1),
  industry: z.string().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET() {
  try {
    const companies = await getCompanies()
    return NextResponse.json(companies)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    }
    const { data, error } = await createCompany(parsed.data)
    if (error) return NextResponse.json({ error }, { status: 400 })
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
