import { NextRequest, NextResponse } from 'next/server'
import { getSuperSession } from '@/lib/superAuth'
import { db } from '@/lib/db'
import { Prisma } from '@prisma/client'

// ── 사찰 목록 조회 (페이지네이션 + 검색 + 필터) ────────────────────────────
export async function GET(req: NextRequest) {
  if (!await getSuperSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page  = Math.max(1, parseInt(searchParams.get('page')  ?? '1',  10))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)))
  const search      = searchParams.get('search')?.trim()      ?? ''
  const tierParam   = searchParams.get('tier')?.trim()        ?? ''
  const denomination = searchParams.get('denomination')?.trim() ?? ''

  const where: Prisma.TempleWhereInput = {
    ...(search && {
      OR: [
        { name:   { contains: search, mode: 'insensitive' } },
        { code:   { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
      ],
    }),
    ...(tierParam && { tier: parseInt(tierParam, 10) }),
    ...(denomination && { denomination: { contains: denomination, mode: 'insensitive' } }),
  }

  const [temples, totalCount] = await Promise.all([
    db.temple.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      include: { _count: { select: { blockConfigs: true } } },
      skip:  (page - 1) * limit,
      take:  limit,
    }),
    db.temple.count({ where }),
  ])

  return NextResponse.json({
    temples,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
    },
  })
}

// ── 사찰 등록 (upsert) ──────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!await getSuperSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { temple: t, blocks } = body

  if (!t?.code || !t?.name || !t?.tier) {
    return NextResponse.json({ error: '필수 필드 누락: code, name, tier' }, { status: 400 })
  }

  try {
    const temple = await db.temple.upsert({
      where: { code: t.code },
      update: {
        name: t.name,
        tier: Number(t.tier),
        ...(t.nameEn !== undefined && { nameEn: t.nameEn }),
        ...(t.description !== undefined && { description: t.description }),
        ...(t.address !== undefined && { address: t.address }),
        ...(t.phone !== undefined && { phone: t.phone }),
        ...(t.email !== undefined && { email: t.email }),
        ...(t.denomination !== undefined && { denomination: t.denomination }),
        ...(t.abbotName !== undefined && { abbotName: t.abbotName }),
        ...(t.foundedYear !== undefined && { foundedYear: Number(t.foundedYear) }),
        ...(t.primaryColor !== undefined && { primaryColor: t.primaryColor }),
        ...(t.secondaryColor !== undefined && { secondaryColor: t.secondaryColor }),
        ...(t.themeColor !== undefined && { themeColor: t.themeColor }),
        ...(t.isActive !== undefined && { isActive: Boolean(t.isActive) }),
      },
      create: {
        code: t.code,
        name: t.name,
        tier: Number(t.tier),
        nameEn: t.nameEn,
        description: t.description,
        address: t.address,
        phone: t.phone,
        email: t.email,
        denomination: t.denomination ?? '대한불교 조계종',
        abbotName: t.abbotName,
        foundedYear: t.foundedYear ? Number(t.foundedYear) : undefined,
        primaryColor: t.primaryColor ?? '#8B2500',
        secondaryColor: t.secondaryColor ?? '#C5A572',
        themeColor: t.themeColor ?? 'golden-lotus',
        isActive: t.isActive ?? true,
      },
    })

    // 블록 재생성
    if (Array.isArray(blocks) && blocks.length > 0) {
      await db.blockConfig.deleteMany({ where: { templeId: temple.id } })
      await db.blockConfig.createMany({
        data: blocks.map((b: { blockType: string; label?: string; order: number; isVisible?: boolean; config?: object }) => ({
          templeId: temple.id,
          blockType: b.blockType,
          label: b.label,
          order: b.order,
          isVisible: b.isVisible ?? true,
          config: (b.config ?? {}) as object,
        })),
      })
    }

    const blockCount = blocks?.length ?? 0
    return NextResponse.json({ ok: true, id: temple.id, code: temple.code, name: temple.name, blockCount })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
