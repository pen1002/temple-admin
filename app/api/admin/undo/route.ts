import { NextRequest, NextResponse } from 'next/server'
import { requireSession } from '@/lib/auth'
import { getUndo, clearUndo, saveEventList, saveRitualTimes, saveDharma } from '@/lib/kv'

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json()
    await requireSession(slug)

    const undoData = await getUndo(slug) as Record<string, unknown> | null
    if (!undoData) {
      return NextResponse.json({ error: '취소할 수 있는 작업이 없습니다. (30초가 지났습니다)' }, { status: 400 })
    }

    const { kv } = await import('@vercel/kv')
    const type = undoData.type as string

    if (type === 'notice') {
      const notices = undoData.notices as Array<{ id: string; title: string; content: string; createdAt: string }>
      if (notices[0]) await kv.set(`${slug}:notice_1`, notices[0])
      else await kv.del(`${slug}:notice_1`)
      if (notices[1]) await kv.set(`${slug}:notice_2`, notices[1])
      else await kv.del(`${slug}:notice_2`)
      if (notices[2]) await kv.set(`${slug}:notice_3`, notices[2])
      else await kv.del(`${slug}:notice_3`)
    } else if (type === 'event') {
      await saveEventList(slug, undoData.events as Parameters<typeof saveEventList>[1])
    } else if (type === 'ritual') {
      await saveRitualTimes(slug, undoData.rituals as Parameters<typeof saveRitualTimes>[1])
    } else if (type === 'dharma') {
      await saveDharma(slug, undoData.text as string, undoData.source as string)
    } else if (type === 'photo') {
      await kv.set(`${slug}:gallery_recent`, undoData.gallery)
    }

    await clearUndo(slug)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN')) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }
    return NextResponse.json({ error: '취소 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
