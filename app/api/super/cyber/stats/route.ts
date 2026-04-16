import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prismaSuperStats?: PrismaClient }
const prisma = globalForPrisma.prismaSuperStats ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaSuperStats = prisma

import { verifyTempleToken } from '@/lib/auth/templeAuth'

async function checkSuper(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get('temple_auth')?.value || req.headers.get('x-temple-auth') || ''
  if (!token) return false
  const payload = await verifyTempleToken(token)
  return payload?.role === 'super'
}

// GET — 통합 통계
export async function GET(req: NextRequest) {
  if (!(await checkSuper(req))) return NextResponse.json({ error: '권한 없음' }, { status: 403 })
  try {
    const temples = await prisma.temple.findMany({
      where: { temple_type: 'cyber' },
      select: { id: true, code: true, name: true, temple_rank: true },
    })

    const results = await Promise.all(temples.map(async (t) => {
      const [believer, offerings] = await Promise.all([
        prisma.believer.count({ where: { temple_id: t.id, status: '활동' } }),
        prisma.believerOffering.findMany({ where: { temple_id: t.id, status: 'active' }, select: { offering_type: true, price: true } }),
      ])
      const byType = offerings.reduce((acc: Record<string, number>, o) => {
        acc[o.offering_type] = (acc[o.offering_type] || 0) + 1
        return acc
      }, {})
      return {
        ...t,
        believer_count: believer,
        yeondeung_count: byType.yeondeung || 0,
        indung_count: byType.indung || 0,
        avalokiteshvara_count: byType.avalokiteshvara || 0,
        total_amount: offerings.reduce((s, o) => s + (o.price || 0), 0),
      }
    }))

    return NextResponse.json(results.sort((a, b) => b.believer_count - a.believer_count))
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
