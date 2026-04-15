import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prismaMycard?: PrismaClient }
const prisma = globalForPrisma.prismaMycard ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaMycard = prisma

// GET /api/cyber/mycard?code=MIR-2026-0001&temple=miraesa
export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code')?.trim()
    const slug = req.nextUrl.searchParams.get('temple')
    if (!code || !slug) return NextResponse.json({ error: 'code, temple 필수' }, { status: 400 })

    const temple = await prisma.temple.findUnique({ where: { code: slug }, select: { id: true } })
    if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })

    // 축원번호로 신도 조회
    const believer = await prisma.believer.findFirst({
      where: { chukwon_no: code, temple_id: temple.id },
      select: {
        id: true, full_name: true, buddhist_name: true, gender: true, chukwon_no: true,
        familyMembers: { select: { name: true, relation_type: true }, orderBy: { sort_order: 'asc' } },
        believerOfferings: { where: { status: 'active' }, select: { offering_type: true, participant_name: true, status: true, created_at: true } },
      },
    })

    if (!believer) return NextResponse.json({ error: '조회 결과 없음' }, { status: 404 })

    // 보안 필터: 비고/영가/행효/주소 제외
    return NextResponse.json({
      chukwon_no: believer.chukwon_no,
      head_name: believer.full_name,
      buddhist_name: believer.buddhist_name,
      family_count: believer.familyMembers.length + 1,
      offerings: believer.believerOfferings.map(o => ({
        type: o.offering_type,
        participant_name: o.participant_name,
        status: o.status,
      })),
    })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
