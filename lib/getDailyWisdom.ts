import { db } from '@/lib/db'

export interface DailyWisdomData {
  monthDay: string
  title: string
  content: string
  source: string
  verse?: string | null
  isOverride?: boolean
}

/**
 * KST(UTC+9) 정오(12:00) 기준 날짜 반환
 * - 오전 11:59 KST 이전 → 전날 말씀 유지
 * - 정오 12:00 KST 이후 → 당일 말씀 전환
 */
export function getKstWisdomDate(): string {
  const now = new Date()
  // UTC 기준 KST 시각 계산 (UTC+9)
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  // 정오 이전이면 전날 날짜 사용
  if (kst.getUTCHours() < 12) {
    kst.setUTCDate(kst.getUTCDate() - 1)
  }
  const mm = String(kst.getUTCMonth() + 1).padStart(2, '0')
  const dd = String(kst.getUTCDate()).padStart(2, '0')
  return `${mm}-${dd}`
}

export async function getDailyWisdom(slug: string): Promise<DailyWisdomData | null> {
  const monthDay = getKstWisdomDate()

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
