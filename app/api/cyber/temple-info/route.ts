import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const revalidate = 300 // 5분 캐시


// GET /api/cyber/temple-info?slug=miraesa
export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug) return NextResponse.json({ error: 'slug 필수' }, { status: 400 })

  const temple = await prisma.temple.findUnique({
    where: { code: slug },
    select: {
      name: true, nameEn: true, denomination: true,
      abbotName: true, phone: true, address: true,
      bank_name: true, bank_account: true, bank_holder: true,
      kakao_notify_tel: true, pin: true,
      temple_rank: true,
    },
  })
  if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })

  return NextResponse.json(temple)
}
