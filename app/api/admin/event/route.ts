import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth'
import { getEventList, saveEventList, saveUndo } from '@/lib/kv'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, eventId, date, memo } = body
    await requireSession(slug)

    const events = await getEventList(slug)
    await saveUndo(slug, { type: 'event', events })

    const updated = events.map(e =>
      e.id === eventId ? { ...e, date, memo: memo || '' } : e
    )
    await saveEventList(slug, updated)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN')) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }
    return NextResponse.json({ error: '저장 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
