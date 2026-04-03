import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { requireSession } from '@/lib/auth'
import { getDharma, saveDharma, saveUndo } from '@/lib/kv'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { slug, text, source } = body
    await requireSession(slug)

    if (!text?.trim()) {
      return NextResponse.json({ error: '법문 내용을 입력해주세요.' }, { status: 400 })
    }

    const old = await getDharma(slug)
    await saveUndo(slug, { type: 'dharma', text: old.text, source: old.source })
    await saveDharma(slug, text.trim(), source?.trim() || '')
    revalidatePath(`/${slug}`)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN')) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }
    return NextResponse.json({ error: '저장 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
