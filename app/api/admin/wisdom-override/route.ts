import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireSession } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: '잘못된 요청' }, { status: 400 })

  await requireSession(slug)

  const now = new Date()
  const mm = String(now.getMonth() + 1).padStart(2, '0')
  const dd = String(now.getDate()).padStart(2, '0')
  const monthDay = `${mm}-${dd}`

  const wisdom = await db.dailyWisdom.findUnique({ where: { monthDay } })
  const temple = await db.temple.findFirst({ where: { code: slug }, select: { id: true } })
  const override = temple
    ? await db.templeWisdomOverride.findFirst({
        where: { templeId: temple.id, monthDay },
      })
    : null

  return NextResponse.json({ wisdom, override, monthDay })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, content, isActive } = body
    await requireSession(slug)

    const now = new Date()
    const mm = String(now.getMonth() + 1).padStart(2, '0')
    const dd = String(now.getDate()).padStart(2, '0')
    const monthDay = `${mm}-${dd}`

    const temple = await db.temple.findFirst({ where: { code: slug }, select: { id: true } })
    if (!temple) return NextResponse.json({ error: '사찰을 찾을 수 없습니다.' }, { status: 404 })

    if (isActive === false) {
      // Override 비활성화 (공통 말씀으로 복귀)
      await db.templeWisdomOverride.updateMany({
        where: { templeId: temple.id, monthDay },
        data: { isActive: false },
      })
    } else {
      // Override 저장
      if (!content?.trim()) {
        return NextResponse.json({ error: '내용을 입력해주세요.' }, { status: 400 })
      }
      await db.templeWisdomOverride.upsert({
        where: { templeId_monthDay: { templeId: temple.id, monthDay } },
        update: { content: content.trim(), isActive: true },
        create: { templeId: temple.id, monthDay, content: content.trim(), isActive: true },
      })
    }

    revalidatePath(`/${slug}`)
    return NextResponse.json({ ok: true, monthDay })
  } catch (err) {
    if (err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN')) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }
    return NextResponse.json({ error: '저장 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
