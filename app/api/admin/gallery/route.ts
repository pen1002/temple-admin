import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getGallery, setRaw } from '@/lib/kv'

// GET: 갤러리 목록 반환
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const slug = searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug 필요' }, { status: 400 })

  const session = await getSession()
  if (!session || session.slug !== slug) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const gallery = await getGallery(slug)
  return NextResponse.json({ gallery })
}

// PATCH: 특정 인덱스 갤러리 항목 caption 수정
export async function PATCH(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const { slug, index, caption } = await req.json() as { slug: string; index: number; caption: string }
  if (!slug || index === undefined) return NextResponse.json({ error: '필수값 누락' }, { status: 400 })
  if (session.slug !== slug) return NextResponse.json({ error: '권한 없음' }, { status: 403 })

  const gallery = await getGallery(slug)
  if (index < 0 || index >= gallery.length) return NextResponse.json({ error: '잘못된 인덱스' }, { status: 400 })

  gallery[index] = { ...gallery[index], caption: caption.trim() }
  await setRaw(`${slug}:gallery_recent`, gallery)

  return NextResponse.json({ ok: true })
}

// DELETE: 특정 인덱스 갤러리 항목 삭제
export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: '인증 필요' }, { status: 401 })

  const { slug, index } = await req.json() as { slug: string; index: number }
  if (!slug || index === undefined) return NextResponse.json({ error: '필수값 누락' }, { status: 400 })
  if (session.slug !== slug) return NextResponse.json({ error: '권한 없음' }, { status: 403 })

  const gallery = await getGallery(slug)
  if (index < 0 || index >= gallery.length) return NextResponse.json({ error: '잘못된 인덱스' }, { status: 400 })

  gallery.splice(index, 1)
  await setRaw(`${slug}:gallery_recent`, gallery)

  return NextResponse.json({ ok: true })
}
