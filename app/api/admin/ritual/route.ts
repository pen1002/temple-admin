import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireSession } from '@/lib/auth'
import { getRitualTimes, saveRitualTimes, saveUndo } from '@/lib/kv'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, ritualId, time } = body
    await requireSession(slug)

    const rituals = await getRitualTimes(slug)
    await saveUndo(slug, { type: 'ritual', rituals })

    const updated = rituals.map(r =>
      r.id === ritualId ? { ...r, time } : r
    )
    await saveRitualTimes(slug, updated)
    revalidatePath(`/${slug}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN')) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }
    return NextResponse.json({ error: '저장 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
