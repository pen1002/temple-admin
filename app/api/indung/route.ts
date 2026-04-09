import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prisma?: PrismaClient }
const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

const SHEETS_WEBHOOK = process.env.GOOGLE_SHEETS_WEBHOOK_URL || ''

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { temple_slug = 'cheongwansa', name, wish, phase = 1 } = body
    const lantern_count = Math.min(10, Math.max(1, parseInt(body.lantern_count) || 1))
    const amount = lantern_count * 30000
    if (!name?.trim()) return NextResponse.json({ error: '이름 필수' }, { status: 400 })

    const donor = await prisma.indungDonor.create({
      data: { temple_slug, name: name.trim(), wish: wish?.trim() || '', amount, lantern_count, phase },
    })

    if (SHEETS_WEBHOOK) {
      fetch(SHEETS_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          created_at: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
          temple: temple_slug,
          name: name.trim(),
          wish: wish?.trim() || '',
          amount: amount + '원',
          lantern_count: lantern_count + '구',
          phase: phase + '차',
        }),
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true, id: donor.id.toString() })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('temple_slug') || 'cheongwansa'
    const phase = req.nextUrl.searchParams.get('phase')
    const donors = await prisma.indungDonor.findMany({
      where: {
        temple_slug: slug,
        ...(phase ? { phase: parseInt(phase) } : {}),
      },
      select: { id: true, name: true, wish: true, lantern_count: true, bank_confirmed: true, created_at: true, phase: true },
      orderBy: { created_at: 'asc' },
      take: 3000,
    })
    return NextResponse.json(donors.map(d => ({ ...d, id: d.id.toString() })))
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'unknown'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
