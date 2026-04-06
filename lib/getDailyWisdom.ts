import { db } from '@/lib/db'

export interface DailyWisdomData {
  monthDay: string
  title: string
  content: string
  source: string
  verse?: string | null
  isOverride?: boolean
}

export async function getDailyWisdom(slug: string): Promise<DailyWisdomData | null> {
  const now = new Date()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const monthDay = `${mm}-${dd}`

  // 사찰 Override 먼저 확인
  const temple = await db.temple.findFirst({ where: { code: slug }, select: { id: true } })
  if (temple) {
    const override = await db.templeWisdomOverride.findFirst({
      where: { templeId: temple.id, monthDay, isActive: true },
    })
    if (override) {
      return {
        monthDay,
        title: '오늘의 부처님말씀',
        content: override.content,
        source: slug + ' 특별 말씀',
        isOverride: true,
      }
    }
  }

  // 공통 365일 말씀
  const wisdom = await db.dailyWisdom.findUnique({ where: { monthDay } })
  if (!wisdom) return null

  return {
    monthDay: wisdom.monthDay,
    title: wisdom.title,
    content: wisdom.content,
    source: wisdom.source,
    verse: wisdom.verse,
    isOverride: false,
  }
}
