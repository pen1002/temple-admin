// GET /api/wisdom?monthDay=MM-DD&slug=borimsa
// 네비게이션용 날짜별 부처님말씀 조회
import { NextResponse, type NextRequest } from 'next/server'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const monthDay = searchParams.get('monthDay') ?? ''
  const slug     = searchParams.get('slug')     ?? ''

  if (!/^\d{2}-\d{2}$/.test(monthDay)) {
    return NextResponse.json(null, { status: 400 })
  }

  // 사찰 Override 확인
  const temple = await db.temple.findFirst({ where: { code: slug }, select: { id: true } })
  if (temple) {
    const override = await db.templeWisdomOverride.findFirst({
      where: { templeId: temple.id, monthDay, isActive: true },
    })
    if (override) {
      return NextResponse.json({
        monthDay,
        title:   '오늘의 짬짜미 부처님말씀',
        content: override.content,
        source:  slug + ' 특별 말씀',
        isOverride: true,
      })
    }
  }

  // 공통 365일 말씀
  const wisdom = await db.dailyWisdom.findUnique({ where: { monthDay } })
  if (!wisdom) return NextResponse.json(null)

  return NextResponse.json({
    monthDay: wisdom.monthDay,
    title:    wisdom.title,
    content:  wisdom.content,
    source:   wisdom.source,
    verse:    wisdom.verse ?? null,
    isOverride: false,
  })
}
