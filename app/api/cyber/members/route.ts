import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { checkTempleAuth } from '@/lib/auth/templeAuth'


function generateChukwonNo(templeCode: string, count: number): string {
  const prefix = templeCode.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase()
  return `${prefix}-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`
}

async function getTemple(slug: string) {
  if (!slug) return null
  return prisma.temple.findUnique({ where: { code: slug }, select: { id: true, code: true } })
}

// GET
export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('temple_slug')
    if (!slug) return NextResponse.json({ error: 'temple_slug 필수' }, { status: 400 })

    // 인증 + 격리 검증
    const auth = await checkTempleAuth(req, slug)
    if (auth instanceof NextResponse) return auth

    const temple = await getTemple(slug)
    if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })

    const q = req.nextUrl.searchParams.get('q')?.trim()
    const familyMembers = req.nextUrl.searchParams.get('family_members')
    const limit = Math.min(200, parseInt(req.nextUrl.searchParams.get('limit') || '100'))

    if (familyMembers) {
      return NextResponse.json(await prisma.believerFamily.findMany({
        where: { believer: { temple_id: temple.id }, believer_id: familyMembers },
        orderBy: { sort_order: 'asc' },
      }))
    }

    const where: Record<string, unknown> = { temple_id: temple.id }
    if (q) where.OR = [{ full_name: { contains: q } }, { buddhist_name: { contains: q } }, { phone: { contains: q } }]

    const believers = await prisma.believer.findMany({
      where,
      include: {
        family: { select: { id: true, family_code: true, head_name: true } },
        familyMembers: { orderBy: { sort_order: 'asc' } },
        haenghyo: { orderBy: { sort_order: 'asc' } },
        youngga: { orderBy: { sort_order: 'asc' } },
        believerOfferings: { where: { status: 'active' }, orderBy: { created_at: 'desc' } },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
    })
    return NextResponse.json(believers)
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

// POST — 가족/행효/영가/기도접수 동시 등록
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { temple_slug, full_name, buddhist_name, gender, gender_type, birth_year, birth_month, birth_day, is_lunar, phone, phone_land, address1, relation_type, sms_consent, memo, vow_text, extra_memo, is_deceased, death_date, ancestor_type,
      family = [], haenghyo = [], youngga = [], offerings = [],
      is_new_family, head_name, family_address,
    } = body

    if (!temple_slug || !full_name?.trim()) return NextResponse.json({ error: 'temple_slug, full_name 필수' }, { status: 400 })

    // 인증 + 격리 검증
    const auth = await checkTempleAuth(req, temple_slug)
    if (auth instanceof NextResponse) return auth

    const temple = await getTemple(temple_slug)
    if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })

    // 축원번호 생성
    const count = await prisma.believer.count({ where: { temple_id: temple.id } })
    const chukwon_no = generateChukwonNo(temple.code, count)

    // 가족 그룹
    let familiesId = null
    if (is_new_family) {
      const famCount = await prisma.family.count({ where: { temple_id: temple.id } })
      const familyCode = generateChukwonNo(temple.code, famCount)
      const fam = await prisma.family.create({ data: { temple_id: temple.id, family_code: familyCode, head_name: head_name?.trim() || full_name.trim(), address: family_address?.trim() || null, sms_consent: sms_consent || false } })
      familiesId = fam.id
    }

    const memoText = [memo?.trim(), vow_text?.trim() ? `[발원문] ${vow_text.trim()}` : ''].filter(Boolean).join('\n') || null

    const believer = await prisma.believer.create({
      data: {
        temple_id: temple.id, families_id: familiesId,
        full_name: full_name.trim(), buddhist_name: buddhist_name?.trim() || null,
        gender: gender || null, gender_type: gender_type || 'gonmyeong',
        birth_year, birth_month, birth_day, birth_date: null,
        is_lunar: is_lunar ?? true, phone: phone?.trim() || null, phone_land: phone_land?.trim() || null,
        address: null, address1: address1?.trim() || null,
        relation_type: relation_type || 'self', sms_consent: sms_consent || false,
        memo: memoText, status: is_deceased ? '망자' : '활동',
        is_deceased: is_deceased || false, death_date: death_date ? new Date(death_date) : null,
        ancestor_type: ancestor_type || null,
        extra_memo: extra_memo?.trim()?.slice(0, 1000) || null, chukwon_no,
      },
    })

    // 가족 구성원
    if (family.length > 0) {
      await prisma.believerFamily.createMany({
        data: family.map((f: Record<string, unknown>, i: number) => ({
          believer_id: believer.id, relation_type: f.relation_type as string || '기타',
          gender_type: f.gender_type as string || 'gonmyeong', name: f.name as string || '',
          birth_year: f.birth_year as string, birth_month: f.birth_month as string,
          birth_day: f.birth_day as string, is_lunar: (f.is_lunar as boolean) || false,
          birth_event: f.birth_event as string, sort_order: i,
        })),
      })
    }

    // 행효 (최대 3)
    if (haenghyo.length > 0) {
      await prisma.believerHaenghyo.createMany({
        data: haenghyo.slice(0, 3).map((h: Record<string, unknown>, i: number) => ({
          believer_id: believer.id, name: h.name as string || '',
          birth_year: h.birth_year as string, birth_month: h.birth_month as string,
          birth_day: h.birth_day as string, is_lunar: (h.is_lunar as boolean) || false,
          relation_type: h.relation_type as string || '자', sort_order: i,
        })),
      })
    }

    // 영가 (최대 10)
    if (youngga.length > 0) {
      await prisma.believerYoungga.createMany({
        data: youngga.slice(0, 10).map((y: Record<string, unknown>, i: number) => ({
          believer_id: believer.id, name: y.name as string || '',
          birth_year: y.birth_year as string, death_year: y.death_year as string,
          relation_type: y.relation_type as string, memo: y.memo as string,
          jesa_date: y.jesa_date as string, jesa_lunar: (y.jesa_lunar as boolean) ?? true, sort_order: i,
        })),
      })
    }

    return NextResponse.json({ ok: true, id: believer.id, chukwon_no })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

