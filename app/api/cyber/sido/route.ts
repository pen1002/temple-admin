import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { notifyTemple, KAKAO_TEMPLATES } from '@/lib/notify'

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

    const TYPE_LABELS: Record<string, string> = {
      indung: '인등불사', yeondeung: '연등공양', avalokiteshvara: '원불모시기',
      memorial: '위패봉안', bow: '참배',
      'prayer_PR-01': '초하루기도', 'prayer_PR-02': '백일기도',
      'prayer_PR-06': '49재', 'prayer_PR-07': '천도재',
      'prayer_PR-08': '정초기도', 'prayer_PR-09': '산신기도',
    }

    const results = await Promise.all(sidos.map(async (s) => {
      let parsed: Record<string, string> = {}
      try {
        const parts = (s.wish || '').split(' ')
        parts.forEach(p => { const [k, v] = p.split(':'); if (k && v) parsed[k] = v; })
      } catch {}

      // 가족 이름 목록 추출 (쉼표 구분)
      const familyNames = s.name.split(',').map(n => n.trim()).filter(Boolean)

      // 가족 전체 기도/공양 내역 검색
      const familyOfferings = await prisma.cyberOffering.findMany({
        where: {
          temple_slug: slug,
          type: { notIn: ['sido', 'notice'] },
          OR: familyNames.map(fn => ({ name: { contains: fn } })),
        },
        orderBy: { created_at: 'desc' }, take: 200,
      })

      // 개별 offering 상세 (금액, 날짜, 납부여부 포함)
      const offeringDetails = familyOfferings.map(o => ({
        id: o.id.toString(),
        name: o.name,
        type: o.type,
        label: TYPE_LABELS[o.type] || o.type,
        amount: o.amount,
        paid: o.bank_confirmed,
        date: o.created_at,
        wish: o.wish,
      }))

      // 전체 합산 금액
      const totalAmount = familyOfferings.reduce((s, o) => s + o.amount, 0)
      const paidAmount = familyOfferings.filter(o => o.bank_confirmed).reduce((s, o) => s + o.amount, 0)

      return {
        id: s.id.toString(),
        name: s.name,
        contact: s.contact,
        beopMyeong: parsed['법명'] || '-',
        address: parsed['주소'] || '-',
        date: s.created_at,
        familyNames,
        offeringDetails,
        totalAmount,
        paidAmount,
      }
    }))

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

    // 사찰 정보 조회
    const templeRow = await prisma.temple.findUnique({
      where: { code: temple_slug },
      select: { name: true, kakao_notify_tel: true, phone: true },
    })
    const templeName = templeRow?.name || temple_slug

    // 구글시트 기록
    if (SHEETS_URL) {
      fetch(SHEETS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'indung',
          templeName,
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

    // 사찰 스님에게 알림
    const notifyPhone = templeRow?.kakao_notify_tel || templeRow?.phone
    if (notifyPhone) {
      const sidoMsg = `[${templeName} 신도등록]\n${names.trim()}님이 신도로 등록되었습니다.\n법명: ${beopMyeong || '-'}\n연락처: ${contact.trim()}`
      notifyTemple(notifyPhone, sidoMsg, KAKAO_TEMPLATES.SIDO || undefined, {
        '#{사찰명}': templeName,
        '#{이름}': names.trim(),
        '#{법명}': beopMyeong || '-',
        '#{연락처}': contact.trim(),
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true, id: row.id.toString() })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

// PATCH /api/cyber/sido — 납부 확인 토글 또는 신도카드 수정
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, paid, names, beopMyeong, address, contact } = body
    if (!id) return NextResponse.json({ error: 'id 필수' }, { status: 400 })

    // 납부 토글
    if (paid !== undefined) {
      await prisma.cyberOffering.update({
        where: { id: BigInt(id) },
        data: { bank_confirmed: Boolean(paid) },
      })
      return NextResponse.json({ ok: true })
    }

    // 신도카드 수정
    if (names) {
      await prisma.cyberOffering.update({
        where: { id: BigInt(id) },
        data: {
          name: names.trim(),
          contact: contact?.trim() || '',
          wish: `법명:${beopMyeong || '-'} 주소:${address || '-'}`,
        },
      })
      return NextResponse.json({ ok: true })
    }

    return NextResponse.json({ error: '수정할 데이터 없음' }, { status: 400 })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

// DELETE /api/cyber/sido — 신도카드 삭제
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id 필수' }, { status: 400 })
    await prisma.cyberOffering.delete({ where: { id: BigInt(id) } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
