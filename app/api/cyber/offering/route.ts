import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prismaCyber?: PrismaClient }
const prisma = globalForPrisma.prismaCyber ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaCyber = prisma

const VALID_TYPES = ['bow', 'memorial', 'prayer', 'candle', 'indung', 'yeondeung'] as const
const SHEETS_URL = process.env.GOOGLE_SHEET_SCRIPT_URL || ''

const TYPE_LABELS: Record<string, string> = {
  indung: '인등불사', yeondeung: '연등공양', candle: '초공양',
  memorial: '위패봉안', bow: '참배',
}

function getPrayerLabel(type: string): string {
  if (type.startsWith('prayer_')) {
    const map: Record<string, string> = {
      'prayer_PR-01': '초하루기도', 'prayer_PR-02': '백일기도',
      'prayer_PR-06': '49재', 'prayer_PR-07': '천도재',
      'prayer_PR-08': '정초기도', 'prayer_PR-09': '산신기도',
    }
    return map[type] || '기도'
  }
  return TYPE_LABELS[type] || type
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { temple_slug, type, name, contact, deceased, relationship, prayer_kind, wish, amount } = body

    if (!temple_slug || !type || !name?.trim()) {
      return NextResponse.json({ error: 'temple_slug, type, name 필수' }, { status: 400 })
    }
    const isValidType = VALID_TYPES.includes(type) || type.startsWith('prayer_') || type === 'notice' || type === 'sido'
    if (!isValidType) {
      return NextResponse.json({ error: `type은 ${VALID_TYPES.join('/')} 또는 prayer_* 형식` }, { status: 400 })
    }

    const row = await prisma.cyberOffering.create({
      data: {
        temple_slug,
        type,
        name: name.trim(),
        contact: contact?.trim() || '',
        deceased: deceased?.trim() || null,
        relationship: relationship?.trim() || null,
        prayer_kind: prayer_kind || null,
        wish: wish?.trim() || null,
        amount: parseInt(amount) || 0,
      },
    })

    // 구글 시트 기록 (참배 제외)
    if (SHEETS_URL && type !== 'bow') {
      const label = getPrayerLabel(type)
      const isIndungType = ['indung', 'yeondeung', 'candle'].includes(type)
      fetch(SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: isIndungType ? 'indung' : type.startsWith('prayer_') ? 'indung' : 'yeondeung',
          templeName: '미래사',
          blockCode: type,
          currentRound: 1,
          applicantName: name.trim(),
          wish: type === 'memorial'
            ? `[위패] ${deceased || ''} (${relationship || ''}) ${wish || ''}`
            : wish?.trim() || '',
          contact: contact?.trim() || '',
          amount: parseInt(amount) || 0,
          gridPosition: label,
        }),
      }).catch(() => {})
    }

    // 카카오 공유 텍스트 생성
    const label = getPrayerLabel(type)
    const kakaoText = type === 'memorial'
      ? `[미래사 ${label}]\n${name}님이 ${deceased || '영가'}님의 위패를 봉안하였습니다.\n발원: ${wish || ''}`
      : `[미래사 ${label}]\n${name} 불자님이 ${label}에 동참하였습니다.\n발원: ${wish || ''}`

    return NextResponse.json({ ok: true, id: row.id.toString(), kakaoText })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('temple_slug')
    const type = req.nextUrl.searchParams.get('type')
    const limit = Math.min(10000, parseInt(req.nextUrl.searchParams.get('limit') || '50'))

    if (!slug || !type) {
      return NextResponse.json({ error: 'temple_slug, type 필수' }, { status: 400 })
    }

    const rows = await prisma.cyberOffering.findMany({
      where: { temple_slug: slug, type },
      orderBy: { created_at: 'desc' },
      take: limit,
    })

    return NextResponse.json(rows.map(r => ({ ...r, id: r.id.toString() })))
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
