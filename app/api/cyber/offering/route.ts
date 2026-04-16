import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { notifyTemple, KAKAO_TEMPLATES } from '@/lib/notify'


const VALID_TYPES = ['bow', 'memorial', 'prayer', 'avalokiteshvara', 'indung', 'yeondeung'] as const
const SHEETS_URL = process.env.GOOGLE_SHEET_SCRIPT_URL || ''

const TYPE_LABELS: Record<string, string> = {
  indung: '인등불사', yeondeung: '연등공양', avalokiteshvara: '원불모시기',
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

    // 사찰 정보 조회 (구글시트 + 알림 + 카카오 텍스트용)
    const templeRow = await prisma.temple.findUnique({
      where: { code: temple_slug },
      select: { name: true, kakao_notify_tel: true, phone: true },
    })

    // 구글 시트 기록 (참배 제외)
    if (SHEETS_URL && type !== 'bow') {
      const label = getPrayerLabel(type)
      const isIndungType = ['indung', 'yeondeung', 'avalokiteshvara'].includes(type)
      const templeName = templeRow?.name || temple_slug
      fetch(SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: isIndungType ? 'indung' : type.startsWith('prayer_') ? 'indung' : 'yeondeung',
          templeName,
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
    const tName = templeRow?.name || temple_slug
    const kakaoText = type === 'memorial'
      ? `[${tName} ${label}]\n${name}님이 ${deceased || '영가'}님의 위패를 봉안하였습니다.\n발원: ${wish || ''}`
      : `[${tName} ${label}]\n${name} 불자님이 ${label}에 동참하였습니다.\n발원: ${wish || ''}`

    // 사찰 스님에게 SMS 알림 발송 (참배 제외)
    if (type !== 'bow') {
      const notifyPhone = templeRow?.kakao_notify_tel || templeRow?.phone
      if (notifyPhone) {
        const tplId = type === 'memorial' ? KAKAO_TEMPLATES.MEMORIAL : KAKAO_TEMPLATES.OFFERING
        notifyTemple(notifyPhone, kakaoText, tplId || undefined, {
          '#{사찰명}': tName,
          '#{유형}': label,
          '#{이름}': name.trim(),
          '#{발원}': wish?.trim() || '',
        }).catch(() => {})
      }
    }

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
