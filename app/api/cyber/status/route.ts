import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prismaStatus?: PrismaClient }
const prisma = globalForPrisma.prismaStatus ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaStatus = prisma

const TYPE_CONFIG = [
  { type: 'yeondeung', name: '초파일봉축연등', unit: '등', round: 30 },
  { type: 'indung', name: '인등불사', unit: '등', round: 30 },
  { type: 'avalokiteshvara', name: '원불모시기', unit: '등', round: 30 },
  { type: 'prayer_PR-01', name: '초하루기도', unit: '등', round: 100 },
  { type: 'prayer_PR-02', name: '백일기도', unit: '등', round: 100 },
  { type: 'prayer_PR-06', name: '49재', unit: '등', round: 100 },
  { type: 'prayer_PR-07', name: '천도재', unit: '등', round: 100 },
  { type: 'prayer_PR-08', name: '정초기도', unit: '등', round: 100 },
  { type: 'prayer_PR-09', name: '산신기도', unit: '등', round: 100 },
]

// GET /api/cyber/status?temple_slug=miraesa
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('temple_slug')
  if (!slug) return NextResponse.json({ error: 'temple_slug 필수' }, { status: 400 })

  try {
    const counts = await prisma.cyberOffering.groupBy({
      by: ['type'],
      where: { temple_slug: slug, type: { in: TYPE_CONFIG.map(t => t.type) } },
      _count: true,
    })

    const countMap: Record<string, number> = {}
    counts.forEach(c => { countMap[c.type] = c._count })

    const result = TYPE_CONFIG.map(t => ({
      name: t.name,
      current: countMap[t.type] || 0,
      total: Math.max(t.round, Math.ceil((countMap[t.type] || 0) / t.round) * t.round),
      unit: t.unit,
    }))

    return NextResponse.json(result)
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
