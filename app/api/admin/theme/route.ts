// POST /api/admin/theme — pageTemplate 업데이트 + ISR revalidate
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

const VALID_THEMES = ['standard', 'borimsa-type', 'seonunsa-type'] as const

export async function POST(request: Request) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: '인증 필요' }, { status: 401 })
    }

    const { slug, theme } = await request.json()

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'slug 필요' }, { status: 400 })
    }
    if (!VALID_THEMES.includes(theme)) {
      return NextResponse.json({ error: '유효하지 않은 테마' }, { status: 400 })
    }
    // 세션 slug와 요청 slug 일치 확인
    if (session.slug !== slug) {
      return NextResponse.json({ error: '권한 없음' }, { status: 403 })
    }

    await db.temple.update({
      where: { code: slug },
      data: { pageTemplate: theme },
    })

    // ISR 캐시 즉시 무효화
    revalidatePath(`/${slug}`)

    return NextResponse.json({ ok: true, theme })
  } catch (e) {
    console.error('[theme API]', e)
    return NextResponse.json({ error: '서버 오류' }, { status: 500 })
  }
}
