import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { TEMPLE_OFFERINGS } from '@/lib/constants/templeOfferings'
import { checkTempleAuth } from '@/lib/auth/templeAuth'

const globalForPrisma = global as unknown as { prismaMO?: PrismaClient }
const prisma = globalForPrisma.prismaMO ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaMO = prisma

// POST — 기도접수 + cyber_offerings 연동
export async function POST(req: NextRequest) {
  try {
    const { believer_id, temple_slug, offering_type, participant_name, vow_text } = await req.json()
    if (!temple_slug || !offering_type || !participant_name?.trim()) {
      return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 })
    }

    // 인증 + 격리 검증
    const auth = await checkTempleAuth(req, temple_slug)
    if (auth instanceof NextResponse) return auth

    const temple = await prisma.temple.findUnique({ where: { code: temple_slug }, select: { id: true } })
    if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })

    const config = TEMPLE_OFFERINGS[temple_slug]
    const offeringConfig = config?.offerings.find(o => o.type === offering_type)
    const price = offeringConfig?.price || 0
    const period = offeringConfig?.period || '1년'
    const expiresAt = period === '1년' ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) : null

    // 1. believers_offerings INSERT
    const bo = await prisma.believerOffering.create({
      data: {
        believer_id: believer_id || null, temple_id: temple.id, offering_type,
        participant_name: participant_name.trim(),
        vow_text: vow_text?.trim() || null,
        price, period, expires_at: expiresAt, status: 'active',
      },
    })

    // 2. cyber_offerings INSERT (기존 카드 자동 연동)
    const co = await prisma.cyberOffering.create({
      data: {
        temple_slug, type: offering_type,
        name: participant_name.trim(),
        wish: vow_text?.trim() || null,
        vow_text: vow_text?.trim() || null,
        amount: price,
        believer_offering_id: bo.id,
      },
    })

    // 3. FK 업데이트
    await prisma.believerOffering.update({
      where: { id: bo.id },
      data: { cyber_offering_id: co.id.toString() },
    })

    return NextResponse.json({ ok: true, believer_offering_id: bo.id, cyber_offering_id: co.id.toString() })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

// DELETE — 기도접수 취소 (소등)
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'id 필수' }, { status: 400 })

    const bo = await prisma.believerOffering.findUnique({ where: { id }, include: { believer: { select: { temple: { select: { code: true } } } } } })
    if (!bo) return NextResponse.json({ error: '접수 없음' }, { status: 404 })

    // 소속 사찰 검증
    const slug = bo.believer?.temple?.code
    if (slug) {
      const auth = await checkTempleAuth(req, slug)
      if (auth instanceof NextResponse) return auth
    }

    // 비활성화
    await prisma.believerOffering.update({ where: { id }, data: { status: 'inactive' } })

    // cyber_offerings도 삭제 (소등)
    if (bo.cyber_offering_id) {
      await prisma.cyberOffering.delete({ where: { id: BigInt(bo.cyber_offering_id) } }).catch(() => {})
    }

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
