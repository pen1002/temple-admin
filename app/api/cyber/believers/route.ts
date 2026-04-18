import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireTempleAuth } from '@/lib/api/require-temple-auth'


// GET /api/cyber/believers?temple_slug=miraesa&q=홍길동&family_id=xxx
export async function GET(req: NextRequest) {
  try {
    // 인증: 사찰 존재 검증 + Origin 체크
    const auth = await requireTempleAuth(req, { allowPublic: false })
    if (auth instanceof NextResponse) return auth
    const slug = auth.templeSlug
    const q = req.nextUrl.searchParams.get('q')?.trim()
    const familyId = req.nextUrl.searchParams.get('family_id')
    const status = req.nextUrl.searchParams.get('status')
    const limit = Math.min(200, parseInt(req.nextUrl.searchParams.get('limit') || '50'))

    if (!slug) return NextResponse.json({ error: 'temple_slug 필수' }, { status: 400 })

    // 사찰 ID 조회
    const temple = await prisma.temple.findUnique({ where: { code: slug }, select: { id: true } })
    if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })

    const where: Record<string, unknown> = { temple_id: temple.id }
    if (q) {
      where.OR = [
        { full_name: { contains: q } },
        { buddhist_name: { contains: q } },
        { phone: { contains: q } },
      ]
    }
    if (familyId) where.family_id = familyId
    if (status) where.status = status

    const believers = await prisma.believer.findMany({
      where,
      orderBy: { created_at: 'desc' },
      take: limit,
    })

    return NextResponse.json(believers)
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

// POST /api/cyber/believers — 신도 등록
export async function POST(req: NextRequest) {
  try {
    const auth = await requireTempleAuth(req, { allowPublic: true, rateLimit: 10 })
    if (auth instanceof NextResponse) return auth

    const body = await req.json()
    const { temple_slug, full_name, buddhist_name, gender, birth_date, is_lunar,
            phone, address, family_id, family_relation, status, initiation_date, memo } = body

    if (!temple_slug || !full_name?.trim()) {
      return NextResponse.json({ error: 'temple_slug, full_name 필수' }, { status: 400 })
    }

    const temple = await prisma.temple.findUnique({ where: { code: temple_slug }, select: { id: true } })
    if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })

    const believer = await prisma.believer.create({
      data: {
        temple_id: temple.id,
        full_name: full_name.trim(),
        buddhist_name: buddhist_name?.trim() || null,
        gender: gender || null,
        birth_date: birth_date ? new Date(birth_date) : null,
        is_lunar: is_lunar ?? true,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        family_id: family_id || null,
        family_relation: family_relation?.trim() || null,
        status: status || '활동',
        initiation_date: initiation_date ? new Date(initiation_date) : null,
        memo: memo?.trim() || null,
      },
    })

    return NextResponse.json({ ok: true, id: believer.id })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

// PATCH /api/cyber/believers — 신도 수정
export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireTempleAuth(req, { allowPublic: false })
    if (auth instanceof NextResponse) return auth

    const body = await req.json()
    const { id, ...updates } = body
    if (!id) return NextResponse.json({ error: 'id 필수' }, { status: 400 })

    // 날짜 필드 변환
    if (updates.birth_date) updates.birth_date = new Date(updates.birth_date)
    if (updates.initiation_date) updates.initiation_date = new Date(updates.initiation_date)

    await prisma.believer.update({ where: { id }, data: updates })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

// DELETE /api/cyber/believers — 신도 삭제
export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireTempleAuth(req, { allowPublic: false })
    if (auth instanceof NextResponse) return auth

    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id 필수' }, { status: 400 })
    await prisma.believer.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
