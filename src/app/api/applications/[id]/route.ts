import { NextResponse } from 'next/server'
import { getApplicationById, updateApplication, deleteApplication } from '@/lib/db/applications'
import { applicationSchema } from '@/lib/zod-schemas/application'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const app = await getApplicationById(params.id)
  if (!app) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(app)
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const parsed = applicationSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 422 })
    }
    const { data, error } = await updateApplication(params.id, parsed.data)
    if (error) return NextResponse.json({ error }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { error } = await deleteApplication(params.id)
  if (error) return NextResponse.json({ error }, { status: 400 })
  return new NextResponse(null, { status: 204 })
}
