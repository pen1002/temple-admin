import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prismaMembers?: PrismaClient }
const prisma = globalForPrisma.prismaMembers ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaMembers = prisma

// 가족코드 자동 생성: MIR-2026-0001
function generateFamilyCode(templeCode: string, existingCount: number): string {
  const clean = templeCode.replace(/[^a-zA-Z]/g, '')
  const prefix = clean.slice(0, 3).toUpperCase()
  const year = new Date().getFullYear()
  return `${prefix}-${year}-${String(existingCount + 1).padStart(4, '0')}`
}

// 사찰 검증 헬퍼 (RLS 대용 — 모든 쿼리에 temple_id 강제)
async function getTemple(slug: string) {
  if (!slug) return null
  return prisma.temple.findUnique({ where: { code: slug }, select: { id: true, code: true } })
}

// GET /api/cyber/members?temple_slug=miraesa&q=홍길동&family_id=xxx
export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('temple_slug')
    if (!slug) return NextResponse.json({ error: 'temple_slug 필수' }, { status: 400 })

    const temple = await getTemple(slug)
    if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })

    const q = req.nextUrl.searchParams.get('q')?.trim()
    const familiesId = req.nextUrl.searchParams.get('family_id')
    const status = req.nextUrl.searchParams.get('status')
    const familyMembers = req.nextUrl.searchParams.get('family_members') // 가족 트리 조회용
    const limit = Math.min(200, parseInt(req.nextUrl.searchParams.get('limit') || '100'))

    // 가족 구성원 조회 (카드 펼침 시)
    if (familyMembers) {
      const members = await prisma.believer.findMany({
        where: { families_id: familyMembers, temple_id: temple.id },
        select: { id: true, full_name: true, relation_type: true, gender: true, is_deceased: true, status: true },
        orderBy: { created_at: 'asc' },
      })
      return NextResponse.json(members)
    }

    // RLS: temple_id 강제 필터
    const where: Record<string, unknown> = { temple_id: temple.id }
    if (q) {
      where.OR = [
        { full_name: { contains: q } },
        { buddhist_name: { contains: q } },
        { phone: { contains: q } },
      ]
    }
    if (familiesId) where.families_id = familiesId
    if (status) where.status = status

    const believers = await prisma.believer.findMany({
      where,
      include: {
        family: { select: { id: true, family_code: true, head_name: true, address: true, sms_consent: true } },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    })

    return NextResponse.json(believers)
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

// POST /api/cyber/members — 신도 등록
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      temple_slug, is_new_family, families_id,
      head_name, family_address, family_memo,
      full_name, buddhist_name, gender, birth_date, is_lunar,
      phone, address, relation_type, sms_consent,
      initiation_date, memo, vow_text,
      is_deceased, death_date, ancestor_type, prayer_tags,
    } = body

    if (!temple_slug || !full_name?.trim()) {
      return NextResponse.json({ error: 'temple_slug, full_name 필수' }, { status: 400 })
    }

    const temple = await getTemple(temple_slug)
    if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })

    let targetFamilyId = families_id || null

    if (is_new_family) {
      const count = await prisma.family.count({ where: { temple_id: temple.id } })
      const familyCode = generateFamilyCode(temple.code, count)
      const newFamily = await prisma.family.create({
        data: {
          temple_id: temple.id,
          family_code: familyCode,
          head_name: head_name?.trim() || full_name.trim(),
          address: family_address?.trim() || null,
          memo: family_memo?.trim() || null,
          sms_consent: sms_consent || false,
        },
      })
      targetFamilyId = newFamily.id
    }

    const memoText = [memo?.trim(), vow_text?.trim() ? `[발원문] ${vow_text.trim()}` : ''].filter(Boolean).join('\n') || null

    const believer = await prisma.believer.create({
      data: {
        temple_id: temple.id,
        families_id: targetFamilyId,
        full_name: full_name.trim(),
        buddhist_name: buddhist_name?.trim() || null,
        gender: gender || null,
        birth_date: birth_date ? new Date(birth_date) : null,
        is_lunar: is_lunar ?? true,
        phone: phone?.trim() || null,
        address: address?.trim() || null,
        relation_type: relation_type || 'self',
        sms_consent: sms_consent || false,
        initiation_date: initiation_date ? new Date(initiation_date) : null,
        memo: memoText,
        status: is_deceased ? '망자' : '활동',
        is_deceased: is_deceased || false,
        death_date: death_date ? new Date(death_date) : null,
        ancestor_type: ancestor_type || null,
        prayer_tags: prayer_tags || null,
      },
      include: { family: true },
    })

    return NextResponse.json({ ok: true, id: believer.id, family_code: believer.family?.family_code })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

// PATCH /api/cyber/members — 신도 수정
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, temple_slug, ...updates } = body
    if (!id) return NextResponse.json({ error: 'id 필수' }, { status: 400 })

    // RLS: 수정 대상이 해당 사찰 소속인지 검증
    if (temple_slug) {
      const temple = await getTemple(temple_slug)
      if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })
      const target = await prisma.believer.findUnique({ where: { id }, select: { temple_id: true } })
      if (target?.temple_id !== temple.id) return NextResponse.json({ error: '권한 없음' }, { status: 403 })
    }

    if (updates.birth_date) updates.birth_date = new Date(updates.birth_date)
    if (updates.initiation_date) updates.initiation_date = new Date(updates.initiation_date)
    if (updates.death_date) updates.death_date = new Date(updates.death_date)

    await prisma.believer.update({ where: { id }, data: updates })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

// DELETE /api/cyber/members — soft delete (탈퇴)
export async function DELETE(req: NextRequest) {
  try {
    const { id, temple_slug } = await req.json()
    if (!id) return NextResponse.json({ error: 'id 필수' }, { status: 400 })

    // RLS: 소속 사찰 검증
    if (temple_slug) {
      const temple = await getTemple(temple_slug)
      if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })
      const target = await prisma.believer.findUnique({ where: { id }, select: { temple_id: true } })
      if (target?.temple_id !== temple.id) return NextResponse.json({ error: '권한 없음' }, { status: 403 })
    }

    await prisma.believer.update({ where: { id }, data: { status: '탈퇴' } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
