import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { MEMBER_AUTH } from '@/lib/constants/memberAuth'

const globalForPrisma = global as unknown as { prismaAuth?: PrismaClient }
const prisma = globalForPrisma.prismaAuth ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaAuth = prisma

// POST — PIN 인증
export async function POST(req: NextRequest) {
  try {
    const { pin, temple_slug } = await req.json()
    if (!pin || !temple_slug) return NextResponse.json({ error: 'pin, temple_slug 필수' }, { status: 400 })

    // 슈퍼 PIN
    if (pin === MEMBER_AUTH.superPin) {
      return NextResponse.json({ role: 'super', pin_changed: true })
    }

    // 사찰 관리자 PIN
    const temple = await prisma.temple.findUnique({
      where: { code: temple_slug },
      select: { admin_pin: true, pin_changed: true },
    })
    if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })

    if (pin === temple.admin_pin) {
      return NextResponse.json({ role: 'admin', pin_changed: temple.pin_changed })
    }

    return NextResponse.json({ error: 'PIN 불일치' }, { status: 401 })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

// PATCH — PIN 변경
export async function PATCH(req: NextRequest) {
  try {
    const { current_pin, new_pin, temple_slug } = await req.json()
    if (!temple_slug || !current_pin || !new_pin) return NextResponse.json({ error: '필수 필드 누락' }, { status: 400 })
    if (new_pin.length < 4 || new_pin.length > 6) return NextResponse.json({ error: 'PIN은 4~6자리' }, { status: 400 })

    const temple = await prisma.temple.findUnique({ where: { code: temple_slug }, select: { admin_pin: true } })
    if (!temple) return NextResponse.json({ error: '사찰 없음' }, { status: 404 })

    // 현재 PIN 또는 슈퍼 PIN으로 검증
    if (current_pin !== temple.admin_pin && current_pin !== MEMBER_AUTH.superPin) {
      return NextResponse.json({ error: '현재 PIN 불일치' }, { status: 401 })
    }

    await prisma.temple.update({
      where: { code: temple_slug },
      data: { admin_pin: new_pin, pin_changed: true },
    })

    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}
