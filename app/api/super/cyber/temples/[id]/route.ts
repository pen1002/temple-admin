import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prismaSuperTemple?: PrismaClient }
const prisma = globalForPrisma.prismaSuperTemple ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaSuperTemple = prisma

function checkSuper(req: NextRequest) { return req.headers.get('x-role') === 'super' }

// PATCH — 활성화/비활성화/PIN초기화
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!checkSuper(req)) return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  try {
    const { id } = await params
    const body = await req.json()
    const allowed: Record<string, unknown> = {}
    if (body.isActive !== undefined) allowed.isActive = body.isActive
    if (body.admin_pin !== undefined) allowed.admin_pin = body.admin_pin
    if (body.pin_changed !== undefined) allowed.pin_changed = body.pin_changed
    if (body.contact_monk !== undefined) allowed.contact_monk = body.contact_monk

    const updated = await prisma.temple.update({ where: { id }, data: allowed })
    return NextResponse.json({ ok: true, temple: updated })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