// PATCH
export async function PATCH(req: NextRequest) {
  try {
    const { id, temple_slug, ...updates } = await req.json()
    if (!id) return NextResponse.json({ error: 'id 필수' }, { status: 400 })
    if (temple_slug) {
      const auth = await checkTempleAuth(req, temple_slug)
      if (auth instanceof NextResponse) return auth
      const temple = await getTemple(temple_slug)
      if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })
      const t = await prisma.believer.findUnique({ where: { id }, select: { temple_id: true } })
      if (t?.temple_id !== temple.id) return NextResponse.json({ error: '권한 없음' }, { status: 403 })
    }
    if (updates.birth_date) updates.birth_date = new Date(updates.birth_date)
    if (updates.death_date) updates.death_date = new Date(updates.death_date)
    await prisma.believer.update({ where: { id }, data: updates })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

// DELETE (soft)
export async function DELETE(req: NextRequest) {
  try {
    const { id, temple_slug, role } = await req.json()
    if (!id) return NextResponse.json({ error: 'id 필수' }, { status: 400 })
    if (temple_slug) {
      const auth = await checkTempleAuth(req, temple_slug)
      if (auth instanceof NextResponse) return auth
      const temple = await getTemple(temple_slug)
      if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })
      const t = await prisma.believer.findUnique({ where: { id }, select: { temple_id: true } })
      if (t?.temple_id !== temple.id) return NextResponse.json({ error: '권한 없음' }, { status: 403 })
    }
    if (role === 'super') {
      await prisma.believer.delete({ where: { id } })
    } else {
      await prisma.believer.update({ where: { id }, data: { status: '탈퇴' } })
    }
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
