import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prismaMycard?: PrismaClient }
const prisma = globalForPrisma.prismaMycard ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaMycard = prisma

// GET /api/cyber/mycard?name=홍길동&temple=miraesa(&phone_last4=1234)
export async function GET(req: NextRequest) {
  try {
    const name = req.nextUrl.searchParams.get('name')?.trim()
    const slug = req.nextUrl.searchParams.get('temple')
    const phoneLast4 = req.nextUrl.searchParams.get('phone_last4')
    // 레거시: code 파라미터도 지원
    const code = req.nextUrl.searchParams.get('code')?.trim()

    if (!slug) return NextResponse.json({ error: 'temple 필수' }, { status: 400 })
    if (!name && !code) return NextResponse.json({ error: 'name 또는 code 필수' }, { status: 400 })

    const temple = await prisma.temple.findUnique({ where: { code: slug }, select: { id: true } })
    if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })

    // 1차: believers에서 검색
    let where: Record<string, unknown> = { temple_id: temple.id, status: '활동' }
    if (code) {
      where.chukwon_no = code
    } else if (name) {
      where.OR = [{ full_name: { contains: name } }, { buddhist_name: { contains: name } }]
      if (phoneLast4) where.phone = { endsWith: phoneLast4 }
    }

    let believers = await prisma.believer.findMany({
      where,
      select: {
        id: true, full_name: true, buddhist_name: true, chukwon_no: true, phone: true,
        familyMembers: { select: { name: true, relation_type: true }, orderBy: { sort_order: 'asc' } },
        believerOfferings: { where: { status: 'active' }, select: { offering_type: true, participant_name: true, status: true } },
      },
    })

    // 2차: believers에서 못 찾으면 believerOfferings.participant_name에서 검색
    if (believers.length === 0 && name) {
      const offerings = await prisma.believerOffering.findMany({
        where: { temple_id: temple.id, participant_name: { contains: name }, status: 'active' },
        select: { offering_type: true, participant_name: true, status: true },
      })
      if (offerings.length > 0) {
        // 기도접수만 있고 신도카드 미등록인 경우
        return NextResponse.json({
          full_name: name,
          buddhist_name: null,
          chukwon_no: null,
          family_count: 1,
          offerings: offerings.map(o => ({
            type: o.offering_type,
            participant_name: o.participant_name,
            status: o.status,
          })),
        })
      }
    }

    if (believers.length === 0) return NextResponse.json({ error: '등록된 신도를 찾을 수 없습니다.' }, { status: 404 })

    // 동명이인
    if (believers.length > 1 && !phoneLast4 && !code) {
      return NextResponse.json({ multiple: true, count: believers.length })
    }

    const b = believers[0]
    return NextResponse.json({
      full_name: b.full_name,
      buddhist_name: b.buddhist_name,
      chukwon_no: b.chukwon_no,
      family_count: b.familyMembers.length + 1,
      offerings: b.believerOfferings.map(o => ({
        type: o.offering_type,
        participant_name: o.participant_name,
        status: o.status,
      })),
    })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
