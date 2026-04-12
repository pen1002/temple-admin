import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prismaCyberNotice?: PrismaClient }
const prisma = globalForPrisma.prismaCyberNotice ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaCyberNotice = prisma

// 사이버법당 공지사항 — cyber_offerings type='notice'로 저장
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { temple_slug, title, content, author } = body

    if (!temple_slug || !title?.trim()) {
      return NextResponse.json({ error: 'temple_slug, title 필수' }, { status: 400 })
    }
    if (title.trim().length > 100) {
      return NextResponse.json({ error: '제목은 100자 이내' }, { status: 400 })
    }
    if (content && content.trim().length > 500) {
      return NextResponse.json({ error: '내용은 500자 이내' }, { status: 400 })
    }

    const row = await prisma.cyberOffering.create({
      data: {
        temple_slug,
        type: 'notice',
        name: author?.trim() || '관리자',
        wish: JSON.stringify({ title: title.trim().slice(0, 100), content: (content || '').trim().slice(0, 500) }),
      },
    })

    return NextResponse.json({ ok: true, id: row.id.toString() })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('temple_slug')
    if (!slug) return NextResponse.json({ error: 'temple_slug 필수' }, { status: 400 })

    const rows = await prisma.cyberOffering.findMany({
      where: { temple_slug: slug, type: 'notice' },
      orderBy: { created_at: 'desc' },
      take: 20,
    })

    const notices = rows.map(r => {
      let parsed = { title: '', content: '' }
      try { parsed = JSON.parse(r.wish || '{}') } catch {}
      return { id: r.id.toString(), title: parsed.title, content: parsed.content, author: r.name, date: r.created_at }
    })

    return NextResponse.json(notices)
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
