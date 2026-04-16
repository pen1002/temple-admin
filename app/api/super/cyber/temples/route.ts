import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prismaSuperTemples?: PrismaClient }
const prisma = globalForPrisma.prismaSuperTemples ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaSuperTemples = prisma

import { verifyTempleToken } from '@/lib/auth/templeAuth'

async function checkSuper(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('temple_auth')?.value || req.headers.get('x-temple-auth') || ''
  if (!token) return false
  const payload = await verifyTempleToken(token)
  return payload?.role === 'super'
}

// GET — 전체 사이버사찰 + 통계
export async function GET(req: NextRequest) {
  if (!(await checkSuper(req))) return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  try {
    const temples = await prisma.temple.findMany({
      where: { temple_type: 'cyber' },
      orderBy: { registered_at: 'asc' },
      select: {
        id: true, code: true, name: true, temple_rank: true, isActive: true,
        admin_pin: true, pin_changed: true, contact_monk: true,
        phone: true, address: true,
      },
    })

    // 사찰별 통계 집계
    const results = await Promise.all(temples.map(async (t) => {
      const [believer, offerings] = await Promise.all([
        prisma.believer.count({ where: { temple_id: t.id, status: '활동' } }),
        prisma.believerOffering.findMany({ where: { temple_id: t.id, status: 'active' }, select: { offering_type: true, price: true } }),
      ])
      const byType = offerings.reduce((acc: Record<string, number>, o) => {
        acc[o.offering_type] = (acc[o.offering_type] || 0) + 1
        return acc
      }, {})
      const totalAmount = offerings.reduce((s, o) => s + (o.price || 0), 0)
      return {
        ...t,
        believer_count: believer,
        offering_count: offerings.length,
        yeondeung_count: byType.yeondeung || 0,
        indung_count: byType.indung || 0,
        avalokiteshvara_count: byType.avalokiteshvara || 0,
        total_amount: totalAmount,
      }
    }))

    return NextResponse.json(results)
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

// POST — 말사 신규 등록
export async function POST(req: NextRequest) {
  if (!(await checkSuper(req))) return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  try {
    const { code, name, contact_monk, phone, address } = await req.json()
    if (!code || !name) return NextResponse.json({ error: 'code, name 필수' }, { status: 400 })

    // 본사 찾기 (미래사)
    const bonsa = await prisma.temple.findFirst({ where: { temple_rank: 'bonsa' }, select: { id: true } })

    const created = await prisma.temple.create({
      data: {
        code: code.toLowerCase(),
        name,
        temple_type: 'cyber',
        temple_rank: 'malsa',
        parent_temple_id: bonsa?.id || null,
        contact_monk: contact_monk || null,
        phone: phone || null,
        address: address || null,
        admin_pin: '0000',
        pin_changed: false,
        isActive: true,
      },
    })
    return NextResponse.json({ ok: true, id: created.id, code: created.code })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
