import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prismaSido?: PrismaClient }
const prisma = globalForPrisma.prismaSido ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaSido = prisma

const SHEETS_URL = process.env.GOOGLE_SHEET_SCRIPT_URL || ''

// GET /api/cyber/sido?q=배영국&temple_slug=miraesa
export async function GET(req: NextRequest) {
  try {
    const q = req.nextUrl.searchParams.get('q')?.trim()
    const slug = req.nextUrl.searchParams.get('temple_slug') || 'miraesa'
    if (!q) return NextResponse.json([])

    // 신도 등록 검색
    const sidos = await prisma.cyberOffering.findMany({
      where: { temple_slug: slug, type: 'sido', name: { contains: q } },
      orderBy: { created_at: 'desc' }, take: 10,
    })

    // 해당 이름으로 접수한 기도/공양 내역 검색
    const offerings = await prisma.cyberOffering.findMany({
      where: { temple_slug: slug, type: { not: 'sido' }, name: { contains: q } },
      orderBy: { created_at: 'desc' }, take: 50,
    })

    // 유형별 집계
    const summary: Record<string, number> = {}
    offerings.forEach(o => {
      const label = o.type.replace('prayer_', '').replace('PR-01', '초하루기도').replace('PR-02', '백일기도').replace('PR-06', '49재').replace('PR-07', '천도재').replace('PR-08', '정초기도').replace('PR-09', '산신기도')
      summary[label] = (summary[label] || 0) + 1
    })

    const results = sidos.map(s => {
      let parsed: Record<string, string> = {}
      try {
        const parts = (s.wish || '').split(' ')
        parts.forEach(p => { const [k, v] = p.split(':'); if (k && v) parsed[k] = v; })
      } catch {}
      return {
        id: s.id.toString(),
        name: s.name,
        contact: s.contact,
        beopMyeong: parsed['법명'] || '-',
        address: parsed['주소'] || '-',
        date: s.created_at,
        offerings: summary,
      }
    })

    return NextResponse.json(results)
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

// POST /api/cyber/sido — 신도 등록 + 구글시트 기록
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { temple_slug = 'miraesa', names, beopMyeong, address, contact } = body

    if (!names?.trim() || !contact?.trim()) {
      return NextResponse.json({ error: '성함, 전화번호 필수' }, { status: 400 })
    }

    const row = await prisma.cyberOffering.create({
      data: {
        temple_slug, type: 'sido',
        name: names.trim(),
        contact: contact.trim(),
        wish: `법명:${beopMyeong || '-'} 주소:${address || '-'}`,
      },
    })

    // 구글시트 기록
    if (SHEETS_URL) {
      fetch(SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'indung',
          templeName: '미래사',
          blockCode: 'sido',
          currentRound: 1,
          applicantName: names.trim(),
          wish: `[신도등록] 법명:${beopMyeong || '-'} 주소:${address || '-'}`,
          contact: contact.trim(),
          amount: 0,
          gridPosition: '신도카드',
        }),
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true, id: row.id.toString() })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
