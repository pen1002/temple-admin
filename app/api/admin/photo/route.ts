import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { requireSession } from '@/lib/auth'
import { addGalleryItem, saveUndo, getGallery } from '@/lib/kv'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const slug = formData.get('slug') as string
    const location = formData.get('location') as string || 'gallery'
    const caption = formData.get('caption') as string || ''

    if (!file) return NextResponse.json({ error: '사진을 선택해주세요.' }, { status: 400 })
    if (!slug) return NextResponse.json({ error: '잘못된 요청입니다.' }, { status: 400 })

    await requireSession(slug)

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: '사진 크기가 10MB를 초과합니다.' }, { status: 400 })
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${slug}/${Date.now()}.${ext}`
    const blob = await put(filename, file, { access: 'public' })

    const old = await getGallery(slug)
    await saveUndo(slug, { type: 'photo', gallery: old })

    await addGalleryItem(slug, {
      url: blob.url,
      caption,
      location,
      uploadedAt: new Date().toISOString(),
    })

    return NextResponse.json({ ok: true, url: blob.url })
  } catch (err) {
    if (err instanceof Error && (err.message === 'UNAUTHORIZED' || err.message === 'FORBIDDEN')) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 })
    }
    console.error('Photo upload error:', err)
    return NextResponse.json({ error: '업로드 중 오류가 발생했습니다.' }, { status: 500 })
  }
}
