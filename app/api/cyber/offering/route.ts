import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = global as unknown as { prismaCyber?: PrismaClient }
const prisma = globalForPrisma.prismaCyber ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaCyber = prisma

const VALID_TYPES = ['bow', 'memorial', 'prayer', 'candle', 'indung', 'yeondeung'] as const

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { temple_slug, type, name, contact, deceased, relationship, prayer_kind, wish, amount } = body

    if (!temple_slug || !type || !name?.trim()) {
      return NextResponse.json({ error: 'temple_slug, type, name 필수' }, { status: 400 })
    }
    const isValidType = VALID_TYPES.includes(type) || type.startsWith('prayer_')
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

    return NextResponse.json({ ok: true, id: row.id.toString() })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'unknown' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const slug = req.nextUrl.searchParams.get('temple_slug')
    const type = req.nextUrl.searchParams.get('type')
    const limit = Math.min(200, parseInt(req.nextUrl.searchParams.get('limit') || '50'))

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
