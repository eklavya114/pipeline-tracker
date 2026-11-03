import { NextResponse } from 'next/server'
import { getApplications, createApplication } from '@/lib/db/applications'
import { applicationSchema } from '@/lib/zod-schemas/application'

export async function GET() {
  try {
    const applications = await getApplications()
    return NextResponse.json(applications)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = applicationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    }
    const { data, error } = await createApplication(parsed.data)
    if (error) return NextResponse.json({ error }, { status: 400 })
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
